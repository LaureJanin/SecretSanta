<template>
  <div class="login-page">
    <div class="signup-container">
      <h1>Connexion</h1>
      <form class="login-form" @submit="handleLogin">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" v-model="email" required />

        <label for="password">Mot de passe</label>
        <input id="password" name="password" type="password" v-model="password" required />

        <button type="submit" :disabled="loading">Se connecter</button>
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
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
import { useRouter } from 'vue-router'
import { LOGIN_MUTATION } from '~/graphql/queries'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const router = useRouter()
const { mutate } = useMutation(LOGIN_MUTATION)

async function handleLogin(e: Event) {
  e.preventDefault()
  errorMsg.value = ''
  loading.value = true
  try {
    const result = await mutate({ email: email.value, password: password.value })
    const data = result?.data
    if (data?.login?.success && data.login.token) {
      localStorage.setItem('token', data.login.token)
      if (data.login.user?.id) {
        localStorage.setItem('userId', data.login.user.id)
      }
      router.push('/mes-loteries')
    } else {
      errorMsg.value = data?.login?.error || 'Erreur inconnue.'
    }
  } catch (err: any) {
    errorMsg.value = err.message || 'Erreur lors de la connexion.'
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
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 2rem 2.5rem;
  max-width: 350px;
  width: 100%;
  z-index: 20;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.login-form label {
  font-weight: 500;
  margin-bottom: 0.2rem;
}
.login-form input {
  padding: 0.6rem 1rem;
  border: 1px solid #b5c6e0;
  border-radius: 8px;
  font-size: 1rem;
  background: #f7fbff;
}
.error-msg {
  color: #d32f2f;
  background: #fff0f0;
  border: 1px solid #f8bcbc;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  font-size: 0.98rem;
  text-align: center;
}
.login-message {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1rem;
  color: #333;
}
.sad-face {
  font-size: 1.2rem;
  margin: 0 0.2rem;
}
.login-link {
  color: #d2232a;
  font-weight: bold;
  margin-left: 0.3rem;
  text-decoration: underline;
  cursor: pointer;
}
.login-link:hover {
  color: #ff9f1a;
}
@media (max-width: 600px) {
  .signup-container {
    padding: 1.2rem 0.7rem;
    max-width: 95vw;
  }
}
</style>
