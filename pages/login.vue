<template>
  <div class="login-page">
    <div class="signup-container">
      <h1>Connexion</h1>
      <form class="login-form" @submit="handleLogin">
        <label for="email">Email</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          v-model="email" 
          required 
          maxlength="255"
          autocomplete="email"
          aria-required="true"
          aria-describedby="email-error"
        />

        <label for="password">Mot de passe</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          v-model="password" 
          required 
          maxlength="100"
          autocomplete="current-password"
          aria-required="true"
          aria-describedby="password-error"
        />

        <button type="submit" :disabled="loading" :aria-busy="loading">
          <span v-if="loading">Connexion...</span>
          <span v-else>Se connecter</span>
        </button>
        <div v-if="errorMsg" id="email-error" class="error-msg" role="alert">{{ errorMsg }}</div>
      </form>
      <div class="login-message">
        Tu n'as pas de compte <span class="sad-face">😢</span> ?
        <NuxtLink to="/signup" class="login-link">Crée-toi en un !</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { LOGIN_MUTATION } from '~/graphql/queries'
import { useAuth } from '~/composables/useAuth'
import { validateEmail } from '~/utils/email'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const { mutate } = useMutation(LOGIN_MUTATION)
const { setAuthData } = useAuth()

async function handleLogin(e: Event) {
  e.preventDefault()
  errorMsg.value = ''

  if (!validateEmail(email.value)) {
    errorMsg.value = 'Format d\'email invalide'
    return
  }

  loading.value = true
  try {
    const result = await mutate({ email: email.value, password: password.value })
    const data = result?.data
    if (data?.login?.success && data.login.token) {
      await setAuthData(
        data.login.token,
        data.login.user?.id,
        data.login.user?.email
      )
      await navigateTo('/my-loteries')
    } else {
      errorMsg.value = data?.login?.error || 'Erreur inconnue.'
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la connexion.'
    errorMsg.value = errorMessage
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 55vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: none;
  position: relative;
  overflow: hidden;
  padding-top: 4vh;
}

.signup-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl) calc(var(--spacing-xl) + 0.5rem);
  max-width: 350px;
  width: 100%;
  z-index: 20;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.login-form label {
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-xs);
}

.login-form input {
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
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
  text-align: center;
}

.login-message {
  margin-top: var(--spacing-lg);
  text-align: center;
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.sad-face {
  font-size: var(--font-size-xl);
  margin: 0 var(--spacing-xs);
}

.login-link {
  color: var(--color-accent);
  font-weight: var(--font-weight-bold);
  margin-left: var(--spacing-xs);
  text-decoration: underline;
  cursor: pointer;
}

.login-link:hover {
  color: var(--color-secondary);
}

@media (max-width: 768px) {
  .login-page {
    padding-top: 2vh;
    padding-left: var(--spacing-sm);
    padding-right: var(--spacing-sm);
    box-sizing: border-box;
  }
  .signup-container {
    padding: var(--spacing-md) var(--spacing-sm);
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
