<template>
  <div class="error-page">
    <span class="error-emoji">🦌</span>
    <h1>{{ error?.statusCode === 404 ? 'Oups, page introuvable' : 'Oups, un lutin a fait une bêtise' }}</h1>
    <p>
      {{ error?.statusCode === 404
        ? "Le Père Noël s'est perdu en chemin… cette page n'existe pas."
        : 'Les lutins sont déjà sur le coup, réessaie dans un instant.' }}
    </p>
    <button @click="clearError({ redirect: '/' })">Retour à l'atelier 🏠</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ error: { statusCode?: number } }>()
</script>

<style scoped>
.error-page {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  text-align: center;
}

.error-emoji {
  font-size: 5rem;
  animation: wobble 2s ease-in-out infinite;
}

@keyframes wobble {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}
</style>
