import fs from 'fs';
import path from 'path';
import Mailjet from 'node-mailjet';

// Initialisation de Mailjet avec les clés API
const mailjetClient = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_API_SECRET
  );

// Fonction pour envoyer un email à un participant
export const sendEmail = async (giver, receiver, giverEmail) => {
  try {
    // Charger le template HTML
    const templatePath = path.resolve('templates', 'emailTemplate.html');
    let emailTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Remplacer les placeholders par les données dynamiques
    emailTemplate = emailTemplate.replace('{{giver}}', giver)
                                 .replace('{{receiver}}', receiver);

    const request = mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'janinlaure1@gmail.com',
            Name: 'Loterie de Noël',
          },
          To: [
            {
              Email: giverEmail,
            },
          ],
          Subject: `Secret Santa`,
          HTMLPart: emailTemplate,
        },
      ],
    });

    const response = await request;
    console.log(`Email envoyé à ${giver}:`, response.body);
    return response.body;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};