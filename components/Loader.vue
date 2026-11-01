<template>
  <div class="loader">
    <div class="spinner"></div>
    <span>{{ shownMessage }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  message?: string
}

const props = defineProps<Props>()

const FUNNY_MESSAGES = [
  'Les lutins cherchent dans la hotte...',
  'Les rennes se chauffent les sabots...',
  'Le Père Noël vérifie sa liste...',
  'On emballe tout ça...'
]

const shownMessage = ref(props.message || 'Chargement...')

onMounted(() => {
  if (!props.message) {
    shownMessage.value = FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]
  }
})
</script>

<style scoped>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  text-align: center;
  min-height: 200px;
  width: 100%;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid var(--color-bg-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
