<template>
  <div class="home-page">
    <div class="home-intro">
      <span class="emoji">🎅</span>
      <h2>OH OH OH 🎄 C'est bientôt Noël !</h2>
      <p>Est-ce que tu aimes <span class="red">RECEVOIR</span> des cadeaux ?</p>
      <p>Est-ce que tu aimes <span class="red">FAIRE</span> des cadeaux ?</p>
      <p> Est-ce que tu as été bien sage ?</p>
      <p>Vraiment ?</p>
      <p>Mouais... Bon... Admettons.</p>
    </div>

    <h3>As-tu déjà fait ta liste pour Santa ?</h3>

    <div class="lottery-container">
      <div class="lottery-wheel">
        <p class="lottery-item" v-for="item in repeatedItems" :key="item">
          🎁 {{ item }}
        </p>
      </div>
    </div>

    <h3>Et toi que vas-tu offir ?</h3>
    <p>Pour répondre à ces questions, clique 👇.</p>

    <NuxtLink to="/login">
      <button>Commencer</button>
    </NuxtLink>
  </div>
</template>

<script setup>
const items = [
  'Un Jouet en plastique',
  'Des puces de lit',
  'Une Étoile de mer',
  'Un truc gnangnan et rose à paillettes',
  'Des chaussettes moches',
  'Un Secret malaisant',
  'Un plein d\'essence',
  'Un abonnement à vie à MyLittlePoney.tv',
];
const repeatedItems = [...items, ...items];
</script>

<style scoped>
.home-page {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 4vh;
}
.home-intro {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 1.2rem 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
}
.emoji {
  font-size: 2.2rem;
  display: block;
  font-size: 3rem;
  margin-bottom: 0.5rem;
}
.lottery-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 50px;
  background: transparent;
  max-width: 500px;
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.lottery-wheel {
  display: flex;
  flex-direction: column;
  animation: scroll 12s linear infinite;
  text-align: center;
}
.lottery-item {
  font-size: 20px;
  font-weight: bold;
  color: #d2232a;
  line-height: 50px;
}
.red {
  color: #d2232a;
  font-weight: bold;
}
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
@media (max-width: 600px) {
  .home-intro {
    padding: 1rem 0.5rem;
    max-width: 95vw;
    width: 100%;
  }
  .lottery-container {
    width: 98vw;
    max-width: 98vw;
  }
}
</style>
