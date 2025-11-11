import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()

  const isAuthenticated = computed(() => {
    if (process.client) {
      return !!localStorage.getItem('token')
    }
    return false
  })

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
    }
  }

  const logout = () => {
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
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

