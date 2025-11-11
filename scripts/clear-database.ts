import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearDatabase() {
  try {
    console.log('🗑️  Suppression de toutes les données...')

    console.log('   Suppression des draws...')
    await prisma.draw.deleteMany({})

    console.log('   Suppression des exclusions...')
    await prisma.exclusion.deleteMany({})

    console.log('   Suppression des gift ideas...')
    await prisma.giftIdea.deleteMany({})

    console.log('   Suppression des participant managers...')
    await prisma.participantManager.deleteMany({})

    console.log('   Suppression des participants...')
    await prisma.participant.deleteMany({})

    console.log('   Suppression des loteries...')
    await prisma.lottery.deleteMany({})

    console.log('   Suppression des utilisateurs...')
    await prisma.user.deleteMany({})

    console.log('✅ Base de données vidée avec succès !')
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

clearDatabase()

