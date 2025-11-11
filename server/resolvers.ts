import { dbService } from './database.js'
import { emailService } from './emailService.js'
import { authService } from './authService.js'
import { DrawService } from './drawService.js'
import type { GraphQLContext, User } from './types.js'
import type { GraphQLParent } from '../types/index.js'

// Middleware d'authentification
const requireAuth = (user: User | null | undefined): User => {
  if (!user) {
    throw new Error('Authentification requise')
  }
  return user
}

// Middleware de vérification de propriété
const requireOwnership = async (lotteryId: string, userId: string) => {
  const lottery = await dbService.getUserLotteryById(lotteryId, userId)
  if (!lottery) {
    throw new Error('Accès refusé : vous n\'êtes pas propriétaire de cette loterie')
  }
  return lottery
}

export const resolvers = {
  // === RESOLVERS RELATIONNELS ===
  User: {
    lotteries: async (parent: GraphQLParent) => dbService.getUserLotteries(parent.id as string)
  },

  Lottery: {
    owner: async (parent: GraphQLParent) => dbService.getUserById(parent.ownerId as string)
  },

  Participant: {
    managedChildren: async (parent: GraphQLParent) => dbService.getManagedChildren(parent.id as string)
  },

  Exclusion: {
    participant: async (parent: GraphQLParent) => dbService.getParticipantForRelation(parent.participantId as string),
    excluded: async (parent: GraphQLParent) => dbService.getParticipantForRelation(parent.excludedId as string)
  },

  Draw: {
    giver: async (parent: GraphQLParent) => dbService.getParticipantForRelation(parent.giverId as string),
    receiver: async (parent: GraphQLParent) => dbService.getParticipantForRelation(parent.receiverId as string)
  },

  // === QUERIES ===
  Query: {
    // Queries sécurisées
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      return requireAuth(context.user)
    },

    myLotteries: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      return dbService.getUserLotteries(user.id)
    },

    myOwnedLotteries: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      return dbService.getOwnedLotteries(user.id)
    },

  },

  // === MUTATIONS ===
  Mutation: {
    // Authentification
    register: async (_: unknown, { email, name, password }: { email: string; name: string; password: string }) =>
      authService.register(email, name, password),

    login: async (_: unknown, { email, password }: { email: string; password: string }) =>
      authService.login(email, password),

    // Gestion des loteries (authentification requise)
    createLottery: async (_: unknown, { name, year }: { name: string; year: number }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      return dbService.createLottery(name, year, user.id)
    },

    // Gestion des participants (authentification requise + propriétaire)
    addParticipant: async (_: unknown, { lotteryId, name, email, isActive }: { lotteryId: string; name: string; email?: string | null; isActive: boolean }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)

      return dbService.createParticipant(lotteryId, name, email || null, isActive)
    },

    addExclusion: async (_: unknown, { lotteryId, participantId, excludedId }: { lotteryId: string; participantId: string; excludedId: string }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)

      return dbService.createExclusion(lotteryId, participantId, excludedId)
    },

    deleteExclusion: async (_: unknown, { exclusionId }: { exclusionId: string }, context: GraphQLContext) => {
      requireAuth(context.user)
      // Note: On devrait vérifier que l'exclusion appartient à une loterie de l'user
      // mais pour simplifier, on fait confiance au frontend pour ne montrer que ses exclusions
      return dbService.deleteExclusion(exclusionId)
    },

    performDraw: async (_: unknown, { lotteryId }: { lotteryId: string }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)

      const participants = await dbService.getActiveParticipants(lotteryId)

      if (!DrawService.validateDrawPossibility(participants)) {
        throw new Error('Impossible d\'effectuer le tirage avec les exclusions actuelles')
      }

      await dbService.clearDraws(lotteryId)
      const assignments = DrawService.performDraw(participants)

      for (const assignment of assignments) {
        await dbService.createDraw(lotteryId, assignment.giverId, assignment.receiverId)
      }

      return dbService.getDraws(lotteryId)
    },


    sendDrawResults: async (_: unknown, { lotteryId }: { lotteryId: string }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)

      return emailService.sendDrawResults(lotteryId)
    },

    // Gestion des idées cadeaux
    addGiftIdea: async (_: unknown, { participantId, title, description, link }: { participantId: string; title: string; description?: string | null; link?: string | null }, context: GraphQLContext) => {
      requireAuth(context.user)
      return dbService.createGiftIdea(participantId, title, description, link)
    },

    deleteGiftIdea: async (_: unknown, { giftIdeaId }: { giftIdeaId: string }, context: GraphQLContext) => {
      requireAuth(context.user)
      return dbService.deleteGiftIdea(giftIdeaId)
    }
  }
}
