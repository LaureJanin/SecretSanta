// Types partagés entre frontend et backend

// === AUTHENTIFICATION ===
export interface User {
  id: string
  email: string
  name: string
  createdAt?: string | Date
}

export interface AuthResult {
  success: boolean
  user: User | null
  token: string | null
  error: string | null
}

// === LOTERIES ===
export interface Lottery {
  id: string
  name: string
  year: number
  createdAt?: string | Date
  owner?: User
  participants?: Participant[]
  draws?: Draw[]
}

// === PARTICIPANTS ===
export interface Participant {
  id: string
  name: string
  email?: string | null
  isActive: boolean
  lotteryId: string
  createdAt?: string | Date
  giftIdeas?: GiftIdea[]
}

// === IDÉES CADEAUX ===
export interface GiftIdea {
  id: string
  participantId: string
  title: string
  description?: string | null
  link?: string | null
  createdAt?: string | Date
}

// === EXCLUSIONS ===
export interface Exclusion {
  id: string
  lotteryId: string
  participantId: string
  excludedId: string
}

// === TIRAGES ===
export interface Draw {
  id: string
  lotteryId: string
  giverId: string
  receiverId: string
  giver?: Participant
  receiver?: Participant
}

// === EMAIL ===
export interface EmailResult {
  sent: number
  errors: string[]
  success: boolean
}

// === AUTRES ===
export interface DrawAssignment {
  giverId: string
  receiverId: string
}

// Types pour les réponses GraphQL
export interface LotteryResponse {
  id: string
  name: string
  year: number
  owner?: {
    id: string
    name: string
  }
  participants?: ParticipantResponse[]
  draws?: DrawResponse[]
}

export interface ParticipantResponse {
  id: string
  name: string
  email?: string | null
  isActive: boolean
  giftIdeas?: GiftIdeaResponse[]
}

export interface GiftIdeaResponse {
  id: string
  title: string
  description?: string | null
  link?: string | null
}

export interface DrawResponse {
  id: string
  giver?: {
    id: string
    name: string
    email?: string | null
  }
  receiver?: {
    id: string
    name: string
    email?: string | null
    giftIdeas?: GiftIdeaResponse[]
  }
}

// === TYPES POUR LE SERVEUR ===
export interface ParticipantWithExclusions {
  id: string
  name: string
  email?: string | null
  isActive: boolean
  exclusions?: Array<{ excludedId: string }>
  excluded?: Array<{ participantId: string }>
}

export interface GraphQLParent {
  id: string
  [key: string]: unknown
}

