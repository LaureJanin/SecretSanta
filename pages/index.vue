<template>
    <div id="home">
        <div>
            🎅 OH OH OH 🎄 C'est bientôt Noël !
            <br>
            Est ce que tu as déjà écrit ta liste au père Noël ?
            <br>
            Est ce que tu as été bien sage ?
            <br>
            Vraiment ?
            <br>
            Mouais... Bon. Admettons
        </div>

        <h1>Super Loterie de Noël</h1>

        <div class="lottery-container">
            <div class="lottery-wheel">
                <div class="lottery-item" v-for="item in repeatedItems" :key="item">
                🎁 {{ item }}
                </div>
            </div>
        </div>

        <router-link to="/form">
            <button>Commencer</button>
        </router-link>
    </div>
</template>

<script setup>
const items = ["Un Jouet en plastique", "Des puces de lit", "Un iPad inutile", "Une 'Surprise'", "Une Étoile de mer", "Un truc gnangnan et rose à paillettes", "Des chaussettes moches",  "Un Secret de famille", ];
const repeatedItems = [...items, ...items];
</script>

<style scoped>
/* Conteneur de l'animation */
.lottery-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 50px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 80%;
  margin: 1rem auto;
}

/* Roue de la loterie */
.lottery-wheel {
  display: flex;
  flex-direction: column;
  animation: scroll 8s linear infinite;
  text-align: center;
}

/* Éléments de la loterie */
.lottery-item {
  font-size: 20px;
  font-weight: bold;
  color: #d2232a;
  line-height: 50px;
}

/* Animation cyclique */
@keyframes scroll {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
