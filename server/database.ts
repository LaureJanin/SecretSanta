import { PrismaClient } from '@prisma/client'

class DatabaseService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  // === UTILISATEURS ===
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

  // === LOTERIES ===
  async createLottery(name: string, year: number, ownerId: string) {
    return this.prisma.lottery.create({
      data: { name, year, ownerId },
      include: { owner: true, participants: true, exclusions: true, draws: true }
    })
  }

  async getAllLotteries() {
    return this.prisma.lottery.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        participants: { include: { giftIdeas: true } },
        exclusions: true,
        draws: true
      }
    })
  }

  async getCurrentLottery() {
    return this.prisma.lottery.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        participants: { include: { giftIdeas: true } },
        exclusions: true,
        draws: true
      }
    })
  }

  async getUserLotteries(userId: string) {
    return this.prisma.lottery.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: true,
        participants: { include: { giftIdeas: true } },
        exclusions: true,
        draws: true
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

  // === PARTICIPANTS ===
  async createParticipant(lotteryId: string, name: string, email: string | null, isActive: boolean, loginCode: string | null) {
    return this.prisma.participant.create({
      data: { name, email, isActive, loginCode, lottery: { connect: { id: lotteryId } } }
    })
  }

  async getParticipantById(id: string) {
    return this.prisma.participant.findUnique({
      where: { id },
      include: { giftIdeas: true, managedChildren: { include: { child: true } } }
    })
  }

  async getParticipantByLoginCode(loginCode: string) {
    return this.prisma.participant.findUnique({
      where: { loginCode },
      include: { giftIdeas: true, managedChildren: { include: { child: true } } }
    })
  }

  async getActiveParticipants(lotteryId: string) {
    return this.prisma.participant.findMany({
      where: { lotteryId, isActive: true },
      include: { exclusions: true, excluded: true }
    })
  }

  // === AUTRES OPÉRATIONS ===
  async createGiftIdea(participantId: string, title: string, description?: string, link?: string) {
    return this.prisma.giftIdea.create({
      data: { title, description, link, participant: { connect: { id: participantId } } }
    })
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
      include: { giver: true, receiver: true }
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
    return this.prisma.participant.findUnique({ where: { id: participantId } })
  }

  async disconnect() {
    await this.prisma.$disconnect()
  }
}

export const dbService = new DatabaseService()
