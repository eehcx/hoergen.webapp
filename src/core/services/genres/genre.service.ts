import { BaseService } from '../base.service'
import {
    CreateGenreDto,
    UpdateGenreDto,
    GenreResponseDto,
    ApiResponse
} from '../../types'

/**
 * Genre Service - Manages all genre-related API operations
 * Singleton pattern like Angular services
 */
export class GenreService extends BaseService {
    private static instance: GenreService

    private constructor() {
        super()
    }

    /**
     * Get singleton instance
     */
    static getInstance(): GenreService {
        if (!GenreService.instance) {
        GenreService.instance = new GenreService()
        }
        return GenreService.instance
    }

    /**
     * Create a new genre
     */
    async createGenre(data: CreateGenreDto): Promise<ApiResponse> {
        try {
        const response = await this.api.post('/genres', data)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get all genres
     */
    async getAllGenres(): Promise<GenreResponseDto[]> {
        try {
        const response = await this.api.get('/genres')
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get genre by ID
     */
    async getGenreById(id: string): Promise<GenreResponseDto> {
        try {
        const response = await this.api.get(`/genres/${id}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Update genre by ID
     */
    async updateGenre(id: string, data: UpdateGenreDto): Promise<ApiResponse> {
        try {
        const response = await this.api.put(`/genres/${id}`, data)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Delete genre by ID
     */
    async deleteGenre(id: string): Promise<ApiResponse> {
        try {
        const response = await this.api.delete(`/genres/${id}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Search genres by name or canonical name
     */
    async searchGenres(query: string): Promise<GenreResponseDto[]> {
        try {
        const response = await this.api.get(`/genres?search=${encodeURIComponent(query)}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }
}
