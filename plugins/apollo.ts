import { defineNuxtPlugin } from '#app'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

export default defineNuxtPlugin((nuxtApp) => {
  const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
  })

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  })

  nuxtApp.vueApp.provide('default', apolloClient)
  nuxtApp.vueApp.provide('apollo', apolloClient)
})
