<template>
  <div class="gift-ideas-page">
    <div class="header">
      <h1>🎁 Mes idées cadeaux</h1>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">Erreur: {{ error?.message }}</div>
    <div v-else>
      <div class="intro">
        <p>Aide tes proches à trouver le cadeau parfait ! Ajoute tes idées de cadeaux pour que ton Père Noël secret sache ce qui te ferait plaisir.</p>
      </div>

      <div v-if="myLotteries.length === 0" class="no-lotteries">
        <p>Tu ne participes à aucune loterie pour le moment.</p>
      </div>

      <div v-for="lottery in myLotteries" :key="lottery.id" class="lottery-section card">
        <h2>{{ lottery.name }} ({{ lottery.year }})</h2>

        <div v-if="!getMyParticipant(lottery)" class="no-participant">
          <p>Vous n'êtes pas participant dans cette loterie.</p>
        </div>

        <div v-if="getMyParticipant(lottery)" class="my-ideas">
          <h3>Mes idées de cadeaux</h3>

          <div v-if="getMyParticipant(lottery)?.giftIdeas?.length" class="ideas-list">
            <div v-for="idea in getMyParticipant(lottery)?.giftIdeas" :key="idea.id" class="idea-card">
              <div class="idea-content">
                <h4>{{ idea.title }}</h4>
                <p v-if="idea.description">{{ idea.description }}</p>
                <a v-if="idea.link" :href="idea.link" target="_blank" class="idea-link">🔗 Voir le lien</a>
              </div>
              <button @click="handleDeleteIdea(idea.id)" class="btn-delete" title="Supprimer">🗑️</button>
            </div>
          </div>
          <div v-else class="no-ideas">
            Aucune idée cadeau pour le moment. Ajoute-en une ci-dessous ! 👇
          </div>

          <div class="add-idea-form">
            <h4>➕ Ajouter une idée</h4>
            <form @submit.prevent="() => { const participant = getMyParticipant(lottery); if (participant?.id) handleAddIdea(participant.id); }">
              <div class="form-group">
                <label>Titre *</label>
                <input v-model="newIdea.title" type="text" required placeholder="Ex: Un livre, un jeu vidéo...">
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea v-model="newIdea.description" placeholder="Précisions, genre préféré, taille..." rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Lien (optionnel)</label>
                <input v-model="newIdea.link" type="url" placeholder="https://...">
              </div>
              <button type="submit" :disabled="!newIdea.title">Ajouter cette idée</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ME_QUERY, MY_LOTERIES_QUERY, ADD_GIFT_IDEA_MUTATION, DELETE_GIFT_IDEA_MUTATION } from '~/graphql/queries'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import { compareEmails } from '~/utils/email'
import type { LotteryResponse, ParticipantResponse } from '~/types'

const { requireAuth } = useAuth()
const { success, error: showError } = useToast()

requireAuth()

const { result: meResult } = useQuery(ME_QUERY)
const { result, loading, error, refetch } = useQuery(MY_LOTERIES_QUERY)
const { mutate: addGiftIdea } = useMutation(ADD_GIFT_IDEA_MUTATION)
const { mutate: deleteGiftIdea } = useMutation(DELETE_GIFT_IDEA_MUTATION)

const newIdea = ref({ title: '', description: '', link: '' })

const userEmail = computed(() => {
  return meResult.value?.me?.email || ''
})

const myLotteries = computed(() => {
  return result.value?.myLotteries || []
})

function getMyParticipant(lottery: LotteryResponse): ParticipantResponse | undefined {
  if (!userEmail.value) return undefined
  return lottery.participants?.find((p: ParticipantResponse) => compareEmails(p.email, userEmail.value))
}

async function handleAddIdea(participantId: string) {
  if (!newIdea.value.title || !participantId) return

  try {
    const result = await addGiftIdea({
      participantId,
      title: newIdea.value.title,
      description: newIdea.value.description || null,
      link: newIdea.value.link || null
    })

    if (result?.data?.addGiftIdea) {
      newIdea.value = { title: '', description: '', link: '' }
      await refetch()
      success('Idée cadeau ajoutée !')
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
    showError('Erreur lors de l\'ajout : ' + errorMessage)
  }
}

async function handleDeleteIdea(giftIdeaId: string) {
  if (!confirm('Supprimer cette idée cadeau ?')) return

  try {
    await deleteGiftIdea({ giftIdeaId })
    await refetch()
    success('Idée supprimée !')
  } catch (err: unknown) {
    showError('Erreur lors de la suppression')
  }
}
</script>

<style scoped>
.gift-ideas-page {
  max-width: var(--max-width-lg);
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
  box-sizing: border-box;
}

.loading, .error {
  text-align: center;
  padding: var(--spacing-xl);
  font-size: var(--font-size-lg);
}

.error {
  color: var(--color-error);
}

.intro {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-text-inverse);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-xl);
  margin-top: var(--spacing-xl);
  text-align: center;
}

.intro p {
  margin: 0;
  font-size: var(--font-size-lg);
}

.no-lotteries {
  text-align: center;
  padding: var(--spacing-2xl);
  background: var(--color-bg-light);
  border-radius: var(--border-radius-lg);
}

.no-lotteries p {
  color: var(--color-text-light);
  font-size: var(--font-size-lg);
}

.lottery-section {
  margin-bottom: var(--spacing-xl);
}

.card {
  background: var(--color-bg-card);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
}

.lottery-section h2 {
  color: var(--color-primary);
  margin-top: 0;
  margin-bottom: var(--spacing-lg);
}

.my-ideas h3 {
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.ideas-list {
  margin-bottom: var(--spacing-xl);
}

.idea-card {
  background: var(--color-bg-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform var(--transition-base);
}

.idea-card:hover {
  transform: translateX(5px);
}

.idea-content {
  flex: 1;
}

.idea-content h4 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text);
  font-size: var(--font-size-lg);
}

.idea-content p {
  margin: var(--spacing-sm) 0;
  color: var(--color-text-light);
  line-height: 1.5;
}

.idea-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}

.idea-link:hover {
  text-decoration: underline;
}

.btn-delete {
  background: transparent;
  border: none;
  font-size: var(--font-size-xl);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  transition: background var(--transition-base);
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-delete:hover {
  background: var(--color-error-bg);
}

.no-ideas {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-lighter);
  font-style: italic;
  background: var(--color-bg-light);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-xl);
}

.no-participant {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-light);
  background: var(--color-warning-bg);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
}

.add-idea-form {
  background: var(--color-success-bg);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.add-idea-form h4 {
  margin-top: 0;
  color: var(--color-primary);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-family: inherit;
  font-size: var(--font-size-base);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--border-color-focus);
}

.add-idea-form button {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  font-size: var(--font-size-base);
  transition: background var(--transition-base);
  width: 100%;
}

.add-idea-form button:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.add-idea-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .gift-ideas-page {
    padding: var(--spacing-md) var(--spacing-sm);
    margin-left: var(--spacing-sm);
    margin-right: var(--spacing-sm);
  }
  .card {
    padding: var(--spacing-md);
  }
  .idea-card {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  .btn-delete {
    align-self: flex-end;
  }
}
</style>

