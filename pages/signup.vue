<template>
  <div class="signup-page">
    <div class="signup-container">
      <h1>Créer un compte</h1>
      <form class="signup-form" @submit="handleSignup">
        <label for="name">Nom complet</label>
        <input 
          id="name" 
          name="name" 
          type="text" 
          v-model="name" 
          required 
          maxlength="100"
          autocomplete="name"
          aria-required="true"
          aria-describedby="name-error"
        />

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
          minlength="6"
          maxlength="100"
          autocomplete="new-password"
          aria-required="true"
          aria-describedby="password-error"
        />

        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input 
          id="confirmPassword" 
          name="confirmPassword" 
          type="password" 
          v-model="confirmPassword" 
          required 
          minlength="6"
          maxlength="100"
          autocomplete="new-password"
          aria-required="true"
          aria-describedby="confirm-password-error"
        />

        <button type="submit" :disabled="loading" :aria-busy="loading">
          <span v-if="loading">Création...</span>
          <span v-else>Créer mon compte</span>
        </button>
        <div v-if="errorMsg" id="email-error" class="error-msg" role="alert">{{ errorMsg }}</div>
      </form>
      <div class="login-message">
        Tu as déjà un compte <span class="happy-face">😊</span> ?
        <NuxtLink to="/login" class="login-link">Connecte-toi !</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import { REGISTER_MUTATION } from '~/graphql/queries'
import { useAuth } from '~/composables/useAuth'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const loading = ref(false)

const router = useRouter()
const { mutate } = useMutation(REGISTER_MUTATION)
const { setAuthData } = useAuth()

async function handleSignup(e: Event) {
  e.preventDefault()
  errorMsg.value = ''

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (password.value.length < 6) {
    errorMsg.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }

  loading.value = true
  try {
    const result = await mutate({
      email: email.value,
      name: name.value,
      password: password.value
    })
    const data = result?.data

    if (data?.register?.success && data.register.token) {
      setAuthData(
        data.register.token,
        data.register.user?.id,
        data.register.user?.email
      )
      router.push('/my-loteries')
    } else {
      errorMsg.value = data?.register?.error || 'Erreur lors de la création du compte'
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du compte'
    errorMsg.value = errorMessage
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.signup-page {
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
  max-width: 400px;
  width: 100%;
  z-index: 20;
}

h1 {
  text-align: center;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  font-family: var(--font-family);
  text-shadow: 1px 1px 2px var(--color-text);
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: -0.5rem;
  font-size: var(--font-size-sm);
}

input {
  padding: var(--spacing-md);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-base);
}

input:focus {
  outline: none;
  border-color: var(--border-color-focus);
}

button {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-button-hover);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--color-bg-light) !important;
  color: var(--color-text-lighter) !important;
  border: 1px solid var(--border-color) !important;
  box-shadow: none !important;
}

.error-msg {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  text-align: center;
  padding: var(--spacing-sm);
  background: var(--color-error-bg);
  border-radius: var(--border-radius-sm);
  margin-top: var(--spacing-sm);
}

.login-message {
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}

.happy-face {
  font-size: var(--font-size-lg);
}

.login-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-bold);
  transition: color var(--transition-base);
}

.login-link:hover {
  color: var(--color-primary-light);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .signup-page {
    padding-top: 2vh;
    padding-left: var(--spacing-sm);
    padding-right: var(--spacing-sm);
    box-sizing: border-box;
  }
  .signup-container {
    padding: var(--spacing-lg) var(--spacing-md);
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>

