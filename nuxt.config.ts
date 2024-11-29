export default defineNuxtConfig({
  ssr: true, // Assurez-vous que SSR est activé
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Configurer Nitro pour utiliser les fonctions serverless de Netlify
  nitro: {
    preset: 'netlify',
  },

  // Configuration de l'application
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
});
