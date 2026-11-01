<template>
  <div class="join-page">
    <div class="join-card">
      <Loader v-if="loading" />

      <template v-else-if="invite">
        <div class="join-emoji">🎁</div>
        <h1>{{ invite.name }}</h1>
        <p class="join-text">
          <strong>{{ invite.ownerName }}</strong> t'invite à rejoindre sa loterie de Noël {{ invite.year }} !
        </p>
        <p class="join-meta">
          👥 {{ invite.participantCount }} participant{{ invite.participantCount > 1 ? 's' : '' }}
          <span v-if="invite.budget"> · 💶 {{ invite.budget }} € par cadeau</span>
        </p>

        <p v-if="invite.drawDone" class="error-msg">Le tirage a déjà eu lieu : trop tard pour rejoindre cette loterie 😢</p>

        <template v-else-if="isAuthenticated">
          <button class="join-btn" :disabled="joining" @click="join">
            {{ joining ? 'Les lutins t\'ajoutent au chapeau...' : '🎅 Rejoindre la loterie' }}
          </button>
          <p v-if="errorMsg" class="error-msg" role="alert">{{ errorMsg }}</p>
        </template>

        <template v-else>
          <p class="join-text">Connecte-toi (ou crée un compte) pour rejoindre la loterie.</p>
          <div class="join-actions">
            <NuxtLink :to="{ path: '/signup', query: { redirect: route.fullPath } }" class="join-btn">Créer un compte</NuxtLink>
            <NuxtLink :to="{ path: '/login', query: { redirect: route.fullPath } }" class="join-btn join-btn-light">Se connecter</NuxtLink>
          </div>
        </template>
      </template>

      <template v-else>
        <div class="join-emoji">🤷</div>
        <h1>Lien introuvable</h1>
        <p class="join-text">Ce lien d'invitation est invalide ou a été remplacé. Demande-en un nouveau à l'organisateur.</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false })

import { computed, ref, onMounted } from 'vue'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { LOTTERY_INVITE_QUERY, JOIN_LOTTERY_MUTATION } from '~/graphql/queries'
import { useAuth } from '~/composables/useAuth'
import { useConfetti } from '~/composables/useConfetti'

const route = useRoute()
const { isAuthenticated } = useAuth()
const { confetti } = useConfetti()

const code = typeof route.query.code === 'string' ? route.query.code : ''

const loading = ref(true)
const { result, load } = useLazyQuery(LOTTERY_INVITE_QUERY, { code }, { fetchPolicy: 'network-only' })
onMounted(async () => {
  try {
    await load()
  } finally {
    loading.value = false
  }
})
const invite = computed(() => result.value?.lotteryInvite ?? null)

const { mutate } = useMutation(JOIN_LOTTERY_MUTATION)
const joining = ref(false)
const errorMsg = ref('')

async function join() {
  joining.value = true
  errorMsg.value = ''
  try {
    await mutate({ code })
    confetti()
    await navigateTo('/my-loteries')
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Impossible de rejoindre la loterie'
  } finally {
    joining.value = false
  }
}
</script>

<style scoped>
.join-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.join-card {
  background: var(--color-bg-glass);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl);
  max-width: 420px;
  width: 100%;
  text-align: center;
  z-index: 20;
  box-sizing: border-box;
}

.join-emoji {
  font-size: 3rem;
}

.join-text {
  color: var(--color-text);
  margin: var(--spacing-sm) 0;
}

.join-meta {
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-md) 0;
}

.join-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.join-btn {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-base);
}

.join-btn-light {
  background: var(--color-bg-light);
  color: var(--color-text);
}

.error-msg {
  color: var(--color-error);
  background: var(--color-error-bg);
  border: 1px solid #f8bcbc;
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-md);
}
</style>
