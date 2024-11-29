<template>
  <div>
    <form @submit.prevent="showConfirmationModal">
      <h4>Ajouter des participants</h4>
      <div class="form">
        <!-- Champ pour le prénom -->
        <input
          v-model="newParticipant.name"
          type="text"
          placeholder="Prénom du participant"
        />
        <!-- Champ pour l'email -->
        <input
          v-model="newParticipant.email"
          type="email"
          placeholder="Email du participant"
        />
        <button
          @click="addParticipant" 
          :disabled="!isFormValid">
          Ajouter
        </button>
      </div>

      <!-- Liste des participants -->
      <ul>
        <li v-for="(participant, index) in participants" :key="index">
          {{ participant.name }} - {{ participant.email }}
          <button class="buttonClose" @click="removeParticipant(index)">❌</button>
        </li>
      </ul>
      
      <!-- Composant pour les règles d'exclusion -->
      <ExclusionRule :participants="participants" :exclusionRules="exclusionRules" @addRule="addExclusion" />
  
      <button 
        class="buttonSubmit" 
        type="button" 
        @click="showConfirmationModal"
        :disabled="participants.length < 2">
        Go Go Go
      </button>
    </form>

    <!-- Modale de confirmation -->
    <ModalConfirmation
      :participants="participants"
      :exclusions="exclusionRules"
      :showModal="showModal"
      @confirm="confirmSubmission"
      @cancel="cancelSubmission"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ExclusionRule from './ExclusionRule.vue';
import ModalConfirmation from './ModaleConfirmation.vue';

/* Données des nouveaux participants */
const newParticipant = ref({
  name: '',
  email: ''
});
const participants = ref([]); 
const exclusions = ref([]);
const drawResults = ref([]);
const showModal = ref(false);
const exclusionRules = ref([]);

/* Validation pour l'email */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/* Vérifier si le formulaire est valide */
const isFormValid = computed(() => {
  return (
    newParticipant.value.name.trim() !== '' &&
    validateEmail(newParticipant.value.email)
  );
});

/* Ajouter un participant */
const addParticipant = () => {
  participants.value.push({
    name: newParticipant.value.name.trim(),
    email: newParticipant.value.email.trim(),
  });

  newParticipant.value.name = '';
  newParticipant.value.email = '';
};

const removeParticipant = (index) => {
  participants.value.splice(index, 1);
};

const addExclusion = (rule) => {
  exclusionRules.value.push(rule);
};



/* Affichage de la modale de confirmation */
const showConfirmationModal = () => {
  showModal.value = true;
};

const confirmSubmission = async () => {
  try {
    // Déterminer l'URL de l'API en fonction de l'environnement
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api/lottery/draw' // Local
      : 'https://christmaslottery.netlify.app/.netlify/functions/draw'; // Production

    // Appel à l'API
    const response = await $fetch(baseUrl, {
      method: 'POST',
      body: {
        participants: participants.value,
        exclusions: exclusions.value,
      },
    });

    // Stocker les résultats reçus
    drawResults.value = response.results; 

    // Réinitialiser les valeurs du formulaire
    participants.value = [];
    exclusionRules.value = [];

    showModal.value = false;
  } catch (error) {
    console.error('Erreur lors du tirage ou de la sauvegarde :', error);
    alert('Une erreur est survenue lors du tirage ou de la sauvegarde.');
  }
};

const cancelSubmission = () => {
  showModal.value = false;
};

</script>

<style scoped>
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap; 
}

@media (max-width: 768px) {
  .form {
    flex-direction: column; 
    align-items: center; 
  }
}

input {
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  border: none;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.buttonSubmit {
  margin-top: 1rem;
}

li {
  list-style: none;
  color: bisque;
  font-family:fantasy;
  font-size: medium;
}

.buttonClose {
  background-color: #ff9f1a; 
  padding: 2px 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 6px;
  transition: all 0.3s ease;
}
</style>
