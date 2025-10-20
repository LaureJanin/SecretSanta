<template>
  <div class="signup-page">
    <div class="signup-container">
      <h1>Inscription</h1>
      <form class="signup-form" @submit="handleSignup">
        <label for="name">Nom</label>
        <input id="name" name="name" type="text" v-model="name" required />

        <label for="email">Email</label>
        <input id="email" name="email" type="email" v-model="email" required />

        <label for="password">Mot de passe</label>
        <input id="password" name="password" type="password" v-model="password" required />

        <label for="confirm">Confirmer le mot de passe</label>
        <input id="confirm" name="confirm" type="password" v-model="confirm" required />

        <button type="submit" :disabled="loading">S'inscrire</button>
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      </form>
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
const confirm = ref('')
const errorMsg = ref('')
const loading = ref(false)

const router = useRouter()
const { mutate } = useMutation(REGISTER_MUTATION)

async function handleSignup(e: Event) {
  e.preventDefault()
  errorMsg.value = ''
  if (password.value !== confirm.value) {
    errorMsg.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  loading.value = true
  try {
    const { data } = await mutate({ email: email.value, name: name.value, password: password.value })
    if (data?.register?.success && data.register.token) {
      localStorage.setItem('token', data.register.token)
      router.push('/mes-loteries')
    } else {
      errorMsg.value = data?.register?.error || 'Erreur inconnue.'
    }
  } catch (err: any) {
    errorMsg.value = err.message || 'Erreur lors de l’inscription.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.signup-page {
  min-height: 72vh;
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
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.signup-form label {
  font-weight: 500;
  margin-bottom: 0.2rem;
}
.signup-form input {
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
@media (max-width: 600px) {
  .signup-page {
    padding-top: 2vh;
  }
  .signup-container {
    padding: 1.2rem 0.7rem;
    max-width: 95vw;
  }
}
</style>
