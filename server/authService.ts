import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { dbService } from './database.js'
import type { AuthResult, User } from './types.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export class AuthService {
  // Enregistrement d'un nouvel utilisateur
  async register(email: string, name: string, password: string): Promise<AuthResult> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await dbService.getUserByEmail(email)
      if (existingUser) {
        return {
          success: false,
          user: null,
          token: null,
          error: 'Un utilisateur avec cet email existe déjà'
        }
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12)

      // Créer l'utilisateur
      const user = await dbService.createUser(email, name, hashedPassword)

      // Générer le token JWT
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

  // Connexion d'un utilisateur
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Récupérer l'utilisateur
      const user = await dbService.getUserByEmail(email)
      if (!user) {
        return {
          success: false,
          user: null,
          token: null,
          error: 'Email ou mot de passe incorrect'
        }
      }

      // Vérifier le mot de passe
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

      // Générer le token JWT
      const token = this.generateToken(user.id)

      // Retourner sans le mot de passe
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

  // Générer un token JWT
  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )
  }

  // Vérifier et décoder un token JWT
  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
      return decoded
    } catch (error) {
      console.error('❌ Token invalide:', error)
      return null
    }
  }

  // Récupérer l'utilisateur à partir du token
  async getUserFromToken(token: string): Promise<User | null> {
    try {
      const decoded = await this.verifyToken(token)
      if (!decoded) return null

      const user = await dbService.getUserById(decoded.userId)
      if (!user) return null

      // Retourner sans le mot de passe
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword as User

    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error)
      return null
    }
  }

  // Extraire le token de l'en-tête Authorization
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null

    return parts[1]
  }
}

export const authService = new AuthService()
