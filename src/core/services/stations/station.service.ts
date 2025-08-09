import {
  CreateStationDto,
  UpdateStationDto,
  ResponseStationDto,
  UpdateFavoritesDto,
  UpdateFavoritesResponse,
  StationQueryParams,
  ApiResponse,
  TopStationsQueryParams,
} from '@/core/types'
import { BaseService } from '../base.service'

/**
 * Station Service - Manages all station-related API operations
 * Singleton pattern like Angular services
 */
export class StationService extends BaseService {
  private static instance: StationService

  private constructor() {
    super()
  }

  /**
   * Get singleton instance
   */
  static getInstance(): StationService {
    if (!StationService.instance) {
      StationService.instance = new StationService()
    }
    return StationService.instance
  }

  /**
   * Create a new station
   */
  async createStation(data: CreateStationDto): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/stations', data)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get all stations with optional filters
   */
  async getAllStations(
    params?: StationQueryParams
  ): Promise<ResponseStationDto[]> {
    try {
      const response = await this.api.get('/stations', { params })
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get station by ID
   */
  async getStationById(id: string): Promise<ResponseStationDto> {
    try {
      const response = await this.api.get(`/stations/${id}`)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getStationsBySlug(slug: string): Promise<any> {
    try {
      const response = await this.api.get(`/stations/slug/${slug}`)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update station by ID
   */
  async updateStation(
    id: string,
    data: UpdateStationDto
  ): Promise<ApiResponse> {
    try {
      const response = await this.api.put(`/stations/${id}`, data)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Delete station by ID
   */
  async deleteStation(id: string): Promise<ApiResponse> {
    try {
      const response = await this.api.delete(`/stations/${id}`)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  async AddModerators(id: string, moderators: string[]): Promise<ApiResponse> {
    try {
      const response = await this.api.put(`/stations/${id}/moderators`, {
        moderators,
      })
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  async RemoveModerators(
    id: string,
    moderators: string[]
  ): Promise<ApiResponse> {
    try {
      const response = await this.api.request({
        method: 'DELETE',
        url: `/stations/${id}/moderators`,
        data: { moderators },
      })
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update favorites count for a station
   */
  async updateFavorites(
    id: string,
    data: UpdateFavoritesDto
  ): Promise<UpdateFavoritesResponse> {
    try {
      const response = await this.api.put(`/stations/${id}/favorites`, data)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get stations by country
   */
  async getStationsByCountry(id: string): Promise<ResponseStationDto[]> {
    try {
      const response = await this.api.get(`/stations/country/${id}`)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get stations by genre
   */
  async getStationsByGenre(id: string): Promise<ResponseStationDto[]> {
    try {
      const response = await this.api.get(`/stations/genre/${id}`)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get stations by owner
   */
  async getStationsByOwner(id: string): Promise<ResponseStationDto[]> {
    try {
      const response = await this.api.get(`/stations/owner/${id}`)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Increment favorites for a station
   */
  async addToFavorites(id: string): Promise<UpdateFavoritesResponse> {
    return this.updateFavorites(id, { increment: 1 })
  }

  /**
   * Decrement favorites for a station
   */
  async removeFromFavorites(id: string): Promise<UpdateFavoritesResponse> {
    return this.updateFavorites(id, { increment: -1 })
  }

  async getAnalyticsByStationId(id: string): Promise<any> {
    return this.api
      .get(`/stations/${id}/analytics`)
      .then((response) => response.data)
      .catch((error) => this.handleError(error))
  }

  async getGeneralAnalytics(): Promise<any> {
    return this.api
      .get('/stations/analytics/general')
      .then((response) => response.data)
      .catch((error) => this.handleError(error))
  }

  async getAnalyticsTopStations(params?: TopStationsQueryParams): Promise<any> {
    return this.api
      .get('stations/analytics/top', { params })
      .then((response) => response.data)
      .catch((error) => this.handleError(error))
  }
}
