import fs from 'fs';
import path from 'path';
import Mailjet from 'node-mailjet';

const mailjetClient = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
);
const sendEmail = async (giver, receiver, giverEmail) => {
  try {
    const templatePath = path.resolve("templates", "emailTemplate.html");
    let emailTemplate = fs.readFileSync(templatePath, "utf-8");
    emailTemplate = emailTemplate.replace("{{giver}}", giver).replace("{{receiver}}", receiver);
    const request = mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "janinlaure1@gmail.com",
            Name: "Loterie de No\xEBl"
          },
          To: [
            {
              Email: giverEmail
            }
          ],
          Subject: `Secret Santa`,
          HTMLPart: emailTemplate
        }
      ]
    });
    const response = await request;
    console.log(`Email envoy\xE9 \xE0 ${giver}:`, response.body);
    return response.body;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};

export { sendEmail };
//# sourceMappingURL=sendEmail.mjs.map
