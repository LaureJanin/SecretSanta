<template>
  <div id="app">
    <div class="snowflakes" v-if="isClient">
      <div
        class="snowflake"
        v-for="n in 100"
        :key="n"
        :style="generateFlakeStyle()"
      ></div>
    </div>

    <header class="main-header">
      <div class="header-left">
        <NuxtLink to="/" class="header-logo-link">
          <img src="/lotterie-noel.png" alt="Logo Loterie de Noël" class="header-logo" />
        </NuxtLink>
        <h1 class="header-title">Loterie de Noël</h1>
      </div>
      <nav class="header-nav">
        <template v-if="isLoggedIn">
          <NuxtLink to="/mes-loteries">Mes loteries</NuxtLink>
          <NuxtLink to="/gift-ideas">Mes idées cadeaux</NuxtLink>
          <NuxtLink to="/admin">Admin</NuxtLink>
          <button @click="logout" class="btn-logout">Déconnexion</button>
        </template>
        <template v-else>
          <NuxtLink to="/login">Connexion</NuxtLink>
          <NuxtLink to="/signup">Inscription</NuxtLink>
        </template>
      </nav>
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer class="main-footer">
      © Loterie de Noël - Tous droits fortement peu réservés
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isClient = ref(false);
const isLoggedIn = ref(false);
const router = useRouter();

onMounted(() => {
  isClient.value = true;
  checkAuth();
});

const checkAuth = () => {
  if (process.client) {
    isLoggedIn.value = !!localStorage.getItem('token');
  }
};

const logout = () => {
  if (process.client) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    isLoggedIn.value = false;
    router.push('/');
  }
};

// Surveiller les changements de route pour mettre à jour l'état de connexion
if (process.client) {
  router.afterEach(() => {
    checkAuth();
  });
}

const generateFlakeStyle = () => {
  const size = Math.random() * 8 + 4;
  const left = Math.random() * 100;
  const duration = Math.random() * 5 + 5;
  const delay = Math.random() * -5;

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  };
};
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: none;
}

.main-header {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: transparent;
  border-bottom: none;
  box-shadow: none;
  padding: 0.5rem 2rem;
  z-index: 30;
  position: relative;
  gap: 0;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.header-logo-link {
  display: flex;
  align-items: center;
}
.header-logo {
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: transform 0.15s;
}
.header-logo-link:hover .header-logo {
  transform: scale(1.08) rotate(-8deg);
}
.header-title {
  font-family: 'Pacifico', cursive, Arial, sans-serif;
  color: #d2232a;
  font-size: 2rem;
  margin: 0;
  text-align: left;
  text-shadow: 2px 2px 4px #fff3;
}
.header-nav {
  display: flex;
  gap: 1.5rem;
  margin-left: 1rem;
  align-items: center;
}
.header-nav a {
  color: #d2232a;
  font-weight: bold;
  font-size: 1.1rem;
  text-decoration: none;
  transition: color 0.2s;
}
.header-nav a:hover {
  color: #ff9f1a;
  text-decoration: underline;
}

.btn-logout {
  background: transparent;
  color: #d2232a;
  border: 2px solid #d2232a;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #d2232a;
  color: white;
  transform: none;
  box-shadow: none;
}

main {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0;
}

.main-footer {
  background: transparent;
  color: #333;
  font-size: 14px;
  text-align: center;
  margin-top: 2vh;
}

@media (max-width: 700px) {
  .main-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.7rem 0.5rem;
  }
  .header-left {
    gap: 0.7rem;
  }
  .header-title {
    font-size: 1.3rem;
    margin: 0.5rem 0 0.5rem 0;
    text-align: left;
  }
  .header-nav {
    gap: 0.7rem;
    font-size: 1rem;
    flex-wrap: wrap;
    margin-left: 0;
    justify-content: flex-start;
  }
}
</style>
