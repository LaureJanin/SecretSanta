<template>
  <div class="my-loteries-page">
    <h1>Mes loteries</h1>
    <Loader v-if="loading" />
      <div v-else-if="error" class="error">Erreur: {{ error?.message || 'Une erreur est survenue' }}</div>
    <div v-else>
      <div v-if="loteries.length === 0" class="no-loterie">
        Aucune loterie trouvée.<br>
        <button class="btn-create" @click="router.push('/form')">Créer ta première loterie de Noël</button>
      </div>
      <div v-else>
        <div class="btn-create-container">
          <button class="btn-create" @click="router.push('/form')">Créer une loterie</button>
        </div>
        <div class="loteries-container">
          <div v-for="loterie in loteries" :key="loterie.id" class="loterie-card">
          <div class="loterie-header">
            <h2>{{ loterie.name }}</h2>
            <div v-if="isOwner(loterie)" class="admin-link">
              <button @click="router.push('/admin')" class="btn-admin">⚙️ Gérer cette loterie</button>
            </div>
          </div>

          <p class="desc">Année : {{ loterie.year }}</p>

          <div class="loterie-info">
            <span v-if="isOwner(loterie)" class="info-badge owner">👑 Organisateur</span>
            <span class="info-badge">👥 {{ loterie.participants.length }} participant(s)</span>
            <span v-if="loterie.draws && loterie.draws.length > 0" class="info-badge success">✅ Tirage effectué</span>
            <span v-else class="info-badge warning">⏳ Tirage non effectué</span>
          </div>

          <div v-if="getMyDraw(loterie)" class="draw-result">
            <div class="draw-header">
              <h3>🎯 Votre mission de Noël</h3>
            </div>
            <div class="receiver-info">
              <p class="receiver-name">Vous offrez un cadeau à : <strong>{{ getMyDraw(loterie)?.receiver?.name }}</strong></p>
              
              <div v-if="getMyDrawGiftIdeas(loterie).length > 0" class="gift-ideas-section">
                <h4>🎁 Ses idées cadeaux :</h4>
                <div class="gift-ideas-list">
                  <div v-for="idea in getMyDrawGiftIdeas(loterie)" :key="idea.id" class="gift-idea-item">
                    <div class="gift-idea-content">
                      <h5>{{ idea.title }}</h5>
                      <p v-if="idea.description" class="gift-idea-description">{{ idea.description }}</p>
                      <a v-if="idea.link" :href="idea.link" target="_blank" rel="noopener noreferrer" class="gift-idea-link">🔗 Voir le lien</a>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="no-gift-ideas">
                <p>Cette personne n'a pas encore ajouté d'idées cadeaux.</p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false })

import { computed, onMounted, ref } from 'vue'
import { useLazyQuery } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import { ME_QUERY, MY_LOTERIES_QUERY } from '~/graphql/queries'
import { useAuth } from '~/composables/useAuth'
import { compareEmails } from '~/utils/email'
import type { LotteryResponse, DrawResponse } from '~/types'

const router = useRouter()
const { requireAuth, getToken } = useAuth()

requireAuth()

const loading = ref(true)

const { result: meResult, load: loadMe } = useLazyQuery(ME_QUERY)
const { result, load, error } = useLazyQuery(MY_LOTERIES_QUERY)

onMounted(async () => {
  if (process.client && getToken()) {
    try {
      await Promise.all([loadMe(), load()])
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})

const loteries = computed(() => {
  return result.value?.myLotteries || []
})

const userEmail = computed(() => {
  return meResult.value?.me?.email || ''
})

function isOwner(loterie: LotteryResponse): boolean {
  return loterie.owner?.id === meResult.value?.me?.id
}

function getMyDraw(loterie: LotteryResponse): DrawResponse | undefined {
  if (!loterie.draws || loterie.draws.length === 0) return undefined
  if (!userEmail.value) return undefined
  
  return loterie.draws?.find((draw: DrawResponse) => {
    return compareEmails(draw.giver?.email, userEmail.value)
  })
}

function getMyDrawGiftIdeas(loterie: LotteryResponse) {
  const draw = getMyDraw(loterie)
  return draw?.receiver?.giftIdeas || []
}
</script>

<style scoped>
.my-loteries-page {
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
  box-sizing: border-box;
}

.loteries-container {
  width: 100%;
  box-sizing: border-box;
}

.loterie-card {
  background: var(--color-bg);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  margin: 0 auto var(--spacing-xl) auto;
  padding: var(--spacing-lg) var(--spacing-md);
  width: 60%;
  max-width: 100%;
  box-sizing: border-box;
  display: block;
}

.loterie-header {
  width: 100%;
  box-sizing: border-box;
  display: block;
}

.desc {
  color: var(--color-text-light);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.loterie-info {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: center;
}

.info-badge {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-badge);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  background: var(--color-bg-light);
  color: var(--color-text);
}

.info-badge.owner {
  background: var(--color-warning-bg);
  color: #e65100;
  border: 1px solid var(--color-secondary);
}

.info-badge.success {
  background: var(--color-success-bg);
  color: var(--color-success);
  border: 1px solid var(--color-success);
}

.info-badge.warning {
  background: var(--color-warning-bg);
  color: #856404;
  border: 1px solid var(--color-warning);
}

.admin-link {
  margin-top: var(--spacing-md);
  text-align: center;
}

.btn-admin {
  background: var(--color-secondary);
  color: var(--color-text-inverse);
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background var(--transition-base);
}

.btn-admin:hover {
  background: var(--color-secondary-dark);
}

.tirage-section, .mes-cadeaux-section {
  margin-bottom: var(--spacing-md);
}

ul {
  margin: var(--spacing-xs) 0 var(--spacing-md) var(--spacing-md);
}

.no-loterie {
  text-align: center;
  color: var(--color-error);
  font-size: var(--font-size-lg);
  margin-top: var(--spacing-xl);
}

.btn-create-container {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

.btn-create {
  margin-top: var(--spacing-md);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  box-shadow: var(--shadow-button);
  transition: background var(--transition-base);
}

.btn-create:hover {
  background: var(--color-primary-dark);
}

.draw-result {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-success-bg), #f1f8f4);
  border-radius: var(--border-radius-lg);
  border: var(--border-width) solid var(--color-success);
}

.draw-header {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.draw-header h3 {
  color: var(--color-primary);
  margin: 0;
  font-size: var(--font-size-xl);
}

.receiver-info {
  text-align: center;
}

.receiver-name {
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.receiver-name strong {
  color: var(--color-primary);
  font-size: var(--font-size-xl);
}

.gift-ideas-section {
  margin-top: var(--spacing-lg);
  text-align: left;
}

.gift-ideas-section h4 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.gift-ideas-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.gift-idea-item {
  background: var(--color-bg-card);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.gift-idea-content h5 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text);
  font-size: var(--font-size-lg);
}

.gift-idea-description {
  margin: var(--spacing-sm) 0;
  color: var(--color-text-light);
  font-style: italic;
  line-height: 1.5;
}

.gift-idea-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  display: inline-block;
  margin-top: var(--spacing-sm);
}

.gift-idea-link:hover {
  text-decoration: underline;
}

.no-gift-ideas {
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-text-light);
  font-style: italic;
  background: var(--color-bg-card);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-md);
}

@media (max-width: 768px) {
  .my-loteries-page {
    padding: var(--spacing-md) var(--spacing-sm) var(--spacing-xl) var(--spacing-sm);
    margin-left: var(--spacing-sm);
    margin-right: var(--spacing-sm);
    width: calc(100% - var(--spacing-sm) * 2);
    box-sizing: border-box;
  }
  .loterie-card {
    padding: var(--spacing-md) var(--spacing-sm);
    width: 100%;
  }
  .draw-result {
    padding: var(--spacing-md);
  }
  .loterie-info {
    gap: var(--spacing-sm);
  }
  .info-badge {
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style>
