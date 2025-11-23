import { defineNuxtPlugin } from '#app'
import { provideApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const graphqlUrl = (config.public.graphqlUrl as string) || 'http://localhost:4000/graphql'
  
  const httpLink = createHttpLink({
    uri: graphqlUrl,
    credentials: 'same-origin',
  })

  const authLink = setContext((_, { headers }) => {
    // Utiliser process.client pour éviter les erreurs SSR
    const token = process.client ? localStorage.getItem('token') : null
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      }
    }
  })

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })

  // Fournir le client Apollo au contexte
  provideApolloClient(apolloClient)

  // Le rendre disponible dans l'app
  nuxtApp.provide('apollo', apolloClient)
})


