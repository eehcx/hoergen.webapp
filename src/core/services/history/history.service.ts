import { BaseService } from '../base.service'
import {
    CreateHistoryDto,
    HistoryResponseDto,
    ApiResponse
} from '../../types'

/**
 * History Service - Manages all user listening history API operations
 * Singleton pattern like Angular services
 */
export class HistoryService extends BaseService {
    private static instance: HistoryService

    private constructor() {
        super()
    }

    /**
     * Get singleton instance
     */
    static getInstance(): HistoryService {
        if (!HistoryService.instance) {
        HistoryService.instance = new HistoryService()
        }
        return HistoryService.instance
    }

    /**
     * Create a new history entry
     */
    async createHistory(data: CreateHistoryDto): Promise<ApiResponse> {
        try {
        const response = await this.api.post('/history', data)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get user history by user ID
     */
    async getUserHistory(userId: string): Promise<HistoryResponseDto[]> {
        try {
        const response = await this.api.get(`/history/${userId}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Delete history entry by ID
     */
    async deleteHistory(id: string): Promise<ApiResponse> {
        try {
        const response = await this.api.delete(`/history/${id}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get user history with pagination
     */
    async getUserHistoryPaginated(
        userId: string,
        limit: number = 20,
        offset: number = 0
    ): Promise<HistoryResponseDto[]> {
        try {
        const response = await this.api.get(`/history/${userId}?limit=${limit}&offset=${offset}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get user history by date range
     */
    async getUserHistoryByDateRange(
        userId: string,
        startDate: string,
        endDate: string
    ): Promise<HistoryResponseDto[]> {
        try {
        const response = await this.api.get(
            `/history/${userId}?startDate=${startDate}&endDate=${endDate}`
        )
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get recent listening history for user
     */
    async getRecentHistory(userId: string, limit: number = 3): Promise<HistoryResponseDto[]> {
        try {
            const response = await this.api.get(`/history/${userId}?limit=${limit}&sort=desc`)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Get top stations for user based on listening history
     */
    async getMostListenedStations(userId: string, limit: number = 10): Promise<{
        stationId: string
        stationName: string
        listenCount: number
        lastListened: string
    }[]> {
        try {
        const response = await this.api.get(`/history/${userId}/top-stations?limit=${limit}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Clear all history for a user
     */
    async clearUserHistory(userId: string): Promise<ApiResponse> {
        try {
        const response = await this.api.delete(`/history/user/${userId}/clear`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get listening statistics for user
     */
    async getUserListeningStats(userId: string): Promise<{
        totalListens: number
        uniqueStations: number
        totalListeningTime: number
        favoriteGenres: string[]
        listeningStreaks: number
    }> {
        try {
        const response = await this.api.get(`/history/${userId}/stats`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Add station to history (convenience method)
     */
    async addStationToHistory(userId: string, stationId: string): Promise<ApiResponse> {
        return this.createHistory({ userId, stationId })
    }

    /**
     * Check if user has listened to station recently
     */
    async hasRecentlyListened(userId: string, stationId: string, hours: number = 24): Promise<boolean> {
        try {
        const response = await this.api.get(
            `/history/${userId}/recent-check?stationId=${stationId}&hours=${hours}`
        )
        return response.data.hasListened
        } catch (error) {
        return this.handleError(error)
        }
    }
}
