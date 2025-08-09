import { db } from '@/core/firebase'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import {
  CreateUserDto,
  UpdateUserDto,
  CustomClaimsDto,
  UserResponseDto,
  UpdateUserFavoritesDto,
  CreateUserFirebaseDto,
  ResponseStationDto,
  ApiResponse,
} from '../../types'
import { BaseService } from '../base.service'

/**
 * User Service - Manages all user-related API operations
 * Singleton pattern like Angular services
 */
export class UserService extends BaseService {
  private static instance: UserService

  private constructor() {
    super()
  }

  /**
   * Get singleton instance
   */
  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  /**
   * Register a new user
   */
  async registerUser(data: CreateUserDto): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/users/register', data)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  async addFavorites(userId: string, stationId: string): Promise<ApiResponse> {
    try {
      const response = await this.api.post(
        `/users/${userId}/favorites/${stationId}`
      )
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Register user in Firestore using Firebase SDK
   */
  async registerUserFirestore(data: CreateUserFirebaseDto): Promise<void> {
    try {
      const userRef = doc(db, 'users', data.uid)
      const userSnap = await getDoc(userRef)

      // Si el usuario ya existe, no hacer nada
      if (userSnap.exists()) {
        console.log('Usuario ya existe en Firestore')
        return
      }

      // Crear nuevo usuario en Firestore
      const userData = {
        id: data.uid,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await setDoc(userRef, userData)
      console.log('Usuario creado exitosamente en Firestore')
    } catch (error) {
      console.error('Error creando usuario en Firestore:', error)
      throw error
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserResponseDto[]> {
    try {
      const response = await this.api.get('/users')
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserResponseDto> {
    try {
      const response = await this.api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getFavorites(id: string): Promise<ResponseStationDto[]> {
    try {
      const response = await this.api.get(`/users/${id}/favorites`)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update user by UID
   */
  async updateUser(uid: string, data: UpdateUserDto): Promise<ApiResponse> {
    try {
      const response = await this.api.put(`/users/${uid}`, data)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  async updateClaims(uid: string, data: CustomClaimsDto): Promise<ApiResponse> {
    try {
      const response = await this.api.put(`/users/claims/${uid}`, data)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update user favorites
   */
  async updateUserFavorites(
    id: string,
    data: UpdateUserFavoritesDto
  ): Promise<ApiResponse> {
    try {
      const response = await this.api.put(`/users/${id}/favorites`, data)

      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  async removeFavorite(
    userId: string,
    stationId: string
  ): Promise<ApiResponse> {
    try {
      const response = await this.api.delete(
        `/users/${userId}/favorites/${stationId}`
      )
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Delete user by UID
   */
  async deleteUser(uid: string): Promise<ApiResponse> {
    try {
      const response = await this.api.delete(`/users/${uid}`)

      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }
}
