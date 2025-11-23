import { PrismaClient } from '@prisma/client'
import Database from 'better-sqlite3'
import * as path from 'path'

async function migrateData() {
  console.log('🔄 Migration des données SQLite → PostgreSQL')
  console.log('')

  // Lire depuis SQLite avec better-sqlite3
  const sqlitePath = path.join(process.cwd(), 'prisma', 'dev.db')
  const sqlite = new Database(sqlitePath, { readonly: true })

  // Écrire dans PostgreSQL avec Prisma
  const postgres = new PrismaClient()

  try {
    console.log('📤 Lecture des données depuis SQLite...')

    // Lire toutes les données
    const users = sqlite.prepare('SELECT * FROM User').all() as any[]
    const lotteries = sqlite.prepare('SELECT * FROM Lottery').all() as any[]
    const participants = sqlite.prepare('SELECT * FROM Participant').all() as any[]
    const giftIdeas = sqlite.prepare('SELECT * FROM GiftIdea').all() as any[]
    const exclusions = sqlite.prepare('SELECT * FROM Exclusion').all() as any[]
    const draws = sqlite.prepare('SELECT * FROM Draw').all() as any[]
    const participantManagers = sqlite.prepare('SELECT * FROM ParticipantManager').all() as any[]

    console.log(`   ✅ ${users.length} utilisateur(s)`)
    console.log(`   ✅ ${lotteries.length} loterie(s)`)
    console.log(`   ✅ ${participants.length} participant(s)`)
    console.log(`   ✅ ${giftIdeas.length} idée(s) cadeau(x)`)
    console.log(`   ✅ ${exclusions.length} exclusion(s)`)
    console.log(`   ✅ ${draws.length} tirage(s)`)
    console.log(`   ✅ ${participantManagers.length} gestion(s) de participant(s)`)
    console.log('')

    if (users.length === 0 && lotteries.length === 0) {
      console.log('⚠️  Aucune donnée à migrer')
      return
    }

    console.log('📥 Écriture des données dans PostgreSQL...')

    // Fonction pour convertir les timestamps SQLite (millisecondes) en Date
    const convertDate = (timestamp: number | string): Date => {
      if (typeof timestamp === 'string') {
        return new Date(timestamp)
      }
      // SQLite stocke en millisecondes
      return new Date(timestamp)
    }

    // Migrer User
    if (users.length > 0) {
      console.log('   Import des utilisateurs...')
      for (const user of users) {
        try {
          await postgres.user.upsert({
            where: { id: user.id },
            update: {},
            create: {
              id: user.id,
              email: user.email,
              name: user.name,
              password: user.password,
              createdAt: convertDate(user.createdAt),
            }
          })
        } catch (error: any) {
          if (!error.message?.includes('Unique constraint') && !error.message?.includes('duplicate key')) {
            console.error(`   ❌ Erreur pour utilisateur ${user.id}:`, error.message)
          }
        }
      }
      console.log(`   ✅ ${users.length} utilisateur(s) importé(s)`)
    }

    // Migrer Lottery
    if (lotteries.length > 0) {
      console.log('   Import des loteries...')
      for (const lottery of lotteries) {
        try {
          await postgres.lottery.upsert({
            where: { id: lottery.id },
            update: {},
            create: {
              id: lottery.id,
              name: lottery.name,
              year: lottery.year,
              ownerId: lottery.ownerId,
              createdAt: convertDate(lottery.createdAt),
            }
          })
        } catch (error: any) {
          if (!error.message?.includes('Unique constraint') && !error.message?.includes('duplicate key')) {
            console.error(`   ❌ Erreur pour loterie ${lottery.id}:`, error.message)
          }
        }
      }
      console.log(`   ✅ ${lotteries.length} loterie(s) importée(s)`)
    }

    // Migrer Participant
    if (participants.length > 0) {
      console.log('   Import des participants...')
      for (const participant of participants) {
        try {
          await postgres.participant.upsert({
            where: { id: participant.id },
            update: {},
            create: {
              id: participant.id,
              name: participant.name,
              email: participant.email || null,
              isActive: participant.isActive ? true : false,
              lotteryId: participant.lotteryId,
              createdAt: convertDate(participant.createdAt),
            }
          })
        } catch (error: any) {
          if (!error.message?.includes('Unique constraint') && !error.message?.includes('duplicate key')) {
            console.error(`   ❌ Erreur pour participant ${participant.id}:`, error.message)
          }
        }
      }
      console.log(`   ✅ ${participants.length} participant(s) importé(s)`)
    }

    // Migrer GiftIdea
    if (giftIdeas.length > 0) {
      console.log('   Import des idées cadeaux...')
      for (const idea of giftIdeas) {
        try {
          await postgres.giftIdea.upsert({
            where: { id: idea.id },
            update: {},
            create: {
              id: idea.id,
              participantId: idea.participantId,
              title: idea.title,
              description: idea.description || null,
              link: idea.link || null,
              createdAt: convertDate(idea.createdAt),
            }
          })
        } catch (error: any) {
          if (!error.message?.includes('Unique constraint') && !error.message?.includes('duplicate key')) {
            console.error(`   ❌ Erreur pour idée cadeau ${idea.id}:`, error.message)
          }
        }
      }
      console.log(`   ✅ ${giftIdeas.length} idée(s) cadeau(x) importée(s)`)
    }

    // Migrer Exclusion
    if (exclusions.length > 0) {
      console.log('   Import des exclusions...')
      for (const exclusion of exclusions) {
        try {
          await postgres.exclusion.upsert({
            where: { id: exclusion.id },
            update: {},
            create: {
              id: exclusion.id,
              lotteryId: exclusion.lotteryId,
              participantId: exclusion.participantId,
              excludedId: exclusion.excludedId,
            }
          })
        } catch (error: any) {
          if (!error.message?.includes('Unique constraint') && !error.message?.includes('duplicate key')) {
            console.error(`   ❌ Erreur pour exclusion ${exclusion.id}:`, error.message)
          }
        }
      }
      console.log(`   ✅ ${exclusions.length} exclusion(s) importée(s)`)
    }

    // Migrer Draw
    if (draws.length > 0) {
      console.log('   Import des tirages...')
      for (const draw of draws) {
        try {
          await postgres.draw.upsert({
            where: { id: draw.id },
            update: {},
            create: {
              id: draw.id,
              lotteryId: draw.lotteryId,
              giverId: draw.giverId,
              receiverId: draw.receiverId,
            }
          })
        } catch (error: any) {
          if (!error.message?.includes('Unique constraint') && !error.message?.includes('duplicate key')) {
            console.error(`   ❌ Erreur pour tirage ${draw.id}:`, error.message)
          }
        }
      }
      console.log(`   ✅ ${draws.length} tirage(s) importé(s)`)
    }

    // Migrer ParticipantManager
    if (participantManagers.length > 0) {
      console.log('   Import des gestionnaires de participants...')
      for (const pm of participantManagers) {
        try {
          await postgres.participantManager.upsert({
            where: { id: pm.id },
            update: {},
            create: {
              id: pm.id,
              childId: pm.childId,
              managerId: pm.managerId,
            }
          })
        } catch (error: any) {
          if (!error.message?.includes('Unique constraint') && !error.message?.includes('duplicate key')) {
            console.error(`   ❌ Erreur pour gestionnaire ${pm.id}:`, error.message)
          }
        }
      }
      console.log(`   ✅ ${participantManagers.length} gestionnaire(s) importé(s)`)
    }

    console.log('')
    console.log('🔍 Vérification finale...')

    const finalUsers = await postgres.user.count()
    const finalLotteries = await postgres.lottery.count()
    const finalParticipants = await postgres.participant.count()
    const finalGiftIdeas = await postgres.giftIdea.count()
    const finalExclusions = await postgres.exclusion.count()
    const finalDraws = await postgres.draw.count()

    console.log(`   Utilisateurs: ${finalUsers}`)
    console.log(`   Loteries: ${finalLotteries}`)
    console.log(`   Participants: ${finalParticipants}`)
    console.log(`   Idées cadeaux: ${finalGiftIdeas}`)
    console.log(`   Exclusions: ${finalExclusions}`)
    console.log(`   Tirages: ${finalDraws}`)

    console.log('')
    console.log('✅ Migration terminée avec succès !')

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    throw error
  } finally {
    sqlite.close()
    await postgres.$disconnect()
  }
}

migrateData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

