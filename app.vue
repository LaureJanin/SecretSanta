<template>
  <div id="app">
    <div class="snowflakes">
      <div
        class="snowflake"
        v-for="n in 100"
        :key="n"
        :style="generateFlakeStyle()"
      ></div>
    </div>

    <main>
      <NuxtPage />
    </main>
    
    <footer>
      © 2024 Loterie de Noël - Tous droits fortement peu réservés
    </footer>
  </div>
</template>

<script setup>
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
  background: #d2232a;
  color: white;
  padding-top: 20px;
  padding-bottom: 5px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  border-radius: 20px;
}
</style>
