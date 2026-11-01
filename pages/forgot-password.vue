<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Mot de passe oublié ?</h1>

      <p v-if="sent" class="info-msg" role="status">
        📬 Si cette adresse correspond à un compte, un email avec un lien vient de partir.
        Pense à regarder dans les spams (les lutins se trompent parfois de boîte).
      </p>

      <form v-else class="auth-form" @submit.prevent="handleSubmit">
        <p class="hint">Pas de panique ! Donne-nous ton email et on t'envoie un lien pour en choisir un nouveau.</p>
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email" required maxlength="255" autocomplete="email" />

        <button type="submit" :disabled="loading" :aria-busy="loading">
          <span v-if="loading">Un lutin court à la boîte aux lettres...</span>
          <span v-else>Envoyer le lien</span>
        </button>
        <div v-if="errorMsg" class="error-msg" role="alert">{{ errorMsg }}</div>
      </form>

      <div class="back-message">
        <NuxtLink to="/login" class="back-link">← Retour à la connexion</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { REQUEST_PASSWORD_RESET_MUTATION } from '~/graphql/queries'
import { validateEmail } from '~/utils/email'

const email = ref('')
const errorMsg = ref('')
const loading = ref(false)
const sent = ref(false)

const { mutate } = useMutation(REQUEST_PASSWORD_RESET_MUTATION)

async function handleSubmit() {
  errorMsg.value = ''
  if (!validateEmail(email.value)) {
    errorMsg.value = 'Format d\'email invalide'
    return
  }

  loading.value = true
  try {
    await mutate({ email: email.value })
    sent.value = true
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Erreur lors de l\'envoi.'
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

.hint {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-sm);
  text-align: center;
}

.info-msg {
  background: var(--color-success-bg);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  color: var(--color-success);
  text-align: center;
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
