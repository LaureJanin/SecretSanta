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

    <h3>Et toi que vas-tu offrir ?</h3>
    <p>Pour répondre à ces questions, clique 👇.</p>

    <div class="action-buttons">
      <NuxtLink to="/signup">
        <button class="btn-signup">Créer un compte</button>
      </NuxtLink>
      <NuxtLink to="/login">
        <button class="btn-login">Se connecter</button>
      </NuxtLink>
    </div>
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
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-md) var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  text-align: center;
  max-width: var(--max-width-sm);
  width: 100%;
}

.emoji {
  display: block;
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-sm);
}

.lottery-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 50px;
  background: transparent;
  max-width: var(--max-width-sm);
  width: 100%;
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.lottery-wheel {
  display: flex;
  flex-direction: column;
  animation: scroll 12s linear infinite;
  text-align: center;
}

.lottery-item {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
  line-height: 50px;
}

.red {
  color: var(--color-accent);
  font-weight: var(--font-weight-bold);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
  flex-wrap: wrap;
  justify-content: center;
}

.action-buttons button {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  border: none;
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  min-width: 180px;
}

.btn-signup {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-text-inverse);
}

.btn-signup:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-button-hover);
}

.btn-login {
  background: linear-gradient(135deg, var(--color-secondary), #ffa500);
  color: var(--color-text-inverse);
}

.btn-login:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(255, 159, 26, 0.3);
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

@media (max-width: 768px) {
  .home-page {
    padding-top: 2vh;
    padding-left: var(--spacing-sm);
    padding-right: var(--spacing-sm);
    box-sizing: border-box;
  }
  .home-intro {
    padding: var(--spacing-md);
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }
  .lottery-container {
    width: 98vw;
    max-width: 98vw;
  }
  .action-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    gap: var(--spacing-md);
    align-items: center;
  }
  .action-buttons button {
    width: auto;
    min-width: auto;
    padding: var(--spacing-md) var(--spacing-lg);
  }
}
</style>
