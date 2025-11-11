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

      <!-- Liste des loteries où je participe -->
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

          <!-- Liste des idées existantes -->
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

          <!-- Formulaire d'ajout -->
          <div class="add-idea-form">
            <h4>➕ Ajouter une idée</h4>
            <form @submit.prevent="handleAddIdea(getMyParticipant(lottery)?.id)">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ME_QUERY, MY_LOTERIES_QUERY, ADD_GIFT_IDEA_MUTATION, DELETE_GIFT_IDEA_MUTATION } from '~/graphql/queries';

const router = useRouter()

const { result: meResult } = useQuery(ME_QUERY)
const { result, loading, error, refetch } = useQuery(MY_LOTERIES_QUERY)
const { mutate: addGiftIdea } = useMutation(ADD_GIFT_IDEA_MUTATION)
const { mutate: deleteGiftIdea } = useMutation(DELETE_GIFT_IDEA_MUTATION)

const newIdea = ref({ title: '', description: '', link: '' })

onMounted(() => {
  if (process.client) {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }
})

// Récupérer l'email de l'utilisateur connecté
const userEmail = computed(() => {
  return meResult.value?.me?.email || ''
})

const myLotteries = computed(() => {
  return result.value?.myLotteries || []
})

// Récupérer mon participant dans une loterie
function getMyParticipant(lottery: any) {
  if (!userEmail.value) return null
  // Comparaison insensible à la casse et aux espaces
  const normalizedEmail = userEmail.value.toLowerCase().trim()
  return lottery.participants.find((p: any) => {
    if (!p.email) return false
    return p.email.toLowerCase().trim() === normalizedEmail
  })
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
      // Réinitialiser le formulaire
      newIdea.value = { title: '', description: '', link: '' }

      // Rafraîchir les données
      await refetch()

      alert('✅ Idée cadeau ajoutée !')
    }
  } catch (err: any) {
    console.error('Erreur:', err)
    alert('❌ Erreur lors de l\'ajout : ' + (err.message || 'Erreur inconnue'))
  }
}

async function handleDeleteIdea(giftIdeaId: string) {
  if (!confirm('Supprimer cette idée cadeau ?')) return

  try {
    await deleteGiftIdea({ giftIdeaId })
    await refetch()
    alert('✅ Idée supprimée !')
  } catch (err: any) {
    console.error('Erreur:', err)
    alert('❌ Erreur lors de la suppression')
  }
}
</script>

<style scoped>
.gift-ideas-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #d2232a;
}

.intro {
  background: linear-gradient(135deg, #1ca463, #28a745);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.intro p {
  margin: 0;
  font-size: 1.1rem;
}

.no-lotteries {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.no-lotteries p {
  color: #666;
  font-size: 1.1rem;
}

.lottery-section {
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.lottery-section h2 {
  color: #1ca463;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.my-ideas h3 {
  color: #2e2519;
  margin-bottom: 1rem;
}

.ideas-list {
  margin-bottom: 2rem;
}

.idea-card {
  background: #f8f9fa;
  border-left: 4px solid #ff9f1a;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: start;
  transition: transform 0.2s;
}

.idea-card:hover {
  transform: translateX(5px);
}

.idea-content {
  flex: 1;
}

.idea-content h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.idea-content p {
  margin: 0.5rem 0;
  color: #666;
  line-height: 1.5;
}

.idea-link {
  color: #1ca463;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.idea-link:hover {
  text-decoration: underline;
}

.btn-delete {
  background: transparent;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-delete:hover {
  background: #ffe6e6;
}

.no-ideas {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.no-participant {
  text-align: center;
  padding: 2rem;
  color: #666;
  background: #fff3cd;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.add-idea-form {
  background: #e8f5e9;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.add-idea-form h4 {
  margin-top: 0;
  color: #1ca463;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2e2519;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1ca463;
}

.add-idea-form button {
  background: #1ca463;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  width: 100%;
}

.add-idea-form button:hover:not(:disabled) {
  background: #178a52;
}

.add-idea-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

