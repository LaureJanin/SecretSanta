import { dbService } from './database.js'
import { emailService } from './emailService.js'
import { authService } from './authService.js'
import { DrawService } from './drawService.js'
import type { GraphQLContext, User } from './types.js'
import type { GraphQLParent } from '../types/index.js'
import { randomBytes } from 'crypto'
import { compareEmails, validateEmail } from '../utils/email.js'

const requireAuth = (user: User | null | undefined): User => {
  if (!user) {
    throw new Error('Authentification requise')
  }
  return user
}

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value)

// Une idée cadeau ne peut être ajoutée/supprimée que par son propriétaire
// (ou par l'organisateur de la loterie, pour gérer le profil d'un enfant)
const requireGiftIdeaAccess = async (participantId: string, user: User) => {
  const participant = await dbService.getParticipantForRelation(participantId)
  if (!participant) throw new Error('Participant introuvable')

  const isOwnIdea = compareEmails(participant.email, user.email)
  const isLotteryOwner = !!(await dbService.getUserLotteryById(participant.lotteryId, user.id))
  if (!isOwnIdea && !isLotteryOwner) {
    throw new Error('Accès refusé : ce n\'est pas ta liste de cadeaux')
  }
  return participant
}

const requireOwnership = async (lotteryId: string, userId: string) => {
  const lottery = await dbService.getUserLotteryById(lotteryId, userId)
  if (!lottery) {
    throw new Error('Accès refusé : vous n\'êtes pas propriétaire de cette loterie')
  }
  return lottery
}

export const resolvers = {
  User: {
    lotteries: async (parent: GraphQLParent) => dbService.getUserLotteries(parent.id as string)
  },

  Lottery: {
    // Le lien d'invitation n'est visible que par l'organisateur
    inviteCode: (parent: GraphQLParent, _: unknown, context: GraphQLContext) =>
      context.user && parent.ownerId === context.user.id ? (parent.inviteCode as string | null) ?? null : null,
    owner: async (parent: GraphQLParent) => dbService.getUserById(parent.ownerId as string),
    draws: async (parent: GraphQLParent, _: unknown, context: GraphQLContext) => {
      const lottery = parent as { id: string; ownerId: string; _querySource?: string }
      const user = context.user
      
      if (!user) {
        return []
      }
      
      const isOwner = lottery.ownerId === user.id
      const isMyLotteriesQuery = lottery._querySource === 'myLotteries'
      
      if (isMyLotteriesQuery) {
        return dbService.getUserDraw(lottery.id, user.email)
      }
      
      if (isOwner) {
        return dbService.getDraws(lottery.id)
      }
      
      return dbService.getUserDraw(lottery.id, user.email)
    }
  },

  GiftIdea: {
    // Caché au propriétaire de l'idée : il ne doit pas savoir qu'on l'a déjà achetée
    isPurchased: async (parent: GraphQLParent, _: unknown, context: GraphQLContext) => {
      const idea = parent as unknown as { purchased: boolean; participantId: string }
      if (!idea.purchased || !context.user) return false

      const owner = await dbService.getParticipantForRelation(idea.participantId)
      return !(owner && compareEmails(owner.email, context.user.email))
    }
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

  Query: {
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

    lotteryInvite: async (_: unknown, { code }: { code: string }) => {
      const lottery = await dbService.getLotteryByInviteCode(code)
      if (!lottery) return null

      return {
        name: lottery.name,
        year: lottery.year,
        budget: lottery.budget,
        ownerName: lottery.owner.name,
        participantCount: lottery.participants.length,
        drawDone: lottery.draws.length > 0
      }
    },

  },

  Mutation: {
    register: async (_: unknown, { email, name, password }: { email: string; name: string; password: string }) =>
      authService.register(email, name, password),

    login: async (_: unknown, { email, password }: { email: string; password: string }) =>
      authService.login(email, password),

    requestPasswordReset: async (_: unknown, { email }: { email: string }) => {
      // Réponse identique que l'email existe ou non (pas de fuite d'information)
      await authService.requestPasswordReset(email)
      return true
    },

    resetPassword: async (_: unknown, { token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),

    createLottery: async (_: unknown, { name, year, budget }: { name: string; year: number; budget?: number | null }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      if (budget != null && (budget < 0 || budget > 100000)) {
        throw new Error('Budget invalide')
      }
      return dbService.createLottery(name, year, user.id, budget)
    },

    setLotteryBudget: async (_: unknown, { lotteryId, budget }: { lotteryId: string; budget?: number | null }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)
      if (budget != null && (budget < 0 || budget > 100000)) {
        throw new Error('Budget invalide')
      }
      return dbService.setLotteryBudget(lotteryId, budget ?? null)
    },

    generateInviteCode: async (_: unknown, { lotteryId }: { lotteryId: string }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)
      return dbService.setInviteCode(lotteryId, randomBytes(12).toString('base64url'))
    },

    joinLottery: async (_: unknown, { code }: { code: string }, context: GraphQLContext) => {
      const user = requireAuth(context.user)

      const lottery = await dbService.getLotteryByInviteCode(code)
      if (!lottery) throw new Error('Lien d\'invitation invalide ou expiré')
      if (lottery.draws.length > 0) {
        throw new Error('Le tirage a déjà eu lieu : impossible de rejoindre cette loterie')
      }

      const alreadyIn = lottery.participants.some(p => compareEmails(p.email, user.email))
      if (!alreadyIn) {
        await dbService.createParticipant(lottery.id, user.name, user.email, true)
      }
      return lottery
    },

    deleteLottery: async (_: unknown, { lotteryId }: { lotteryId: string }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)
      return dbService.deleteLottery(lotteryId)
    },

    addParticipant: async (_: unknown, { lotteryId, name, email, isActive }: { lotteryId: string; name: string; email?: string | null; isActive: boolean }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)

      if (email && !validateEmail(email)) {
        throw new Error('Format d\'email invalide')
      }

      return dbService.createParticipant(lotteryId, name, email || null, isActive)
    },

    addExclusion: async (_: unknown, { lotteryId, participantId, excludedId }: { lotteryId: string; participantId: string; excludedId: string }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireOwnership(lotteryId, user.id)

      // Les deux participants doivent appartenir à cette loterie (sinon on pourrait toucher à celle d'un autre)
      const [participant, excluded] = await Promise.all([
        dbService.getParticipantForRelation(participantId),
        dbService.getParticipantForRelation(excludedId)
      ])
      if (participant?.lotteryId !== lotteryId || excluded?.lotteryId !== lotteryId) {
        throw new Error('Participants invalides pour cette loterie')
      }

      return dbService.createExclusion(lotteryId, participantId, excludedId)
    },

    deleteExclusion: async (_: unknown, { exclusionId }: { exclusionId: string }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      const exclusion = await dbService.getExclusionById(exclusionId)
      if (!exclusion) throw new Error('Exclusion introuvable')
      await requireOwnership(exclusion.lotteryId, user.id)

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

    addGiftIdea: async (_: unknown, { participantId, title, description, link, imageUrl, price }: { participantId: string; title: string; description?: string | null; link?: string | null; imageUrl?: string | null; price?: number | null }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      await requireGiftIdeaAccess(participantId, user)

      if (link && !isHttpUrl(link)) throw new Error('Le lien doit commencer par http:// ou https://')
      if (imageUrl && !isHttpUrl(imageUrl)) throw new Error('L\'adresse de l\'image doit commencer par http:// ou https://')
      if (price != null && (price < 0 || price > 100000)) throw new Error('Prix invalide')

      return dbService.createGiftIdea(participantId, title, description || undefined, link || undefined, imageUrl || undefined, price ?? undefined)
    },

    deleteGiftIdea: async (_: unknown, { giftIdeaId }: { giftIdeaId: string }, context: GraphQLContext) => {
      const user = requireAuth(context.user)
      const idea = await dbService.getGiftIdeaById(giftIdeaId)
      if (!idea) throw new Error('Idée cadeau introuvable')
      await requireGiftIdeaAccess(idea.participantId, user)

      return dbService.deleteGiftIdea(giftIdeaId)
    },

    // Seule la personne qui doit offrir un cadeau à ce participant peut marquer l'idée comme achetée
    setGiftIdeaPurchased: async (_: unknown, { giftIdeaId, purchased }: { giftIdeaId: string; purchased: boolean }, context: GraphQLContext) => {
      const user = requireAuth(context.user)

      const idea = await dbService.getGiftIdeaById(giftIdeaId)
      if (!idea) throw new Error('Idée cadeau introuvable')

      const receiver = await dbService.getParticipantForRelation(idea.participantId)
      if (!receiver) throw new Error('Participant introuvable')

      const myDraws = await dbService.getUserDraw(receiver.lotteryId, user.email)
      if (!myDraws.some(draw => draw.receiverId === receiver.id)) {
        throw new Error('Seule la personne qui offre un cadeau à ce participant peut faire ça')
      }

      return dbService.setGiftIdeaPurchased(giftIdeaId, purchased)
    }
  }
}
