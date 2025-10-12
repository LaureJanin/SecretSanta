import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { authService } from './authService.js'
import type { GraphQLContext, User } from './types.js'

async function startServer() {
  try {
    console.log('🔄 Démarrage du serveur Apollo...')

    // Import sécurisé des modules
    console.log('📦 Chargement du schéma...')
    const { typeDefs } = await import('./schema.js')

    console.log('🔧 Chargement des resolvers...')
    const { resolvers } = await import('./resolvers.js')

    console.log('💾 Chargement de la base de données...')
    const { dbService } = await import('./database.js')

    console.log('🔐 Chargement du service d\'authentification...')

    console.log('✅ Tous les modules chargés avec succès')

    // Configuration du serveur Apollo
    console.log('⚙️ Configuration du serveur Apollo...')
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (error) => {
        console.error('❌ Erreur GraphQL:', error.message)
        return {
          message: error.message,
          ...(process.env.NODE_ENV === 'development' && {
            locations: error.locations,
            path: error.path
          })
        }
      }
    })

    console.log('🚀 Démarrage du serveur sur le port 4000...')
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req }): Promise<GraphQLContext> => {
        const authHeader = req.headers.authorization
        const token = authService.extractTokenFromHeader(authHeader)

        let user: User | null = null
        if (token) {
          user = await authService.getUserFromToken(token)
        }

        return { user }
      }
    })

    console.log('\n✅ Serveur Apollo GraphQL démarré avec succès !')
    console.log(`📊 Apollo Studio: ${url}`)

    // Gestionnaire d'arrêt propre
    process.on('SIGINT', async () => {
      console.log('\n🛑 Arrêt du serveur...')
      try {
        await dbService.disconnect()
      } catch (error) {
        console.error('Erreur lors de la déconnexion DB:', error)
      }
      process.exit(0)
    })

  } catch (error) {
    console.error('\n💥 Erreur lors du démarrage du serveur:')
    console.error('🔴 Message:', error instanceof Error ? error.message : error)
    console.error('🔍 Stack:', error instanceof Error ? error.stack : 'Stack non disponible')

    try {
      const { dbService } = await import('./database.js')
      await dbService.disconnect()
    } catch (disconnectError) {
      console.error('Erreur lors de la déconnexion:', disconnectError)
    }

    process.exit(1)
  }
}

startServer()
