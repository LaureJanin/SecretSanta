<template>
  <div class="mes-loteries-page">
    <h1>Mes loteries</h1>
    <div v-if="loading" class="loading">Chargement...</div>
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
        <div v-for="loterie in loteries" :key="loterie.id" class="loterie-card">
          <div>
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

          <!-- Affichage du résultat du tirage pour l'utilisateur -->
          <div v-if="getMyDraw(loterie)" class="draw-result">
            <div class="draw-header">
              <h3>🎯 Votre mission de Noël</h3>
            </div>
            <div class="receiver-info">
              <p class="receiver-name">Vous offrez un cadeau à : <strong>{{ getMyDraw(loterie)?.receiver?.name }}</strong></p>
              
              <div v-if="getMyDraw(loterie)?.receiver?.giftIdeas && getMyDraw(loterie)?.receiver?.giftIdeas.length > 0" class="gift-ideas-section">
                <h4>🎁 Ses idées cadeaux :</h4>
                <div class="gift-ideas-list">
                  <div v-for="idea in getMyDraw(loterie)?.receiver?.giftIdeas" :key="idea.id" class="gift-idea-item">
                    <div class="gift-idea-content">
                      <h5>{{ idea.title }}</h5>
                      <p v-if="idea.description" class="gift-idea-description">{{ idea.description }}</p>
                      <a v-if="idea.link" :href="idea.link" target="_blank" class="gift-idea-link">🔗 Voir le lien</a>
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { ME_QUERY, MY_LOTERIES_QUERY } from '~/graphql/queries'
import { useRouter } from 'vue-router'

const router = useRouter()

// Récupérer l'utilisateur connecté
const { result: meResult } = useQuery(ME_QUERY)

// Utiliser useQuery directement (pas dans onMounted)
const { result, loading, error, refetch } = useQuery(MY_LOTERIES_QUERY)

// Computed pour réagir aux changements de result
const loteries = computed(() => {
  return result.value?.myLotteries || []
})

// Récupérer l'email de l'utilisateur connecté
const userEmail = computed(() => {
  return meResult.value?.me?.email || ''
})

// Rafraîchir les loteries quand la page est montée
onMounted(async () => {
  if (process.client) {
    const token = localStorage.getItem('token') || ''
    if (!token) {
      router.push('/login')
    } else {
      // Forcer le rechargement des données
      await refetch()
    }
  }
})

// Vérifier si l'utilisateur est le créateur de la loterie
function isOwner(loterie: any) {
  return loterie.owner?.id === meResult.value?.me?.id
}

// Récupérer le tirage où l'utilisateur est le donneur
function getMyDraw(loterie: any) {
  if (!loterie.draws || loterie.draws.length === 0) return null
  if (!userEmail.value) return null
  
  const normalizedEmail = userEmail.value.toLowerCase().trim()
  
  // Trouver le draw où l'utilisateur est le giver
  return loterie.draws.find((draw: any) => {
    if (!draw.giver?.email) return false
    return draw.giver.email.toLowerCase().trim() === normalizedEmail
  })
}
</script>

<style scoped>
.mes-loteries-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem 1rem;
}

.loterie-card {
  background: rgba(255,255,255,0.97);
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(44, 62, 80, 0.08);
  margin-bottom: 2rem;
  padding: 1.5rem 1.2rem;
}
.desc {
  color: #6b7a8f;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.loterie-info {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.info-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: #e0e0e0;
  color: #333;
}

.info-badge.owner {
  background: #fff3e0;
  color: #e65100;
  border: 1px solid #ff9800;
}

.info-badge.success {
  background: #e8f5e9;
  color: #1ca463;
  border: 1px solid #1ca463;
}

.info-badge.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffc107;
}

.admin-link {
  margin-top: 1rem;
  text-align: center;
}

.btn-admin {
  background: #ff9800;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-admin:hover {
  background: #e65100;
}

.tirage-section, .mes-cadeaux-section {
  margin-bottom: 1.2rem;
}

ul {
  margin: 0.3rem 0 0.7rem 1.2rem;
}
.loading {
  text-align: center;
  color: #888;
}
.no-loterie {
  text-align: center;
  color: #d32f2f;
  font-size: 1.1rem;
  margin-top: 2rem;
}

.btn-create-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn-create {
  margin-top: 1.2rem;
  background: #1ca463;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.4rem;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  transition: background 0.2s;
}
.btn-create:hover {
  background: #178a52;
}

.draw-result {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #e8f5e9, #f1f8f4);
  border-radius: 12px;
  border: 2px solid #1ca463;
}

.draw-header {
  text-align: center;
  margin-bottom: 1rem;
}

.draw-header h3 {
  color: #1ca463;
  margin: 0;
  font-size: 1.3rem;
}

.receiver-info {
  text-align: center;
}

.receiver-name {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.receiver-name strong {
  color: #1ca463;
  font-size: 1.2rem;
}

.gift-ideas-section {
  margin-top: 1.5rem;
  text-align: left;
}

.gift-ideas-section h4 {
  color: #1ca463;
  margin-bottom: 1rem;
  text-align: center;
}

.gift-ideas-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gift-idea-item {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #ff9f1a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gift-idea-content h5 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.gift-idea-description {
  margin: 0.5rem 0;
  color: #666;
  font-style: italic;
  line-height: 1.5;
}

.gift-idea-link {
  color: #1ca463;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-block;
  margin-top: 0.5rem;
}

.gift-idea-link:hover {
  text-decoration: underline;
}

.no-gift-ideas {
  text-align: center;
  padding: 1rem;
  color: #666;
  font-style: italic;
  background: white;
  border-radius: 8px;
  margin-top: 1rem;
}

@media (max-width: 600px) {
  .mes-loteries-page {
    padding: 1rem 0.2rem 2rem 0.2rem;
  }
  .loterie-card {
    padding: 1rem 0.3rem;
  }
  .draw-result {
    padding: 1rem;
  }
}
</style>
