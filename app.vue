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
      <button 
        class="burger-menu" 
        :class="{ 'menu-open': menuOpen }"
        @click="toggleMenu"
        :aria-expanded="menuOpen"
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div 
        v-if="menuOpen" 
        class="menu-overlay" 
        @click="closeMenu"
      ></div>
      <nav class="header-nav" :class="{ 'menu-open': menuOpen }">
        <template v-if="isLoggedIn">
          <NuxtLink to="/my-loteries" @click="closeMenu">Mes loteries</NuxtLink>
          <NuxtLink to="/gift-ideas" @click="closeMenu">Mes idées cadeaux</NuxtLink>
          <NuxtLink to="/admin" @click="closeMenu">Admin</NuxtLink>
          <button @click="logout" class="btn-logout">Déconnexion</button>
        </template>
        <template v-else>
          <NuxtLink to="/login" @click="closeMenu">Connexion</NuxtLink>
          <NuxtLink to="/signup" @click="closeMenu">Inscription</NuxtLink>
        </template>
      </nav>
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer class="main-footer">
      © Loterie de Noël - Tous droits fortement peu réservés
    </footer>

    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const isClient = ref(false);
const menuOpen = ref(false);
const router = useRouter();
const { isAuthenticated, logout: authLogout } = useAuth();

const isLoggedIn = isAuthenticated;

onMounted(() => {
  isClient.value = true;
});

const logout = () => {
  authLogout();
  menuOpen.value = false;
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

if (process.client) {
  router.afterEach(() => {
    closeMenu();
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
  justify-content: space-between;
  background: transparent;
  border-bottom: none;
  box-shadow: none;
  padding: var(--spacing-sm) var(--spacing-xl);
  z-index: var(--z-index-header);
  position: relative;
  gap: var(--spacing-md);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
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
  animation: logoFloat 3s ease-in-out infinite;
}
.header-logo-link:hover .header-logo {
  transform: scale(1.08) rotate(-8deg);
  animation: logoHover 0.5s ease-in-out;
}
.header-title {
  font-family: var(--font-family-title);
  color: var(--color-accent);
  font-size: var(--font-size-3xl);
  margin: 0;
  text-align: left;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.2);
}
.burger-menu {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  z-index: calc(var(--z-index-header) + 1);
  align-items: center;
  justify-content: center;
}

.burger-menu span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--color-accent);
  border-radius: 3px;
  transition: all var(--transition-base);
  transform-origin: center;
}

.burger-menu:hover span {
  background-color: var(--color-secondary);
}

.header-nav {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}

.header-nav a {
  color: var(--color-accent);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  text-decoration: none;
  transition: color var(--transition-base);
}

.header-nav a:hover {
  color: var(--color-secondary);
  text-decoration: underline;
}

.btn-logout {
  background: transparent;
  color: var(--color-accent);
  border: var(--border-width) solid var(--color-accent);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-logout:hover {
  background: var(--color-accent);
  color: var(--color-text-inverse);
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
  color: var(--color-text);
  font-size: var(--font-size-sm);
  text-align: center;
  margin-top: 2vh;
  padding: var(--spacing-md);
}

@media (max-width: 768px) {
  .main-header {
    flex-wrap: nowrap;
    padding: var(--spacing-md) var(--spacing-sm);
    position: relative;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }

  .header-left {
    justify-content: center;
    flex: 1;
    order: 1;
  }

  .header-title {
    font-size: var(--font-size-xl);
    margin: 0;
    text-align: center;
  }

  .burger-menu {
    display: flex;
    order: 2;
    flex-shrink: 0;
    margin-right: var(--spacing-sm);
  }


  .header-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-left: var(--spacing-sm);
    margin-right: var(--spacing-sm);
    background: var(--color-bg);
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: var(--spacing-md);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-md);
    z-index: calc(var(--z-index-header) - 1);
    order: 3;
    box-sizing: border-box;
  }

  .header-nav.menu-open {
    display: flex;
  }

  .header-nav a {
    padding: var(--spacing-md);
    font-size: var(--font-size-base);
    border-bottom: 1px solid var(--border-color);
    text-align: center;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .header-nav a:last-child {
    border-bottom: none;
  }

  .header-nav .btn-logout {
    width: 100%;
    margin-top: var(--spacing-sm);
    text-align: center;
  }

  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: calc(var(--z-index-header) - 2);
    animation: fadeIn var(--transition-base);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .burger-menu.menu-open span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .burger-menu.menu-open span:nth-child(2) {
    opacity: 0;
  }

  .burger-menu.menu-open span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(5deg);
  }
}

@keyframes logoHover {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.15) rotate(-12deg);
  }
  100% {
    transform: scale(1.08) rotate(-8deg);
  }
}
</style>
