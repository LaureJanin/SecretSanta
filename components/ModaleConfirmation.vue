<template>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h4>Confirmation du tirage</h4>
        <p><strong>Participants :</strong></p>
        <ul>
          <li v-for="(participant, index) in participants" :key="index">
            {{ participant.name }} - {{ participant.email }}
          </li>
        </ul>
        <div v-if="exclusions.length > 0">
            <p><strong>Exclusions :</strong></p>
            <ul>
                <li v-for="(exclusion, index) in exclusions" :key="index">
                    {{ exclusion.participant }} ne peut pas tirer 
                    <ul>
              <!-- Itérer sur les exclusions spécifiques à chaque participant -->
                        <li v-for="(excl, i) in exclusion.exclusions" :key="i">
                            - {{ excl }}
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="buttons">
          <button @click="cancelSubmission">Annuler</button>
          <button @click="confirmSubmission">Confirmer</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  // Props passées par le parent
  const props = defineProps({
    participants: {
      type: Array,
      required: true
    },
    exclusions: {
      type: Array,
      required: true
    },
    showModal: {
      type: Boolean,
      required: true
    }
  });
  
  // Emit pour informer le parent de la confirmation ou de l'annulation
  const emit = defineEmits(['confirm', 'cancel']);
  
  const confirmSubmission = () => {
    emit('confirm');
  };
  
  const cancelSubmission = () => {
    emit('cancel');
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }
  
  .modal {
    background-color:blanchedalmond;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    text-align: center;
    max-height: 80vh;
    overflow-y: auto;  
  }
  
  .modal h3 {
    margin-bottom: 20px;
  }
  
  .modal ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  .buttons {
    display: flex;
    justify-content: space-between;
  }

  p, li {
    color: black;
    font-size: medium;
  }

  h4 {
    text-shadow: none; 
  }
  </style>
  