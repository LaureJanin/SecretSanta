import type { EmailResult } from './types.js'
import { dbService } from './database.js'

// Configuration Gmail SMTP
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

// Templates HTML améliorés
const EMAIL_TEMPLATES = {
  loginCode: (participantName: string, lotteryName: string, lotteryYear: number, loginCode: string) => `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Votre code pour la ${lotteryName}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            🎄 ${lotteryName}
          </h1>
          <p style="color: #ffebee; margin: 10px 0 0 0; font-size: 16px;">Noël ${lotteryYear}</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
            Bonjour <strong style="color: #c41e3a;">${participantName}</strong> ! 🎅
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Félicitations ! Vous participez à notre loterie de Noël ${lotteryYear}. 
            Voici votre code de connexion personnel pour accéder à la plateforme :
          </p>
          
          <!-- Code Box -->
          <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 25px; border-radius: 15px; text-align: center; margin: 25px 0; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);">
            <h2 style="color: white; margin: 0 0 15px 0; font-size: 20px;">Votre code de connexion</h2>
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 0 auto; max-width: 200px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #28a745; font-family: 'Courier New', monospace;">
                ${loginCode}
              </span>
            </div>
          </div>
          
          <!-- Instructions -->
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0; font-size: 18px;">📋 Étapes suivantes :</h3>
            <ol style="color: #333; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
              <li>Connectez-vous sur le site avec votre code</li>
              <li>Ajoutez vos idées cadeaux (souhaits)</li>
              <li>Consultez les règles d'exclusion si nécessaire</li>
              <li>Attendez le tirage au sort ! 🎯</li>
            </ol>
          </div>
          
          <!-- Tips -->
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              💡 <strong>Astuce :</strong> Plus vous ajoutez d'idées cadeaux variées, plus il sera facile pour votre "Père Noël secret" de vous faire plaisir !
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            Ho ho ho ! Joyeux Noël ! 🎅🎄✨
          </p>
        </div>
      </div>
    </body>
    </html>
  `,

  drawResult: (giverName: string, receiverName: string, giftIdeasHtml: string) => `
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
          <p style="color: #e8f5e8; margin: 10px 0 0 0; font-size: 16px;">Le grand moment est arrivé !</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
            Bonjour <strong style="color: #28a745;">${giverName}</strong> ! 🎄
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Le tirage au sort a eu lieu ! Voici votre mission secrète pour Noël 2025 :
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
          
          <!-- Tips -->
          <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #007bff;">
            <h3 style="color: #0056b3; margin-top: 0; font-size: 18px;">🎯 Conseils de votre Père Noël :</h3>
            <ul style="color: #333; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
              <li>🤫 <strong>Secret absolu !</strong> N'en parlez à personne</li>
              <li>💰 Respectez le budget convenu</li>
              <li>🎁 Soignez l'emballage, c'est important !</li>
              <li>😊 Amusez-vous et faites plaisir !</li>
              <li>📱 Vous pouvez demander discrètement des précisions si besoin</li>
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
  // Test de Gmail SMTP
  async testGmailDirect(): Promise<EmailResult> {
    console.log('🔍 Test direct de Gmail SMTP...')

    try {
      const transporter = await createGmailTransporter()

      if (!transporter) {
        return {
          sent: 0,
          errors: ['Impossible de créer le transporteur Gmail. Vérifiez GMAIL_APP_PASSWORD'],
          success: false
        }
      }

      console.log('✅ Transporteur Gmail créé avec succès')

      // Test simple d'envoi
      const result = await transporter.sendMail({
        from: `"Loterie de Noël" <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: '🧪 Test Gmail SMTP - Loterie de Noël',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #f0f8ff;">
            <h1 style="color: #28a745;">✅ Test Gmail réussi !</h1>
            <p>Votre configuration Gmail SMTP fonctionne parfaitement.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString('fr-FR')}</p>
            <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p style="margin: 0; color: #2e7d32;">
                🎉 Votre service d'email pour la loterie de Noël est prêt !
              </p>
            </div>
          </div>
        `
      })

      console.log('📧 Résultat de l\'envoi Gmail:')
      console.log(`   Message ID: ${result.messageId}`)
      console.log(`   Statut: Envoyé avec succès`)

      return {
        sent: 1,
        errors: [],
        success: true
      }

    } catch (error) {
      console.error('❌ Erreur lors du test Gmail:', error)
      return {
        sent: 0,
        errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
        success: false
      }
    }
  }

  async sendLoginCodes(lotteryId: string): Promise<EmailResult> {
    try {
      const lottery = await dbService.getLotteryById(lotteryId)
      if (!lottery) throw new Error('Loterie non trouvée')

      console.log(`📧 Envoi des codes pour "${lottery.name}" (${lottery.year})`)
      const activeParticipants = lottery.participants?.filter(p =>
        p.isActive && p.email && p.loginCode
      ) || []

      if (activeParticipants.length === 0) {
        return {
          sent: 0,
          errors: ['Aucun participant actif avec email et code'],
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

      for (const participant of activeParticipants) {
        try {
          await gmailTransporter.sendMail({
            from: `"Loterie de Noël" <${process.env.ADMIN_EMAIL}>`,
            to: participant.email!,
            subject: `🎄 Votre code pour la ${lottery.name}`,
            html: EMAIL_TEMPLATES.loginCode(
              participant.name,
              lottery.name,
              lottery.year,
              participant.loginCode!
            )
          })

          console.log(`   ✅ Envoyé via Gmail à ${participant.name} (${participant.email})`)
          results.sent++
        } catch (error) {
          console.error(`   ❌ Erreur Gmail pour ${participant.name}:`, error)
          results.errors.push(`${participant.name} (${participant.email}): ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
        }
      }

      console.log(`📊 Résultats: ${results.sent} envoyés, ${results.errors.length} erreurs`)

      return {
        sent: results.sent,
        errors: results.errors,
        success: results.errors.length === 0
      }
    } catch (error) {
      console.error('❌ Erreur générale lors de l\'envoi des codes:', error)
      return {
        sent: 0,
        errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
        success: false
      }
    }
  }

  async sendDrawResults(lotteryId: string): Promise<EmailResult> {
    try {
      const draws = await dbService.getDrawsWithGiftIdeas(lotteryId)
      if (draws.length === 0) throw new Error('Aucun tirage trouvé')

      console.log(`🎯 Envoi des résultats du tirage (${draws.length} assignations)`)
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

      // Envoi par batch
      const batchSize = 10
      for (let i = 0; i < emailsToSend.length; i += batchSize) {
        const batch = emailsToSend.slice(i, i + batchSize)

        const emailPromises = batch.map(async (draw) => {
          const giftIdeasHtml = this.generateGiftIdeasHtml(draw.receiver?.giftIdeas || [])

          try {
            await gmailTransporter.sendMail({
              from: `"Loterie de Noël" <${process.env.ADMIN_EMAIL}>`,
              to: draw.giver.email!,
              subject: `🎯 Résultat du tirage - Votre mission de Noël !`,
              html: EMAIL_TEMPLATES.drawResult(
                draw.giver.name,
                draw.receiver.name,
                giftIdeasHtml
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

        // Pause entre les batches
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

  // Méthode utilitaire pour générer le HTML des idées cadeaux
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
