// URL publique du site (Netlify fournit URL au build) : nécessaire pour l'image de partage
const siteUrl = process.env.URL || 'https://christmaslottery.netlify.app'

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

  // /join n'est lié depuis aucune page (lien d'invitation) : on force sa génération
  nitro: {
    prerender: { routes: ['/join'] }
  },

  // Configuration de l'application
  app: {
    head: {
      title: 'Loterie de Noël 🎅 - Organisez votre Secret Santa',
      meta: [
        { name: 'description', content: 'Organisez un tirage au sort de cadeaux de Noël (Secret Santa) en toute simplicité. Créez votre loterie, ajoutez les participants et laissez le hasard décider !' },
        { name: 'keywords', content: 'loterie, noël, secret santa, tirage au sort, cadeaux, échange de cadeaux' },
        { name: 'author', content: 'Loterie de Noël' },
        { property: 'og:title', content: 'Loterie de Noël 🎅 - Ton Secret Santa, sans prise de tête' },
        { property: 'og:description', content: 'Organisez un tirage au sort de cadeaux de Noël en toute simplicité. Créez votre loterie, ajoutez les participants et laissez le hasard décider !' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: `${siteUrl}/og-image.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: siteUrl },
        { property: 'og:locale', content: 'fr_FR' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: `${siteUrl}/og-image.png` },
        { name: 'twitter:title', content: 'Loterie de Noël - Organisez votre Secret Santa' },
        { name: 'twitter:description', content: 'Organisez un tirage au sort de cadeaux de Noël en toute simplicité.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
      ],
      script: [
        // Mode nuit par défaut (sauf choix explicite du mode jour), appliqué avant l'affichage de la page
        { innerHTML: "try{if(localStorage.getItem('theme')!=='light')document.documentElement.setAttribute('data-theme','dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}" }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' }
      ]
    }
  },

  // Fichier CSS global
  css: ['~/assets/css/variables.css', '~/main.css']
});
