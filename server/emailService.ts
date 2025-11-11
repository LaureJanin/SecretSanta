import type { EmailResult } from './types.js'
import { dbService } from './database.js'

async function createGmailTransporter() {
  try {
    const nodemailer = await import('nodemailer')

    if (!process.env.GMAIL_APP_PASSWORD || !process.env.ADMIN_EMAIL) {
      console.warn('⚠️ Variables Gmail manquantes (GMAIL_APP_PASSWORD, ADMIN_EMAIL)')
      return null
    }

    return nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Gmail:', error)
    return null
  }
}

const EMAIL_TEMPLATES = {

  drawResult: (giverName: string, receiverName: string, giftIdeasHtml: string, lotteryName?: string, giverEmail?: string) => `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Résultat du tirage - Loterie de Noël</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            🎯 Résultat du tirage !
          </h1>
          <p style="color: #e8f5e8; margin: 10px 0 0 0; font-size: 16px;">${lotteryName || 'Loterie de Noël 2025'}</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
            Bonjour <strong style="color: #28a745;">${giverName}</strong> ! 🎄
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Le tirage au sort a eu lieu ! Voici votre mission secrète pour Noël :
          </p>
          
          <!-- Reveal Box -->
          <div style="background: linear-gradient(135deg, #dc3545, #c82333); padding: 30px; border-radius: 15px; text-align: center; margin: 25px 0; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2);">
            <h2 style="color: white; margin: 0 0 15px 0; font-size: 22px;">🎁 Vous offrez un cadeau à :</h2>
            <div style="background: white; padding: 25px; border-radius: 10px; margin: 0 auto;">
              <span style="font-size: 28px; font-weight: bold; color: #dc3545;">
                ${receiverName}
              </span>
            </div>
            <p style="color: #ffebee; margin: 15px 0 0 0; font-size: 14px;">🤫 Gardez le secret !</p>
          </div>
          
          <!-- Gift Ideas -->
          ${giftIdeasHtml}
          
          <!-- CTA - Créer un compte -->
          <div style="background: linear-gradient(135deg, #1ca463, #28a745); padding: 25px; border-radius: 10px; text-align: center; margin: 25px 0;">
            <h3 style="color: white; margin: 0 0 10px 0; font-size: 20px;">📱 Accédez à votre espace personnel</h3>
            <p style="color: #e8f5e8; margin: 0 0 20px 0; font-size: 14px;">
              Créez un compte pour consulter votre attribution à tout moment et ajouter vos propres idées cadeaux !
            </p>
            <a href="${process.env.SITE_URL || 'http://localhost:3000'}/signup" 
               style="display: inline-block; background: white; color: #1ca463; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
              🎯 Créer mon compte
            </a>
            ${giverEmail ? `<p style="color: #e8f5e8; margin: 15px 0 0 0; font-size: 12px;">
              Utilisez cette adresse email : <strong>${giverEmail}</strong>
            </p>` : ''}
          </div>
          
          <!-- Tips -->
          <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #007bff;">
            <h3 style="color: #0056b3; margin-top: 0; font-size: 18px;">🎯 Conseils de votre Père Noël :</h3>
            <ul style="color: #333; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
              <li>🤫 <strong>Secret absolu !</strong> N'en parlez à personne</li>
              <li>💰 Respectez le budget convenu</li>
              <li>🎁 Soignez l'emballage, c'est important !</li>
            </ul>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="margin: 0; color: #666; font-size: 16px; font-weight: bold;">
            Joyeux Noël ! 🎅🎄✨
          </p>
          <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">
            Que la magie de Noël opère ! ✨
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export class EmailService {

  async sendDrawResults(lotteryId: string): Promise<EmailResult> {
    try {
      const lottery = await dbService.getLotteryById(lotteryId)
      if (!lottery) throw new Error('Loterie non trouvée')

      const draws = await dbService.getDrawsWithGiftIdeas(lotteryId)
      if (draws.length === 0) throw new Error('Aucun tirage trouvé')

      console.log(`🎯 Envoi des résultats du tirage (${draws.length} assignations) pour "${lottery.name}"`)
      const emailsToSend = draws.filter(draw => draw.giver?.email)

      if (emailsToSend.length === 0) {
        return {
          sent: 0,
          errors: ['Aucun participant avec email dans le tirage'],
          success: false
        }
      }

      const results = { sent: 0, errors: [] as string[] }
      const gmailTransporter = await createGmailTransporter()

      if (!gmailTransporter) {
        return {
          sent: 0,
          errors: ['Gmail non disponible - vérifiez la configuration'],
          success: false
        }
      }

      console.log('📧 Utilisation de Gmail SMTP')

      const batchSize = 10
      for (let i = 0; i < emailsToSend.length; i += batchSize) {
        const batch = emailsToSend.slice(i, i + batchSize)

        const emailPromises = batch.map(async (draw) => {
          const giftIdeasHtml = this.generateGiftIdeasHtml(draw.receiver?.giftIdeas || [])

          try {
            await gmailTransporter.sendMail({
              from: `"Loterie de Noël" <${process.env.ADMIN_EMAIL}>`,
              to: draw.giver.email!,
              subject: `🎯 ${lottery.name} - Votre mission de Noël !`,
              html: EMAIL_TEMPLATES.drawResult(
                draw.giver.name,
                draw.receiver.name,
                giftIdeasHtml,
                lottery.name,
                draw.giver.email || undefined
              )
            })

            console.log(`   ✅ Résultat envoyé à ${draw.giver.name}`)
            return { success: true, draw }
          } catch (error) {
            console.error(`   ❌ Erreur pour ${draw.giver.name}:`, error)
            return {
              success: false,
              draw,
              error: error instanceof Error ? error.message : 'Erreur inconnue'
            }
          }
        })

        const batchResults = await Promise.allSettled(emailPromises)

        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            if (result.value.success) {
              results.sent++
            } else {
              results.errors.push(`${result.value.draw.giver.name} (${result.value.draw.giver.email}): ${result.value.error}`)
            }
          } else {
            const draw = batch[index]
            results.errors.push(`${draw.giver.name} (${draw.giver.email}): ${result.reason}`)
          }
        })

        if (i + batchSize < emailsToSend.length) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      console.log(`📊 Résultats: ${results.sent} envoyés, ${results.errors.length} erreurs`)

      return {
        sent: results.sent,
        errors: results.errors,
        success: results.errors.length === 0
      }
    } catch (error) {
      console.error('❌ Erreur générale lors de l\'envoi des résultats:', error)
      return {
        sent: 0,
        errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
        success: false
      }
    }
  }

  private generateGiftIdeasHtml(giftIdeas: any[]): string {
    if (!giftIdeas || giftIdeas.length === 0) {
      return `
        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0; font-size: 18px;">🤔 Aucune idée cadeau renseignée</h3>
          <p style="color: #856404; margin: 10px 0; line-height: 1.6;">
            Cette personne n'a pas encore ajouté d'idées cadeaux. Vous pouvez :
          </p>
          <ul style="color: #856404; line-height: 1.6; margin: 10px 0; padding-left: 20px;">
            <li>Demander discrètement à des proches</li>
            <li>Observer ses centres d'intérêt</li>
            <li>Opter pour un cadeau universel et sûr</li>
            <li>Le soûler jusqu'à ce qu'il renseigne ses idées de cadeaux</li>
          </ul>
        </div>
      `
    }

    const ideasHtml = giftIdeas.map(idea => `
      <div style="border-bottom: 1px solid #dee2e6; padding: 15px 0; last-child:border-bottom: none;">
        <h4 style="color: #c41e3a; margin: 0 0 8px 0; font-size: 16px;">
          🎁 ${idea.title}
        </h4>
        ${idea.description ? `
          <p style="color: #666; margin: 8px 0; line-height: 1.5; font-style: italic;">
            ${idea.description}
          </p>
        ` : ''}
        ${idea.link ? `
          <p style="margin: 8px 0 0 0;">
            <a href="${idea.link}" target="_blank" style="color: #007bff; text-decoration: none; font-weight: 500;">
              🔗 Voir le lien
            </a>
          </p>
        ` : ''}
      </div>
    `).join('')

    return `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #28a745;">
        <h3 style="color: #28a745; margin-top: 0; font-size: 18px;">
          🎁 Ses idées cadeaux (${giftIdeas.length}) :
        </h3>
        <div style="background: white; padding: 15px; border-radius: 8px;">
          ${ideasHtml}
        </div>
      </div>
    `
  }
}

export const emailService = new EmailService()
