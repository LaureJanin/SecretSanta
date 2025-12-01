import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const prisma = new PrismaClient()

function generatePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%&*'
  const allChars = uppercase + lowercase + numbers + symbols
  
  let password = ''
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

async function resetPassword() {
  try {
    const email = process.argv[2]
    const newPassword = process.argv[3] || generatePassword(12)

    if (!email) {
      console.error('Usage: node --loader ts-node/esm scripts/reset-user-password.ts <email> [nouveau_mot_de_passe]')
      console.error('Si aucun mot de passe n\'est fourni, un mot de passe aléatoire sera généré')
      process.exit(1)
    }

    if (newPassword.length < 6) {
      console.error('❌ Le mot de passe doit contenir au moins 6 caractères')
      process.exit(1)
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.error(`❌ Utilisateur avec l'email "${email}" non trouvé`)
      process.exit(1)
    }

    console.log(`✅ Utilisateur trouvé: ${user.name} (${user.email})`)
    
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    console.log(`\n✅ Mot de passe réinitialisé avec succès pour ${user.name}`)
    console.log(`\n📝 NOUVEAU MOT DE PASSE:`)
    console.log(`   ${newPassword}`)
    console.log(`\n⚠️  IMPORTANT: Communiquez ce mot de passe de manière sécurisée à l'utilisateur`)
    console.log(`   L'utilisateur pourra le changer après connexion si souhaité\n`)
    
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

resetPassword()
