import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { sendEmail } from './sendEmail.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'fs';
import 'path';
import 'node-mailjet';

const draw = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { participants, exclusions } = body;
  if (!participants || participants.length < 2) {
    throw createError({ statusCode: 400, message: "Au moins 2 participants sont requis." });
  }
  if (!exclusions || !Array.isArray(exclusions)) {
    throw createError({ statusCode: 400, message: "Les exclusions doivent \xEAtre un tableau valide." });
  }
  const isValidDraw = (giver, receiver, exclusions2) => {
    if (giver === receiver) return false;
    const rule = exclusions2.find((rule2) => rule2.participant === giver);
    return !rule || !rule.exclusions.includes(receiver);
  };
  const drawParticipants = async (participants2, exclusions2) => {
    const givers = [...participants2.map((p) => p.name)];
    const receivers = [...participants2.map((p) => p.name)];
    const results = [];
    while (givers.length > 0) {
      const giver = givers.pop();
      const validReceivers = receivers.filter((r) => isValidDraw(giver, r, exclusions2));
      if (validReceivers.length === 0) {
        console.warn(`Aucun r\xE9cipiendaire valide trouv\xE9 pour ${giver}. Tirage ignor\xE9 pour ce participant.`);
        continue;
      }
      const receiver = validReceivers[Math.floor(Math.random() * validReceivers.length)];
      receivers.splice(receivers.indexOf(receiver), 1);
      results.push({ giver, receiver });
      const giverEmail = participants2.find((p) => p.name === giver).email;
      try {
        await sendEmail(giver, receiver, giverEmail);
        console.log(`Email envoy\xE9 \xE0 ${giver}`);
      } catch (error) {
        console.error(`Erreur d'envoi de l'email \xE0 ${giver}:`, error);
      }
    }
    return results;
  };
  try {
    const results = await drawParticipants(participants, exclusions);
    if (results.length > 0) {
      console.log("Tirage r\xE9ussi:", results);
      return { results };
    } else {
      console.log("Aucun r\xE9sultat de tirage valide trouv\xE9.");
      return { results: [] };
    }
  } catch (error) {
    console.error("Erreur lors du tirage ou de l'envoi des emails:", error);
    throw createError({ statusCode: 500, message: "Une erreur est survenue lors du tirage." });
  }
});

export { draw as default };
//# sourceMappingURL=draw.mjs.map
