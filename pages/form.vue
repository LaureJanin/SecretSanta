<template>
  <div class="form-page">
    <h1>🎄 Créer une nouvelle loterie 🎄</h1>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="lottery-form">
        <div class="form-section">
          <h2>Informations de la loterie</h2>

          <div class="form-group">
            <label for="lotteryName">Nom de la loterie *</label>
            <input
              id="lotteryName"
              v-model="lotteryName"
              type="text"
              placeholder="Ex: Loterie de Noël Famille Dupont"
              required
            />
          </div>

          <div class="form-group">
            <label for="lotteryYear">Année *</label>
            <input
              id="lotteryYear"
              v-model.number="lotteryYear"
              type="number"
              :min="new Date().getFullYear()"
              :max="new Date().getFullYear() + 5"
              required
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading || !isFormValid" class="btn-primary">
            {{ loading ? 'Création en cours...' : 'Créer la loterie' }}
          </button>
          <button type="button" @click="router.push('/mes-loteries')" class="btn-secondary">
            Annuler
          </button>
        </div>

        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import { CREATE_LOTTERY_MUTATION } from '~/graphql/queries'

const router = useRouter()

// Données du formulaire
const lotteryName = ref('')
const lotteryYear = ref(new Date().getFullYear())
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)

// Vérifier l'authentification
onMounted(() => {
  if (process.client) {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }
})

// Mutation GraphQL
const { mutate: createLottery } = useMutation(CREATE_LOTTERY_MUTATION)

// Validation
const isFormValid = computed(() => {
  return lotteryName.value.trim().length > 0 && lotteryYear.value >= new Date().getFullYear()
})

// Soumission du formulaire
async function handleSubmit() {
  errorMsg.value = ''
  successMsg.value = ''
  loading.value = true

  try {
    console.log('🎄 Création de la loterie:', { name: lotteryName.value.trim(), year: lotteryYear.value })

    const result = await createLottery({
      name: lotteryName.value.trim(),
      year: lotteryYear.value
    })

    console.log('✅ Résultat de la mutation:', result)
    const data = result?.data

    if (data?.createLottery) {
      successMsg.value = `Loterie "${data.createLottery.name}" créée avec succès ! 🎉`
      console.log('🎉 Loterie créée:', data.createLottery)

      // Redirection vers la page de détail de la loterie après 1.5 secondes
      setTimeout(() => {
        router.push('/mes-loteries')
      }, 1500)
    } else {
      errorMsg.value = 'Erreur lors de la création de la loterie'
      console.error('❌ Pas de données retournées')
    }
  } catch (err: any) {
    console.error('❌ Erreur complète:', err)
    console.error('❌ Message:', err.message)
    console.error('❌ GraphQL Errors:', err.graphQLErrors)
    console.error('❌ Network Error:', err.networkError)
    errorMsg.value = err.message || 'Erreur lors de la création de la loterie'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.form-container {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.lottery-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section h2 {
  color: #1ca463;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2e2519;
  font-size: 1rem;
}

.form-group input {
  padding: 0.9rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #1ca463;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.form-actions button {
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #1ca463, #28a745);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(28, 164, 99, 0.3);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
  transform: translateY(-2px);
}

.success-msg {
  color: #1ca463;
  font-size: 1rem;
  text-align: center;
  padding: 1rem;
  background: #e8f5e9;
  border-radius: 8px;
  border: 2px solid #1ca463;
  font-weight: bold;
}

@media (max-width: 600px) {
  .form-container {
    padding: 1.5rem 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
