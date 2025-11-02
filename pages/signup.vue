<template>
  <div class="signup-page">
    <div class="signup-container">
      <h1>Créer un compte</h1>
      <form class="signup-form" @submit="handleSignup">
        <label for="name">Nom complet</label>
        <input id="name" name="name" type="text" v-model="name" required />

        <label for="email">Email</label>
        <input id="email" name="email" type="email" v-model="email" required />

        <label for="password">Mot de passe</label>
        <input id="password" name="password" type="password" v-model="password" required minlength="6" />

        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input id="confirmPassword" name="confirmPassword" type="password" v-model="confirmPassword" required minlength="6" />

        <button type="submit" :disabled="loading">Créer mon compte</button>
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
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

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const loading = ref(false)

const router = useRouter()
const { mutate } = useMutation(REGISTER_MUTATION)

async function handleSignup(e: Event) {
  e.preventDefault()
  errorMsg.value = ''

  // Validation du mot de passe
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
    const { data } = await mutate({
      email: email.value,
      name: name.value,
      password: password.value
    })

    if (data?.register?.success && data.register.token) {
      localStorage.setItem('token', data.register.token)
      if (data.register.user?.id) {
        localStorage.setItem('userId', data.register.user.id)
      }
      router.push('/mes-loteries')
    } else {
      errorMsg.value = data?.register?.error || 'Erreur lors de la création du compte'
    }
  } catch (err: any) {
    errorMsg.value = err.message || 'Erreur lors de la création du compte'
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
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 2rem 2.5rem;
  max-width: 400px;
  width: 100%;
  z-index: 20;
}

h1 {
  text-align: center;
  color: #1ca463;
  margin-bottom: 1.5rem;
  font-family: 'Montserrat', 'Arial', sans-serif;
  text-shadow: 1px 1px 2px #2e2519;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: 600;
  color: #2e2519;
  margin-bottom: -0.5rem;
  font-size: 0.95rem;
}

input {
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #1ca463;
}

button {
  margin-top: 0.5rem;
  padding: 0.9rem;
  background: linear-gradient(135deg, #1ca463, #28a745);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(28, 164, 99, 0.3);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #d2232a;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
  background: #ffe6e6;
  border-radius: 6px;
  margin-top: 0.5rem;
}

.login-message {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.95rem;
}

.happy-face {
  font-size: 1.1rem;
}

.login-link {
  color: #1ca463;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
}

.login-link:hover {
  color: #28a745;
  text-decoration: underline;
}

@media (max-width: 500px) {
  .signup-container {
    padding: 1.5rem 1.8rem;
    max-width: 90%;
  }
}
</style>

