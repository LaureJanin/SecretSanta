<template>
  <div class="form-page">
    <h1>🎄 Créer une nouvelle loterie 🎄</h1>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="lottery-form">
        <div class="form-section">
          <h2>Donnez un titre à votre loterie</h2>

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
          <button type="button" @click="router.push('/my-loteries')" class="btn-secondary">
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
        router.push('/my-loteries')
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
  max-width: var(--max-width-lg);
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
  box-sizing: border-box;
}

.form-container {
  background: var(--color-bg);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl);
}

.lottery-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-section h2 {
  color: var(--color-primary);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  font-size: var(--font-size-base);
}

.form-group input {
  padding: var(--spacing-md);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-base);
}

.form-group input:focus {
  outline: none;
  border-color: var(--border-color-focus);
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-top: var(--spacing-md);
  flex-wrap: wrap;
}

.form-actions button {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  border: none;
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-text-inverse);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-button-hover);
}

.btn-secondary {
  background: var(--color-bg-light);
  color: var(--color-text);
}

.btn-secondary:hover {
  background: #d0d0d0;
  transform: translateY(-2px);
}

.success-msg {
  color: var(--color-success);
  font-size: var(--font-size-base);
  text-align: center;
  padding: var(--spacing-md);
  background: var(--color-success-bg);
  border-radius: var(--border-radius-md);
  border: var(--border-width) solid var(--color-success);
  font-weight: var(--font-weight-bold);
}

@media (max-width: 768px) {
  .form-page {
    padding: var(--spacing-md) var(--spacing-sm);
    margin-left: var(--spacing-sm);
    margin-right: var(--spacing-md);
  }
  .form-container {
    padding: var(--spacing-md);
  }
  .form-actions {
    flex-direction: column;
  }
  .form-actions button {
    width: 100%;
  }
}
</style>
