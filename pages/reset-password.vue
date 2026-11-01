<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Nouveau mot de passe</h1>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <label for="password">Nouveau mot de passe</label>
        <input id="password" type="password" v-model="password" required minlength="6" maxlength="100" autocomplete="new-password" />

        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input id="confirmPassword" type="password" v-model="confirmPassword" required minlength="6" maxlength="100" autocomplete="new-password" />

        <button type="submit" :disabled="loading" :aria-busy="loading">
          <span v-if="loading">Les lutins changent la serrure...</span>
          <span v-else>Changer mon mot de passe</span>
        </button>
        <div v-if="errorMsg" class="error-msg" role="alert">{{ errorMsg }}</div>
      </form>

      <div v-if="errorMsg" class="back-message">
        <NuxtLink to="/forgot-password" class="back-link">Demander un nouveau lien</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { RESET_PASSWORD_MUTATION } from '~/graphql/queries'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const loading = ref(false)

const { mutate } = useMutation(RESET_PASSWORD_MUTATION)
const { setAuthData } = useAuth()

async function handleSubmit() {
  errorMsg.value = ''

  const token = typeof route.query.token === 'string' ? route.query.token : ''
  if (!token) {
    errorMsg.value = 'Lien invalide. Refais une demande de mot de passe oublié.'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true
  try {
    const result = await mutate({ token, password: password.value })
    const data = result?.data?.resetPassword
    if (data?.success && data.token) {
      // Connexion automatique après le changement
      await setAuthData(data.token, data.user?.id, data.user?.email)
      await navigateTo('/my-loteries')
    } else {
      errorMsg.value = data?.error || 'Erreur inconnue.'
    }
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Erreur lors du changement de mot de passe.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1vh;
}

.auth-card {
  background: var(--color-bg-glass);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl) calc(var(--spacing-xl) + 0.5rem);
  max-width: 350px;
  width: 100%;
  z-index: 20;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.auth-form label {
  font-weight: var(--font-weight-semibold);
}

.auth-form input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  background: var(--color-bg-light);
}

.error-msg {
  color: var(--color-error);
  background: var(--color-error-bg);
  border: 1px solid #f8bcbc;
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  text-align: center;
}

.back-message {
  margin-top: var(--spacing-lg);
  text-align: center;
}

.back-link {
  color: var(--color-accent);
  font-weight: var(--font-weight-bold);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-page { padding: 2vh var(--spacing-sm) 0; box-sizing: border-box; }
  .auth-card { padding: var(--spacing-md) var(--spacing-sm); max-width: 100%; box-sizing: border-box; }
}
</style>
