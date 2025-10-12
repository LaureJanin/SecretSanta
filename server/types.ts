// Types pour l'API GraphQL
export interface EmailResult {
  sent: number
  errors: string[]
  success: boolean
}

export interface DrawAssignment {
  giverId: string
  receiverId: string
}

// Types d'authentification
export interface User {
  id: string
  email: string
  name: string
  createdAt: string | Date  // Accepter les deux types pour compatibilité Prisma
}

export interface AuthResult {
  success: boolean
  user: User | null
  token: string | null
  error: string | null
}

// Context GraphQL avec utilisateur authentifié
export interface GraphQLContext {
  user?: User | null
}
