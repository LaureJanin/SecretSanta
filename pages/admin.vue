<template>
  <div class="admin-page">
    <h1>🎅 Administration des loteries</h1>

    <Loader v-if="loading" />
    <div v-else-if="error" class="error">{{ error.message }}</div>
    <div v-else-if="loteries.length === 0" class="no-loterie">
      <p>Aucune loterie… les lutins chôment 🧝</p>
      <button @click="router.push('/form')" class="btn-primary">Créer une loterie</button>
    </div>
    <div v-else>
      <div class="lottery-selector">
        <label>Choisis une loterie :</label>
        <div class="lottery-chips">
          <button
            v-for="lot in loteries"
            :key="lot.id"
            type="button"
            :class="['chip', { active: selectedLotteryId === lot.id }]"
            @click="selectLottery(lot.id)">
            🎁 {{ lot.name }} <small>({{ lot.year }})</small>
          </button>
        </div>
      </div>

      <div v-if="selectedLottery" class="lottery-details">
        <div class="lottery-header">
          <div class="lottery-header-top">
            <h2>{{ selectedLottery.name }} - {{ selectedLottery.year }}</h2>
            <button @click="handleDeleteLottery" class="btn-delete-lottery" title="Supprimer la loterie">🗑️</button>
          </div>
          <div class="lottery-stats">
            <span class="stat-badge">👥 {{ selectedLottery.participants.length }} participants</span>
            <span v-if="hasDrawBeenDone" class="stat-badge success">✅ Tirage effectué</span>
            <span v-else class="stat-badge warning">⏳ Tirage non effectué</span>
          </div>
        </div>

        <div class="tabs">
          <button
            :class="['tab', { active: activeTab === 'participants' }]"
            @click="activeTab = 'participants'">
            👥 Participants
          </button>
          <button
            :class="['tab', { active: activeTab === 'exclusions' }]"
            @click="activeTab = 'exclusions'">
            🚫 Exclusions
          </button>
          <button
            :class="['tab', { active: activeTab === 'actions' }]"
            @click="activeTab = 'actions'">
            ⚙️ Actions
          </button>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'participants'" class="participants-section">
            <div class="section-header">
              <h3>Gestion des participants</h3>
              <button @click="showAddParticipantForm = !showAddParticipantForm" class="btn-add">
                {{ showAddParticipantForm ? '✖ Annuler' : '➕ Ajouter un participant' }}
              </button>
            </div>

            <div v-if="showAddParticipantForm" class="add-participant-form card">
              <h4>Nouveau participant</h4>
              <form @submit.prevent="handleAddParticipant">
                <div class="form-row">
                  <div class="form-group">
                    <label>Nom *</label>
                    <input 
                      v-model="newParticipant.name" 
                      type="text" 
                      required 
                      placeholder="Prénom Nom"
                      maxlength="100"
                      aria-required="true"
                    />
                  </div>
                  <div class="form-group">
                    <label>Email</label>
                    <input 
                      v-model="newParticipant.email" 
                      type="email" 
                      placeholder="email@example.com"
                      maxlength="255"
                      autocomplete="email"
                    />
                  </div>
                </div>
                <button type="submit" :disabled="!newParticipant.name" class="btn-primary">Ajouter</button>
              </form>
            </div>

            <div class="participants-list">
              <div v-for="participant in selectedLottery.participants" :key="participant.id" class="participant-card">
                <div class="participant-info">
                  <h4><span class="avatar">{{ avatarFor(participant.name) }}</span>{{ participant.name }}</h4>
                  <p v-if="participant.email" class="email">📧 {{ participant.email }}</p>
                  <span v-if="participant.isActive" class="badge active">✅ Actif</span>
                  <span v-else class="badge inactive">👶 Enfant</span>
                </div>
                <div class="participant-actions">
                  <span class="gift-count">🎁 {{ participant.giftIdeas?.length || 0 }} idée(s)</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'exclusions'" class="exclusions-section">
            <div class="section-header">
              <h3>Règles d'exclusion</h3>
              <button @click="showAddExclusionForm = !showAddExclusionForm" class="btn-add">
                {{ showAddExclusionForm ? '✖ Annuler' : '➕ Ajouter une exclusion' }}
              </button>
            </div>

            <div v-if="showAddExclusionForm" class="add-exclusion-form card">
              <h4>Nouvelle exclusion</h4>
              <form @submit.prevent="handleAddExclusion">
                <div class="form-row">
                  <div class="form-group">
                    <label>Participant</label>
                    <select v-model="newExclusion.participantId" required>
                      <option value="">-- Choisir --</option>
                      <option v-for="p in activeParticipants" :key="p.id" :value="p.id">
                        {{ p.name }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Ne peut pas tirer</label>
                    <select v-model="newExclusion.excludedId" required>
                      <option value="">-- Choisir --</option>
                      <option
                        v-for="p in activeParticipants"
                        :key="p.id"
                        :value="p.id"
                        :disabled="p.id === newExclusion.participantId">
                        {{ p.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <button type="submit" :disabled="!newExclusion.participantId || !newExclusion.excludedId" class="btn-primary">
                  Ajouter l'exclusion
                </button>
              </form>
            </div>

            <div v-if="selectedLottery.exclusions && selectedLottery.exclusions.length > 0" class="exclusions-list">
              <div v-for="exclusion in selectedLottery.exclusions" :key="exclusion.id" class="exclusion-item">
                <span class="exclusion-text">
                  <strong>{{ exclusion.participant.name }}</strong> ne peut pas tirer <strong>{{ exclusion.excluded.name }}</strong>
                </span>
                <button @click="handleDeleteExclusion(exclusion.id)" class="btn-delete-exclusion" title="Supprimer cette exclusion">
                  🗑️
                </button>
              </div>
            </div>
            <div v-else class="no-data">
              Aucune exclusion : tout le monde peut tirer tout le monde 😈
            </div>
          </div>

          <div v-if="activeTab === 'actions'" class="actions-section">
            <h3>Actions administrateur</h3>

            <div class="action-cards">

              <div class="action-card">
                <h4>🎲 Effectuer le tirage au sort</h4>
                <p>Lance le tirage au sort en respectant les exclusions.</p>
                <button
                  @click="handlePerformDraw"
                  :disabled="performingDraw || activeParticipants.length < 2"
                  class="btn-warning">
                  {{ performingDraw ? 'Les lutins mélangent les papiers...' : 'Lancer le tirage' }}
                </button>
                <div v-if="performingDraw" class="shaking-gift">🎁</div>
                <p v-if="activeParticipants.length < 2" class="warning-text">
                  ⚠️ Il faut au moins 2 participants actifs (le Père Noël ne tire pas tout seul 🎅)
                </p>
                <div v-if="drawResult" class="result-message success">
                  🎉 Tirage fait ! Les lutins ont tout noté.
                </div>
              </div>

              <div class="action-card">
                <h4>🎁 Envoyer les résultats du tirage</h4>
                <p>Envoie un email à chaque participant avec le nom de la personne qu'il doit gâter.</p>
                <button
                  @click="handleSendDrawResults"
                  :disabled="sendingResults || !hasDrawBeenDone"
                  class="btn-warning">
                  {{ sendingResults ? 'Les rennes livrent les emails...' : 'Envoyer les résultats' }}
                </button>
                <p v-if="!hasDrawBeenDone" class="warning-text">
                  ⚠️ Le tirage doit être effectué d'abord
                </p>
                <div v-if="drawResultsResult" class="result-message" :class="drawResultsResult.success ? 'success' : 'error'">
                  {{ drawResultsResult.success
                    ? `✅ Emails envoyés, les rennes sont en route 🦌`
                    : `❌ Erreur: ${drawResultsResult.errors?.join(', ') || 'Erreur inconnue'}` }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="lottery-placeholder card">
        <span class="placeholder-arrow">👆</span>
        <h3>Choisis une loterie pour la gérer</h3>
        <p>Les lutins attendent tes ordres 🧝</p>
        <div class="placeholder-stats">
          <span class="stat-bubble">🎁 {{ loteries.length }} loterie(s)</span>
          <span class="stat-bubble">👥 {{ totalParticipants }} participant(s) au total</span>
          <span class="stat-bubble">🎲 {{ drawsDoneCount }} tirage(s) effectué(s)</span>
        </div>
        <button @click="router.push('/form')" class="btn-primary">➕ Créer une nouvelle loterie</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false })

import { ref, computed, onMounted } from 'vue'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useConfetti } from '~/composables/useConfetti'
import { validateEmail } from '~/utils/email'
import { avatarFor } from '~/utils/avatar'
import type { LotteryResponse, ParticipantResponse } from '~/types'
import {
  MY_OWNED_LOTTERIES_QUERY,
  ADD_PARTICIPANT_MUTATION,
  ADD_EXCLUSION_MUTATION,
  DELETE_EXCLUSION_MUTATION,
  PERFORM_DRAW_MUTATION,
  SEND_DRAW_RESULTS_MUTATION,
  DELETE_LOTTERY_MUTATION
} from '~/graphql/queries'

const router = useRouter()
const { success, error: showError } = useToast()
const { confirm } = useConfirm()
const { confetti } = useConfetti()

const { requireAuth, getToken } = useAuth()
requireAuth()

const loading = ref(true)

const { result, load, error, refetch } = useLazyQuery(MY_OWNED_LOTTERIES_QUERY)

onMounted(async () => {
  if (process.client && getToken()) {
    try {
      await load()
      if (loteries.value.length === 1) selectedLotteryId.value = loteries.value[0].id
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})

const loteries = computed(() => result.value?.myOwnedLotteries || [])

const selectedLotteryId = ref('')
const activeTab = ref('participants')
const showAddParticipantForm = ref(false)
const showAddExclusionForm = ref(false)

const newParticipant = ref({ name: '', email: '', isActive: true })
const newExclusion = ref({ participantId: '', excludedId: '' })

const performingDraw = ref(false)
const sendingResults = ref(false)
const drawResult = ref<{ success: boolean; draws?: unknown[] } | null>(null)
const drawResultsResult = ref<{ success: boolean; errors?: string[] } | null>(null)

const selectedLottery = computed(() => {
  return loteries.value.find((l: LotteryResponse) => l.id === selectedLotteryId.value)
})

const activeParticipants = computed(() => {
  return selectedLottery.value?.participants?.filter((p: ParticipantResponse) => p.isActive) || []
})

const hasDrawBeenDone = computed(() => {
  return selectedLottery.value?.draws && selectedLottery.value.draws.length > 0
})

const totalParticipants = computed(() => {
  return loteries.value.reduce((total: number, l: LotteryResponse) => total + l.participants.length, 0)
})

const drawsDoneCount = computed(() => {
  return loteries.value.filter((l: LotteryResponse) => l.draws && l.draws.length > 0).length
})

const { mutate: addParticipant } = useMutation(ADD_PARTICIPANT_MUTATION)
const { mutate: addExclusion } = useMutation(ADD_EXCLUSION_MUTATION)
const { mutate: deleteExclusion } = useMutation(DELETE_EXCLUSION_MUTATION)
const { mutate: performDraw } = useMutation(PERFORM_DRAW_MUTATION)
const { mutate: sendDrawResults } = useMutation(SEND_DRAW_RESULTS_MUTATION)
const { mutate: deleteLottery } = useMutation(DELETE_LOTTERY_MUTATION)
function selectLottery(id: string) {
  selectedLotteryId.value = id
  onLotteryChange()
}

function onLotteryChange() {
  activeTab.value = 'participants'
  showAddParticipantForm.value = false
  showAddExclusionForm.value = false
  drawResult.value = null
  drawResultsResult.value = null
}

async function handleAddParticipant() {
  if (newParticipant.value.email && !validateEmail(newParticipant.value.email)) {
    showError('Format d\'email invalide')
    return
  }

  try {
    await addParticipant({
      lotteryId: selectedLotteryId.value,
      name: newParticipant.value.name,
      email: newParticipant.value.email || null,
      isActive: newParticipant.value.isActive
    })

    newParticipant.value = { name: '', email: '', isActive: true }
    showAddParticipantForm.value = false
    await refetch()
    success('Un participant de plus dans la hotte ! 🎁')
  } catch (err: unknown) {
    showError('Erreur lors de l\'ajout du participant')
  }
}

async function handleAddExclusion() {
  try {
    await addExclusion({
      lotteryId: selectedLotteryId.value,
      participantId: newExclusion.value.participantId,
      excludedId: newExclusion.value.excludedId
    })

    newExclusion.value = { participantId: '', excludedId: '' }
    showAddExclusionForm.value = false
    await refetch()
    success('Exclusion notée, promis personne ne le saura 🤫')
  } catch (err: unknown) {
    showError('Erreur lors de l\'ajout de l\'exclusion')
  }
}

async function handleDeleteExclusion(exclusionId: string) {
  const confirmed = await confirm({
    title: 'Supprimer l\'exclusion',
    message: 'Supprimer cette règle d\'exclusion ?',
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    type: 'danger'
  })

  if (!confirmed) return

  try {
    await deleteExclusion({ exclusionId })
    await refetch()
    success('Exclusion supprimée, on s\'est réconciliés 🤝')
  } catch (err: unknown) {
    showError('Erreur lors de la suppression de l\'exclusion')
  }
}


async function handlePerformDraw() {
  const confirmed = await confirm({
    title: 'Effectuer le tirage',
    message: 'Effectuer le tirage au sort maintenant ? Cette action remplacera un éventuel tirage précédent.',
    confirmText: 'Effectuer le tirage',
    cancelText: 'Annuler',
    type: 'warning'
  })

  if (!confirmed) return

  performingDraw.value = true
  drawResult.value = null

  try {
    // Petite pause pour laisser les lutins « mélanger les papiers »
    const [result] = await Promise.all([
      performDraw({ lotteryId: selectedLotteryId.value }),
      new Promise(resolve => setTimeout(resolve, 1500))
    ])
    drawResult.value = result?.data?.performDraw
    await refetch()
    success('Tirage effectué ! 🎉')
    confetti()
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur lors du tirage'
    showError(errorMessage)
  } finally {
    performingDraw.value = false
  }
}

async function handleDeleteLottery() {
  const confirmed = await confirm({
    title: 'Supprimer la loterie',
    message: `Êtes-vous sûr de vouloir supprimer la loterie "${selectedLottery.value?.name}" ? Cette action est irréversible et supprimera tous les participants, exclusions, tirages et idées cadeaux associés.`,
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    type: 'danger'
  })

  if (!confirmed) return

  try {
    await deleteLottery({ lotteryId: selectedLotteryId.value })
    selectedLotteryId.value = ''
    await refetch()
    if (process.client) {
      sessionStorage.setItem('lottery-just-deleted', 'true')
      window.dispatchEvent(new Event('lottery-deleted'))
    }
    success('Loterie supprimée, adieu les cadeaux 👋')
  } catch (err: unknown) {
    showError('Erreur lors de la suppression de la loterie')
  }
}

async function handleSendDrawResults() {
  const confirmed = await confirm({
    title: 'Envoyer les résultats',
    message: 'Envoyer les résultats du tirage par email à tous les participants ?',
    confirmText: 'Envoyer',
    cancelText: 'Annuler',
    type: 'info'
  })

  if (!confirmed) return

  sendingResults.value = true
  drawResultsResult.value = null

  try {
    const result = await sendDrawResults({ lotteryId: selectedLotteryId.value })
    drawResultsResult.value = result?.data?.sendDrawResults
  } catch (err: unknown) {
    drawResultsResult.value = { success: false, errors: ['Erreur réseau'] }
    showError('Erreur lors de l\'envoi des résultats')
  } finally {
    sendingResults.value = false
  }
}
</script>

<style scoped>
.lottery-placeholder {
  width: 60%;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  box-sizing: border-box;
}

.placeholder-arrow {
  display: block;
  font-size: 3rem;
  animation: bounce-up 1.2s ease-in-out infinite;
}

@keyframes bounce-up {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.placeholder-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-sm);
  margin: var(--spacing-lg) 0;
}

.stat-bubble {
  background: var(--color-warning-bg);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-badge);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}

.shaking-gift {
  font-size: 3rem;
  text-align: center;
  margin-top: var(--spacing-md);
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg) scale(1.1); }
  75% { transform: rotate(15deg) scale(1.1); }
}

.admin-page {
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
  box-sizing: border-box;
}

.lottery-selector {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  margin: var(--spacing-xl) auto;
  box-shadow: var(--shadow-md);
  width: 60%;
  max-width: 100%;
  box-sizing: border-box;
}

.lottery-selector label {
  display: block;
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.lottery-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.chip {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  background: var(--color-bg-card);
  color: var(--color-text);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius-badge);
}

.chip:hover:not(:disabled) {
  background: var(--color-warning-bg);
  color: var(--color-text);
  border-color: var(--color-gold);
}

.chip.active {
  background: var(--color-accent);
  color: var(--color-text-inverse);
  border-color: var(--color-accent);
}

.chip.active:hover:not(:disabled) {
  background: var(--color-accent);
  color: var(--color-text-inverse);
}

.lottery-details {
  background: var(--color-bg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  width: 60%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.lottery-header {
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  color: var(--color-text-inverse);
}

.lottery-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.lottery-header h2 {
  margin: 0;
  color: var(--color-text-inverse);
}

.btn-delete-lottery {
  background: var(--color-secondary);
  border: none;
  color: var(--color-text-inverse);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-delete-lottery:hover {
  background: var(--color-text-lighter);
  transform: scale(1.05);
}

.lottery-stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.stat-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-badge);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.stat-badge.success {
  background: rgba(255, 255, 255, 0.3);
}

.tabs {
  display: flex;
}

.tab {
  flex: 1;
  padding: var(--spacing-md);
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-light);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  box-shadow: none;
  border-radius: 0;
}

.tab:hover {
  background: var(--color-bg-light);
  color: var(--color-accent);
}

.tab.active {
  color: var(--color-accent);
  background: var(--color-bg-light);
  border-bottom-color: var(--color-accent);
  font-weight: var(--font-weight-bold);
}

.tab-content {
  padding: var(--spacing-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.section-header h3 {
  margin: 0;
  color: var(--color-primary);
}

.btn-add {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background var(--transition-base);
  margin-left: var(--spacing-md);
}

.btn-add:hover {
  background: var(--color-primary-dark);
}

.card {
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
}

.card h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.participants-list {
  display: grid;
  gap: var(--spacing-md);
}

.participant-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-bg-card);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  border-left: 6px solid var(--color-accent);
  transition: transform var(--transition-base);
}

.participant-card:nth-child(even) {
  border-left-color: var(--color-primary);
}

.participant-card:hover {
  transform: translateY(-2px);
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-right: var(--spacing-sm);
  border-radius: 50%;
  background: var(--color-warning-bg);
}

.participant-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.participant-info h4 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text);
  text-align: left;
}

.participant-info p {
  margin: var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  text-align: left;
}

.badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  margin-top: var(--spacing-sm);
}

.badge.active {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.badge.inactive {
  background: var(--color-warning-bg);
  color: #856404;
}

.participant-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.gift-count {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  text-align: right;
}

.exclusions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.exclusion-item {
  background: var(--color-bg-card);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exclusion-text {
  color: var(--color-text);
  flex: 1;
}

.btn-delete-exclusion {
  background: transparent;
  border: none;
  box-shadow: none;
  font-size: var(--font-size-xl);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  transition: background var(--transition-base);
}

.btn-delete-exclusion:hover {
  background: var(--color-error-bg);
}

.error {
  text-align: center;
  padding: var(--spacing-xl);
  font-size: var(--font-size-lg);
  color: var(--color-error);
}

.no-data {
  text-align: center;
  color: var(--color-text-lighter);
  padding: var(--spacing-xl);
}

.no-loterie {
  text-align: center;
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.no-loterie p {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text);
}

.action-cards {
  display: grid;
  gap: var(--spacing-lg);
}

.action-card {
  background: var(--color-bg-card);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
}

.action-card h4 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-primary);
}

.action-card p {
  text-align: center;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text-light);
}

.btn-warning {
  display: block;
  margin: 0 auto;
  background: var(--color-warning);
  color: var(--color-text);
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background var(--transition-base);
}

.btn-warning:hover:not(:disabled) {
  background: #e0a800;
}

.warning-text {
  color: #856404;
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-sm);
}

.result-message {
  text-align: center;
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-semibold);
}

.result-message.success {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.result-message.error {
  background: var(--color-error-bg);
  color: var(--color-error);
}

@media (max-width: 768px) {
  .admin-page {
    padding: var(--spacing-md) var(--spacing-sm);
    margin-left: var(--spacing-sm);
    margin-right: var(--spacing-sm);
    width: calc(100% - var(--spacing-sm) * 2);
  }
  .lottery-selector {
    width: 100%;
  }
  .lottery-placeholder,
  .lottery-details {
    width: 100%;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .participant-card {
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-md);
  }
  .participant-info {
    align-items: flex-start;
    flex: 1;
  }
  .participant-actions {
    align-items: center;
    justify-content: flex-end;
  }
  .tabs {
    flex-direction: column;
    border: none;
  }
  
  .tab {
    border-bottom: 2px solid var(--border-color);
    text-align: center;
    border-radius: 0;
  }
  
  .tab.active {
    border: none;
    border-bottom: 1px solid var(--border-color);
    background: var(--color-success-bg);
    border-radius: 0;
  }
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-add {
    margin-left: 0;
    width: 100%;
  }
  .add-participant-form .btn-primary {
    display: block;
    margin: 0 auto;
    width: auto;
    min-width: 150px;
  }
}
</style>

