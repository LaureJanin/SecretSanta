import { ref } from 'vue'

const isDark = ref(false)

export const useTheme = () => {
  // L'attribut data-theme est posé très tôt (script dans <head>) pour éviter un flash blanc
  const initTheme = () => {
    isDark.value = document.documentElement.dataset.theme === 'dark'
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  return { isDark, initTheme, toggleTheme }
}
