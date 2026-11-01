<template>
  <div class="home-page">
    <div class="home-intro">
      <h2><span class="emoji">🎅</span> OH OH OH 🎄 C'est bientôt Noël !</h2>
      <p>Tu aimes <span class="red">RECEVOIR</span> des cadeaux ? Et en <span class="red">FAIRE</span> ?</p>
      <p>As-tu été bien sage ? Vraiment ? Mouais... Bon... Admettons.</p>
    </div>

    <p v-if="daysLeft !== null" class="countdown">{{ countdownText }}</p>

    <h3>As-tu déjà fait ta liste pour Santa ?</h3>

    <div class="lottery-container">
      <div class="lottery-wheel">
        <p class="lottery-item" v-for="item in repeatedItems" :key="item">
          🎁 {{ item }}
        </p>
      </div>
    </div>

    <h3>Et toi, que vas-tu offrir ? 👇</h3>

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

// Décompte avant Noël (calculé côté navigateur uniquement)
const daysLeft = ref(null);
onMounted(() => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let noel = new Date(now.getFullYear(), 11, 25);
  if (today > noel) noel = new Date(now.getFullYear() + 1, 11, 25);
  daysLeft.value = Math.round((noel - today) / 86400000);
});
const countdownText = computed(() => {
  if (daysLeft.value === 0) return "C'est Noël aujourd'hui ! 🎅";
  if (daysLeft.value === 1) return "Plus qu'un dodo avant Noël ! 🌙";
  return `Plus que ${daysLeft.value} jours avant Noël ! 🎄`;
});
</script>

<style scoped>
.home-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 1vh;
}

.home-intro {
  background: rgba(255, 255, 255, 0.85);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-md) var(--spacing-xl);
  margin-bottom: var(--spacing-md);
  text-align: center;
  max-width: var(--max-width-md);
  width: 100%;
}

.home-intro h2 {
  font-family: var(--font-family-title);
  font-weight: var(--font-weight-normal);
  font-size: 1.7rem;
  color: var(--color-accent);
}

.home-intro p {
  margin: var(--spacing-xs) 0;
}

.countdown {
  background: var(--color-accent);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-bold);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-badge);
  box-shadow: var(--shadow-md);
  animation: heartbeat 1.6s ease-in-out infinite;
  margin: 0 0 var(--spacing-sm);
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

.emoji {
  display: inline-block;
  animation: wiggle 2s ease-in-out infinite;
  transform-origin: bottom center;
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
  margin-top: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.lottery-wheel {
  display: flex;
  flex-direction: column;
  animation: scroll 18s linear infinite;
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
  margin-top: var(--spacing-md);
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
    padding: var(--spacing-sm) var(--spacing-md);
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }
  .lottery-container {
    width: 98vw;
    max-width: 98vw;
  }
  .home-intro h2 {
    font-size: 1.3rem;
  }
  .action-buttons {
    width: 100%;
    max-width: 100%;
    gap: var(--spacing-sm);
    align-items: center;
  }
  .action-buttons button {
    width: auto;
    min-width: auto;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-base);
  }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}
</style>
