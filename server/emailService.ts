import type { EmailResult } from './types.js'
import { dbService } from './database.js'
import { avatarFor } from '../utils/avatar.js'

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

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const siteUrl = () => process.env.SITE_URL || 'http://localhost:3000'

// Guirlande en haut des emails (emojis : compatibles avec tous les clients mail)
const GARLAND = `<div style="text-align: center; font-size: 16px; letter-spacing: 6px; line-height: 1; padding: 10px 0; background: #fff;">🔴🟡🟢🔵🔴🟡🟢🔵🔴🟡🟢🔵</div>`

// Enveloppe commune : fond, guirlande, en-tête coloré, contenu, pied de page
const emailShell = (title: string, subtitle: string, content: string) => `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin: 0; padding: 20px 0; background-color: #ffe6b7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 18px; overflow: hidden; box-shadow: 0 6px 18px rgba(150, 40, 40, 0.2);">
      ${GARLAND}
      <div style="background: linear-gradient(135deg, #d2232a 0%, #1ca463 100%); padding: 28px 20px; text-align: center;">
        <div style="font-size: 44px; line-height: 1;">🎅</div>
        <h1 style="color: white; margin: 10px 0 0 0; font-size: 26px;">${escapeHtml(title)}</h1>
        <p style="color: #fff3cd; margin: 8px 0 0 0; font-size: 15px;">${escapeHtml(subtitle)}</p>
      </div>
      <div style="padding: 28px 20px;">
        ${content}
      </div>
      <div style="background: #fff8ec; padding: 18px 20px; text-align: center; border-top: 1px solid #f3dcb5;">
        <p style="margin: 0; color: #d2232a; font-size: 16px; font-weight: bold;">Joyeux Noël ! 🎄✨</p>
        <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">Ce message a été préparé par des lutins (très) consciencieux 🧝</p>
      </div>
      ${GARLAND}
    </div>
  </body>
  </html>
`

const EMAIL_TEMPLATES = {

  drawResult: (giverName: string, receiverName: string, giftIdeasHtml: string, lotteryName?: string, giverEmail?: string, budget?: number | null) => emailShell(
    '🥁 Roulements de tambour…',
    lotteryName || 'Loterie de Noël',
    `
      <p style="font-size: 18px; color: #333; margin: 0 0 16px 0;">
        Bonjour <strong style="color: #d2232a;">${escapeHtml(giverName)}</strong> ! 🎄
      </p>
      <p style="color: #666; line-height: 1.6; margin: 0 0 22px 0;">
        Les lutins ont mélangé tous les papiers, secoué le chapeau et… le tirage a parlé ! Voici ta mission secrète :
      </p>

      <div style="background: linear-gradient(135deg, #d2232a, #a81a20); padding: 26px 20px; border-radius: 16px; text-align: center; margin: 0 0 22px 0;">
        <h2 style="color: white; margin: 0 0 14px 0; font-size: 20px;">🎁 Tu offres un cadeau à…</h2>
        <div style="background: white; padding: 20px; border-radius: 12px;">
          <div style="font-size: 48px; line-height: 1;">${avatarFor(receiverName)}</div>
          <div style="font-size: 28px; font-weight: bold; color: #d2232a; margin-top: 8px;">${escapeHtml(receiverName)}</div>
        </div>
        <p style="color: #ffd9dc; margin: 14px 0 0 0; font-size: 14px;">🤫 Chut ! Même sous la torture (ou le chocolat chaud), tu ne dis rien.</p>
      </div>

      ${budget ? `
      <div style="background: #fff3cd; padding: 16px 20px; border-radius: 12px; margin: 0 0 22px 0; border-left: 5px solid #f5b942;">
        <p style="margin: 0; color: #856404; font-size: 16px;">
          💶 <strong>Budget : ${budget} € par cadeau</strong><br>
          <span style="font-size: 13px;">Le Père Noël garde un œil sur ton ticket de caisse 🧾</span>
        </p>
      </div>` : ''}

      ${giftIdeasHtml}

      <div style="background: linear-gradient(135deg, #1ca463, #28a745); padding: 24px 20px; border-radius: 14px; text-align: center; margin: 22px 0;">
        <h3 style="color: white; margin: 0 0 8px 0; font-size: 19px;">📱 Ton espace personnel</h3>
        <p style="color: #e8f5e8; margin: 0 0 18px 0; font-size: 14px;">
          Crée un compte pour retrouver ton destinataire à tout moment et ajouter tes propres idées cadeaux !
        </p>
        <a href="${siteUrl()}/signup"
           style="display: inline-block; background: white; color: #1ca463; padding: 14px 32px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">
          🎯 Créer mon compte
        </a>
        ${giverEmail ? `<p style="color: #e8f5e8; margin: 14px 0 0 0; font-size: 12px;">
          Utilise cette adresse email : <strong>${escapeHtml(giverEmail)}</strong>
        </p>` : ''}
      </div>

      <div style="background: #e7f3ff; padding: 18px 20px; border-radius: 12px; border-left: 5px solid #007bff;">
        <h3 style="color: #0056b3; margin: 0 0 8px 0; font-size: 17px;">🎯 Les conseils du Père Noël</h3>
        <ul style="color: #333; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>🤫 <strong>Secret absolu !</strong> Pas un mot, pas un regard suspect</li>
          <li>🎁 Soigne l'emballage, c'est 50 % du cadeau</li>
          <li>🧦 Évite les chaussettes… sauf si elles sont vraiment moches (donc géniales)</li>
        </ul>
      </div>
    `
  ),

  passwordReset: (name: string, link: string) => emailShell(
    'Mot de passe oublié ?',
    'Les lutins ont retrouvé la clé 🔑',
    `
      <p style="font-size: 18px; color: #333; margin: 0 0 16px 0;">
        Bonjour <strong style="color: #d2232a;">${escapeHtml(name)}</strong> !
      </p>
      <p style="color: #666; line-height: 1.6; margin: 0 0 22px 0;">
        Tu as demandé à changer ton mot de passe. Clique sur le bouton ci-dessous pour en choisir un nouveau.
        Le lien est valable <strong>1 heure</strong> et ne peut servir qu'une seule fois.
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${link}"
           style="display: inline-block; background: #d2232a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">
          🔑 Choisir un nouveau mot de passe
        </a>
      </div>
      <p style="color: #999; font-size: 13px; line-height: 1.5; margin: 0;">
        Ce n'est pas toi ? Ignore simplement cet email : ton mot de passe actuel reste valable. 🛡️
      </p>
    `
  )
}

export class EmailService {

  async sendPasswordReset(to: string, name: string, link: string): Promise<boolean> {
    const transporter = await createGmailTransporter()
    if (!transporter) return false

    try {
      await transporter.sendMail({
        from: `"Loterie de Noël" <${process.env.ADMIN_EMAIL}>`,
        to,
        subject: '🔑 Ton nouveau mot de passe - Loterie de Noël',
        html: EMAIL_TEMPLATES.passwordReset(name, link)
      })
      return true
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de réinitialisation:', error)
      return false
    }
  }

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
              subject: `🎅 ${lottery.name} - Roulements de tambour, ton destinataire est arrivé !`,
              html: EMAIL_TEMPLATES.drawResult(
                draw.giver.name,
                draw.receiver.name,
                giftIdeasHtml,
                lottery.name,
                draw.giver.email || undefined,
                lottery.budget
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
        <div style="background: #fff3cd; padding: 18px 20px; border-radius: 12px; margin: 0 0 22px 0; border-left: 5px solid #ffc107;">
          <h3 style="color: #856404; margin: 0 0 8px 0; font-size: 17px;">🤔 Aucune idée cadeau renseignée</h3>
          <p style="color: #856404; margin: 8px 0; line-height: 1.6;">
            Cette personne n'a pas encore ajouté d'idées cadeaux. Tu peux :
          </p>
          <ul style="color: #856404; line-height: 1.6; margin: 8px 0 0 0; padding-left: 20px;">
            <li>Demander discrètement à des proches</li>
            <li>Observer ses centres d'intérêt</li>
            <li>Opter pour un cadeau universel et sûr</li>
            <li>Le soûler jusqu'à ce qu'il renseigne ses idées de cadeaux</li>
          </ul>
        </div>
      `
    }

    const ideasHtml = giftIdeas.map(idea => `
      <div style="border-bottom: 1px solid #dee2e6; padding: 14px 0;">
        ${idea.imageUrl ? `<img src="${escapeHtml(idea.imageUrl)}" alt="" style="max-width: 140px; max-height: 140px; border-radius: 10px; margin-bottom: 8px; display: block;">` : ''}
        <h4 style="color: #c41e3a; margin: 0 0 6px 0; font-size: 16px;">
          🎁 ${escapeHtml(idea.title)}${idea.price ? ` <span style="color: #856404; font-weight: normal; font-size: 14px;">(~${idea.price} €)</span>` : ''}
        </h4>
        ${idea.description ? `
          <p style="color: #666; margin: 6px 0; line-height: 1.5; font-style: italic;">
            ${escapeHtml(idea.description)}
          </p>
        ` : ''}
        ${idea.link ? `
          <p style="margin: 6px 0 0 0;">
            <a href="${escapeHtml(idea.link)}" target="_blank" style="color: #007bff; text-decoration: none; font-weight: 500;">
              🔗 Voir le lien
            </a>
          </p>
        ` : ''}
      </div>
    `).join('')

    return `
      <div style="background: #f8f9fa; padding: 18px 20px; border-radius: 12px; margin: 0 0 22px 0; border-left: 5px solid #28a745;">
        <h3 style="color: #28a745; margin: 0 0 12px 0; font-size: 17px;">
          🎁 Ses idées cadeaux (${giftIdeas.length}) :
        </h3>
        <div style="background: white; padding: 4px 14px; border-radius: 8px;">
          ${ideasHtml}
        </div>
      </div>
    `
  }
}

export const emailService = new EmailService()
