export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Configuration runtime (variables d'environnement)
  runtimeConfig: {
    // Variables publiques (accessibles côté client)
    public: {
      graphqlUrl: process.env.GRAPHQL_URL || 'http://localhost:4000/graphql',
    },
  },

  // Configuration de l'application
  app: {
    head: {
      title: 'Loterie de Noël - Organisez votre Secret Santa',
      meta: [
        { name: 'description', content: 'Organisez un tirage au sort de cadeaux de Noël (Secret Santa) en toute simplicité. Créez votre loterie, ajoutez les participants et laissez le hasard décider !' },
        { name: 'keywords', content: 'loterie, noël, secret santa, tirage au sort, cadeaux, échange de cadeaux' },
        { name: 'author', content: 'Loterie de Noël' },
        { property: 'og:title', content: 'Loterie de Noël - Organisez votre Secret Santa' },
        { property: 'og:description', content: 'Organisez un tirage au sort de cadeaux de Noël en toute simplicité. Créez votre loterie, ajoutez les participants et laissez le hasard décider !' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/lotterie-noel.png' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Loterie de Noël - Organisez votre Secret Santa' },
        { name: 'twitter:description', content: 'Organisez un tirage au sort de cadeaux de Noël en toute simplicité.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' }
      ]
    }
  },

  // Fichier CSS global
  css: ['~/assets/css/variables.css', '~/main.css']
});
