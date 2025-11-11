import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { dbService } from './database.js'
import type { AuthResult, User } from './types.js'
import { validateEmail } from '../utils/email.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export class AuthService {
  async register(email: string, name: string, password: string): Promise<AuthResult> {
    try {
      if (!validateEmail(email)) {
        return {
          success: false,
          user: null,
          token: null,
          error: 'Format d\'email invalide'
        }
      }

      const existingUser = await dbService.getUserByEmail(email)
      if (existingUser) {
        return {
          success: false,
          user: null,
          token: null,
          error: 'Un utilisateur avec cet email existe déjà'
        }
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = await dbService.createUser(email, name, hashedPassword)
      const token = this.generateToken(user.id)

      return {
        success: true,
        user,
        token,
        error: null
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement:', error)
      return {
        success: false,
        user: null,
        token: null,
        error: 'Erreur lors de la création du compte'
      }
    }
  }

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      if (!validateEmail(email)) {
        return {
          success: false,
          user: null,
          token: null,
          error: 'Format d\'email invalide'
        }
      }

      const user = await dbService.getUserByEmail(email)
      if (!user) {
        return {
          success: false,
          user: null,
          token: null,
          error: 'Email ou mot de passe incorrect'
        }
      }

      if (!user.password) {
        return {
          success: false,
          user: null,
          token: null,
          error: 'Compte configuré sans mot de passe'
        }
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return {
          success: false,
          user: null,
          token: null,
          error: 'Email ou mot de passe incorrect'
        }
      }

      const token = this.generateToken(user.id)
      const { password: _, ...userWithoutPassword } = user

      return {
        success: true,
        user: userWithoutPassword as User,
        token,
        error: null
      }

    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error)
      return {
        success: false,
        user: null,
        token: null,
        error: 'Erreur lors de la connexion'
      }
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )
  }

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
      return decoded
    } catch (error) {
      return null
    }
  }

  async getUserFromToken(token: string): Promise<User | null> {
    try {
      const decoded = await this.verifyToken(token)
      if (!decoded) return null

      const user = await dbService.getUserById(decoded.userId)
      if (!user) return null

      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword as User

    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error)
      return null
    }
  }

  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null

    return parts[1]
  }
}

export const authService = new AuthService()
