import { BaseService } from '../base.service'
import {
    CreateUserDto,
    UpdateUserDto,
    UserResponseDto,
    UpdateUserFavoritesDto,
    ApiResponse
} from '../../types'

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

    /**
     * Update user favorites
     */
    async updateUserFavorites(id: string, data: UpdateUserFavoritesDto): Promise<ApiResponse> {
        try {
        const response = await this.api.put(`/users/${id}/favorites`, data)
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

    /**
     * Get users by role
     */
    async getUsersByRole(role: 'user' | 'admin' | 'moderator'): Promise<UserResponseDto[]> {
        try {
        const response = await this.api.get(`/users?role=${role}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get users by plan
     */
    async getUsersByPlan(plan: 'free' | 'premium' | 'business'): Promise<UserResponseDto[]> {
        try {
        const response = await this.api.get(`/users?plan=${plan}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }
}
