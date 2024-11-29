<template>
  <div id="exclusions">
    <h4>Ajouter des règles d'exclusion</h4>
    <div class="form"> 
      <!-- Sélectionnez une personne -->
      <select v-model="selectedParticipant">
        <option disabled value="">Choisissez un participant</option>
        <option v-for="p in participants" :key="p.name" :value="p.name">
          {{ p.name }}
        </option>
      </select>
      
      <!-- Liste des exclusions -->
      <div v-if="selectedParticipant">
        <h5>Exclusions pour : {{ selectedParticipant }}</h5>
        <div class="exclusion-list">
          <div class="exclusion-name" v-for="p in participants" :key="p.name">
            <label>
              <input
                type="checkbox"
                :value="p.name"
                v-model="selectedExclusions"
                :disabled="p.name === selectedParticipant"
              />
              {{ p.name }}
            </label>
          </div>
        </div>
        <button @click="addExclusions">Ajouter les exclusions</button>
      </div>
    </div>

    <!-- Affichage des règles existantes -->
    <div v-if="exclusionRules.length > 0" class="existing-rules">
      <h3>Liste des exclusions :</h3>
      <ul>
        <li v-for="(rule, index) in exclusionRules" :key="index">
          {{ rule.participant }} ne peut pas tirer :
          <span v-for="excluded in rule.exclusions" :key="excluded">{{ excluded }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

/* Propriétés passées par le parent */
const props = defineProps({
  participants: {
    type: Array,
    required: true,
  },
  exclusionRules: {
    type: Array,
    required: true,
  }
});

/* État local */
const selectedParticipant = ref('');
const selectedExclusions = ref([]);

/* Déclarez l'émetteur */
const emit = defineEmits(['addRule']);

/* Ajouter des exclusions */
const addExclusions = () => {
  if (selectedParticipant.value && selectedExclusions.value.length > 0) {
    const newRule = {
      participant: selectedParticipant.value,
      exclusions: [...selectedExclusions.value],
    };

    // Émettre la règle d'exclusion au parent
    emit('addRule', newRule);

    // Réinitialisez les sélections
    selectedParticipant.value = '';
    selectedExclusions.value = [];
  }
};
</script>

<style scoped>
#exclusions {
  border: 2px solid rgba(255, 255, 255, 0.3); 
  margin: 2rem;
  padding-bottom: 1rem;
  padding-top: 1rem;
  border-radius: 10px; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

select {
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  border: none;
}

label {
  color: bisque;
  font-family:fantasy;
  font-size: medium;
}

.exclusion-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 2rem;
}

.exclusion-name {
  height: 2rem;
}

.existing-rules {
  color: bisque;
  font-family:fantasy;
  font-size: medium;
}

.existing-rules ul {
  text-align: center;
  padding: 0;
}

li {
  list-style: none;
}
</style>

  