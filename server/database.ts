import { PrismaClient } from '@prisma/client'
import { compareEmails } from '../utils/email.js'

class DatabaseService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async createUser(email: string, name: string, password: string) {
    return this.prisma.user.create({
      data: { email, name, password },
      select: { id: true, email: true, name: true, createdAt: true }
    })
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { lotteries: true }
    })
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { lotteries: true }
    })
  }

  async createLottery(name: string, year: number, ownerId: string) {
    return this.prisma.lottery.create({
      data: { name, year, ownerId },
      include: { owner: true, participants: true, exclusions: true, draws: true }
    })
  }


  async getUserLotteries(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    })

    if (!user) return []

    const lotteries = await this.prisma.lottery.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            participants: {
              some: {
                email: user.email
              }
            }
          }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: true,
        participants: { include: { giftIdeas: true } },
        exclusions: {
          include: {
            participant: true,
            excluded: true
          }
        }
      }
    })

    return lotteries.map(lottery => ({
      ...lottery,
      _querySource: 'myLotteries' as const
    }))
  }

  async getOwnedLotteries(userId: string) {
    return this.prisma.lottery.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: true,
        participants: { include: { giftIdeas: true } },
        exclusions: {
          include: {
            participant: true,
            excluded: true
          }
        }
      }
    })
  }

  async getUserLotteryById(id: string, userId: string) {
    return this.prisma.lottery.findFirst({
      where: { id, ownerId: userId },
      include: {
        owner: true,
        participants: { include: { giftIdeas: true } },
        exclusions: true,
        draws: true
      }
    })
  }

  async getLotteryById(id: string) {
    return this.prisma.lottery.findUnique({
      where: { id },
      include: { participants: true, exclusions: true, draws: true }
    })
  }

  async createParticipant(lotteryId: string, name: string, email: string | null, isActive: boolean) {
    return this.prisma.participant.create({
      data: { name, email, isActive, lottery: { connect: { id: lotteryId } } }
    })
  }



  async getActiveParticipants(lotteryId: string) {
    return this.prisma.participant.findMany({
      where: { lotteryId, isActive: true },
      include: { exclusions: true, excluded: true }
    })
  }

  async createGiftIdea(participantId: string, title: string, description?: string, link?: string) {
    return this.prisma.giftIdea.create({
      data: { title, description, link, participant: { connect: { id: participantId } } }
    })
  }

  async deleteGiftIdea(giftIdeaId: string) {
    await this.prisma.giftIdea.delete({
      where: { id: giftIdeaId }
    })
    return true
  }

  async createExclusion(lotteryId: string, participantId: string, excludedId: string) {
    return this.prisma.exclusion.create({
      data: {
        lottery: { connect: { id: lotteryId } },
        participant: { connect: { id: participantId } },
        excluded: { connect: { id: excludedId } }
      }
    })
  }

  async deleteExclusion(exclusionId: string) {
    await this.prisma.exclusion.delete({
      where: { id: exclusionId }
    })
    return true
  }

  async clearDraws(lotteryId: string) {
    await this.prisma.draw.deleteMany({ where: { lotteryId } })
  }

  async createDraw(lotteryId: string, giverId: string, receiverId: string) {
    return this.prisma.draw.create({
      data: {
        lottery: { connect: { id: lotteryId } },
        giver: { connect: { id: giverId } },
        receiver: { connect: { id: receiverId } }
      }
    })
  }

  async getDraws(lotteryId: string) {
    return this.prisma.draw.findMany({
      where: { lotteryId },
      include: {
        giver: { include: { giftIdeas: true } },
        receiver: { include: { giftIdeas: true } }
      }
    })
  }

  async getUserDraw(lotteryId: string, userEmail: string) {
    const participants = await this.prisma.participant.findMany({
      where: { lotteryId },
      include: { giftIdeas: true }
    })

    const userParticipant = participants.find(p => compareEmails(p.email, userEmail))

    if (!userParticipant) {
      return []
    }

    return this.prisma.draw.findMany({
      where: {
        lotteryId,
        giverId: userParticipant.id
      },
      include: {
        giver: { include: { giftIdeas: true } },
        receiver: { include: { giftIdeas: true } }
      }
    })
  }

  async getDrawsWithGiftIdeas(lotteryId: string) {
    return this.prisma.draw.findMany({
      where: { lotteryId },
      include: { giver: true, receiver: { include: { giftIdeas: true } } }
    })
  }

  async getManagedChildren(managerId: string) {
    const managers = await this.prisma.participantManager.findMany({
      where: { managerId },
      include: { child: true }
    })
    return managers.map(m => m.child)
  }

  async getParticipantForRelation(participantId: string) {
    return this.prisma.participant.findUnique({
      where: { id: participantId },
      include: { giftIdeas: true }
    })
  }

  async deleteLottery(lotteryId: string) {
    const participants = await this.prisma.participant.findMany({
      where: { lotteryId },
      select: { id: true }
    })
    const participantIds = participants.map(p => p.id)

    await this.prisma.draw.deleteMany({ where: { lotteryId } })
    await this.prisma.exclusion.deleteMany({ where: { lotteryId } })
    await this.prisma.giftIdea.deleteMany({
      where: {
        participantId: {
          in: participantIds
        }
      }
    })
    await this.prisma.participantManager.deleteMany({
      where: {
        OR: [
          { childId: { in: participantIds } },
          { managerId: { in: participantIds } }
        ]
      }
    })
    await this.prisma.participant.deleteMany({ where: { lotteryId } })
    await this.prisma.lottery.delete({ where: { id: lotteryId } })
    return true
  }

  async disconnect() {
    await this.prisma.$disconnect()
  }
}

export const dbService = new DatabaseService()
