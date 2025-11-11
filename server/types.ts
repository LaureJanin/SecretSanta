export type {
  EmailResult,
  DrawAssignment,
  User,
  AuthResult
} from '../types/index.js'

export interface GraphQLContext {
  user?: import('../types/index.js').User | null
}
