import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// État global réactif pour l'authentification
const authState = ref<boolean>(false)

// Initialiser l'état au chargement
if (process.client) {
  authState.value = !!localStorage.getItem('token')
}

export const useAuth = () => {
  const router = useRouter()

  // Computed qui utilise le ref réactif
  const isAuthenticated = computed(() => authState.value)

  const getToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem('token')
    }
    return null
  }

  const getUserId = (): string | null => {
    if (process.client) {
      return localStorage.getItem('userId')
    }
    return null
  }

  const getUserEmail = (): string | null => {
    if (process.client) {
      return localStorage.getItem('userEmail')
    }
    return null
  }

  const requireAuth = (redirectTo: string = '/login') => {
    onMounted(() => {
      if (process.client) {
        const token = getToken()
        if (!token) {
          router.push(redirectTo)
        }
      }
    })
  }

  const setAuthData = (token: string, userId?: string, userEmail?: string) => {
    if (process.client) {
      localStorage.setItem('token', token)
      if (userId) {
        localStorage.setItem('userId', userId)
      }
      if (userEmail) {
        localStorage.setItem('userEmail', userEmail)
      }
      // Mettre à jour l'état réactif - cela déclenchera automatiquement la réactivité
      authState.value = true
    }
  }

  const logout = () => {
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
      // Mettre à jour l'état réactif
      authState.value = false
      router.push('/')
    }
  }

  return {
    isAuthenticated,
    getToken,
    getUserId,
    getUserEmail,
    setAuthData,
    requireAuth,
    logout
  }
}

