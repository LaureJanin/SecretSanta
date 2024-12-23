import { sendEmail } from './sendEmail';

exports.handler = async function(event, context) {
  // Parsing du corps de la requête
  const body = JSON.parse(event.body);

  const { participants, exclusions } = body;

  // Vérifier les données reçues
  if (!participants || participants.length < 2) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Au moins 2 participants sont requis." })
    };
  }

  if (!exclusions || !Array.isArray(exclusions)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Les exclusions doivent être valides." })
    };
  }

  // Fonction pour vérifier la validité d'un tirage
  const isValidDraw = (giver, receiver, exclusions) => {
    if (giver === receiver) return false;
    const rule = exclusions.find((rule) => rule.participant === giver);
    return !rule || !rule.exclusions.includes(receiver);
  };

  // Fonction asynchrone pour gérer le tirage
  const drawParticipants = async (participants, exclusions) => {
    const givers = [...participants.map((p) => p.name)];
    const receivers = [...participants.map((p) => p.name)];
    const results = [];

    while (givers.length > 0) {
      const giver = givers.pop();
      const validReceivers = receivers.filter((r) => isValidDraw(giver, r, exclusions));

      // Vérifiez si on a trouvé des récipiendaires valides
      if (validReceivers.length === 0) {
        console.warn(`Aucun récipiendaire valide trouvé pour ${giver}. Tirage ignoré pour ce participant.`);
        continue;
      }

      // Choisir un récepteur valide au hasard
      const receiver = validReceivers[Math.floor(Math.random() * validReceivers.length)];
      receivers.splice(receivers.indexOf(receiver), 1);

      results.push({ giver, receiver });

      // Envoi de l'email
      const giverEmail = participants.find((p) => p.name === giver).email;
      try {
        await sendEmail(giver, receiver, giverEmail);
        console.log(`Email envoyé à ${giver}`);
      } catch (error) {
        console.error(`Erreur d'envoi de l'email à ${giver}:`, error);
      }
    }

    return results;
  };

  // Essayez de faire le tirage
  try {
    const results = await drawParticipants(participants, exclusions);

    // Vérification si des résultats ont été générés
    if (results.length > 0) {
      console.log("Tirage réussi:", results);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Ok petit lutin" })
      };
    } else {
      console.log("Aucun résultat de tirage valide trouvé.");
      return {
        statusCode: 200,
        body: JSON.stringify({ results: [] })
      };
    }
  } catch (error) {
    console.error("Erreur lors du tirage ou de l'envoi des emails:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Une erreur est survenue lors du tirage.' })
    };
  }
};
