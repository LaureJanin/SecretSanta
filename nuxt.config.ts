// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Configuration personnalisée pour l'application
  app: {
    head: {
      title: 'Loterie de Noël',
      meta: [
        { name: 'description', content: 'Organisez un tirage au sort de cadeaux de Noël' }
      ]
    }
  },

  // Fichier CSS global
  css: ['~/main.css'],
})
