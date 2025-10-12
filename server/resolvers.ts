import { dbService } from './database.js'
import { emailService } from './emailService.js'
import { authService } from './authService.js'
import { DrawService } from './drawService.js'
import type { GraphQLContext } from './types.js'

// Middleware d'authentification
const requireAuth = (user: any) => {
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
    lotteries: async (parent: any) => dbService.getUserLotteries(parent.id)
  },

  Lottery: {
    owner: async (parent: any) => dbService.getUserById(parent.ownerId)
  },

  Participant: {
    managedChildren: async (parent: any) => dbService.getManagedChildren(parent.id)
  },

  Exclusion: {
    participant: async (parent: any) => dbService.getParticipantForRelation(parent.participantId),
    excluded: async (parent: any) => dbService.getParticipantForRelation(parent.excludedId)
  },

  Draw: {
    giver: async (parent: any) => dbService.getParticipantForRelation(parent.giverId),
    receiver: async (parent: any) => dbService.getParticipantForRelation(parent.receiverId)
  },

  // === QUERIES ===
  Query: {
    // Queries sécurisées
    me: async (_: any, __: any, context: GraphQLContext) => {
      return requireAuth(context.user)
    },

    myLotteries: async (_: any, __: any, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      return dbService.getUserLotteries(user.id)
    },

    myLottery: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      return dbService.getUserLotteryById(id, user.id)
    },

    // Queries publiques
    participantByLoginCode: async (_: any, { loginCode }: { loginCode: string }) =>
      dbService.getParticipantByLoginCode(loginCode)
  },

  // === MUTATIONS ===
  Mutation: {
    // Authentification
    register: async (_: any, { email, name, password }: { email: string; name: string; password: string }) =>
      authService.register(email, name, password),

    login: async (_: any, { email, password }: { email: string; password: string }) =>
      authService.login(email, password),

    // Gestion des loteries (authentification requise)
    createLottery: async (_: any, { name, year }: { name: string; year: number }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      return dbService.createLottery(name, year, user.id)
    },

    // Gestion des participants (authentification requise + propriétaire)
    addParticipant: async (_: any, { lotteryId, name, email, isActive }: any, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)

      const loginCode = isActive ? DrawService.generateLoginCode() : null
      return dbService.createParticipant(lotteryId, name, email || null, isActive, loginCode)
    },

    addExclusion: async (_: any, { lotteryId, participantId, excludedId }: any, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)

      return dbService.createExclusion(lotteryId, participantId, excludedId)
    },

    performDraw: async (_: any, { lotteryId }: { lotteryId: string }, context: GraphQLContext) => {
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

    sendLoginCodes: async (_: any, { lotteryId }: { lotteryId: string }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)

      return emailService.sendLoginCodes(lotteryId)
    },

    sendDrawResults: async (_: any, { lotteryId }: { lotteryId: string }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)

      return emailService.sendDrawResults(lotteryId)
    },

    // Gestion des idées cadeaux (public avec loginCode)
    addGiftIdea: async (_: any, { participantId, title, description, link }: any) =>
      dbService.createGiftIdea(participantId, title, description, link),

    // Test email (authentification requise)
    testGmailDirect: async (_: any, __: any, context: GraphQLContext) => {
      requireAuth(context.user)
      return emailService.testGmailDirect()
    }
  }
}
