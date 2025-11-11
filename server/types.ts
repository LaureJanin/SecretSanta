// Réexporter les types depuis le dossier types centralisé
export type {
  EmailResult,
  DrawAssignment,
  User,
  AuthResult
} from '../types/index.js'

// Context GraphQL avec utilisateur authentifié
export interface GraphQLContext {
  user?: import('../types/index.js').User | null
}
