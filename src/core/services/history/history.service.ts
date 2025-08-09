import { BaseService } from '../base.service'
import { 
  CreateHistoryDto, 
  HistoryResponse, 
  //ApiResponse 
} from '../../types'

/**
 * Adapted History Service for REST endpoints compatible with React Native version
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
   * Create a new history entry (POST /history)
   * Returns void on success
   */
  async createHistory(data: CreateHistoryDto): Promise<void> {
    try {
      const response = await this.api.post('/history', data)
      if (response.status !== 201 && response.status !== 200) {
        throw new Error(response.data?.message || `HTTP Error: ${response.status}`)
      }
      // No return value needed
    } catch (error: any) {
      throw new Error(`History creation failed: ${error?.message || error}`)
    }
  }

  /**
   * Get user history by user ID (GET /history/user/:userId)
   * Returns array of HistoryResponse
   */
  async getHistoryByUser(userId: string): Promise<HistoryResponse[]> {
    try {
      const response = await this.api.get(`/history/user/${userId}`)
      if (response.status !== 200) {
        throw new Error(response.data?.message || `HTTP Error: ${response.status}`)
      }
      return response.data as HistoryResponse[]
    } catch (error: any) {
      throw new Error(`Fetching history failed: ${error?.message || error}`)
    }
  }

  /**
   * Delete history entry by ID (DELETE /history/:historyId)
   * Returns void on success
   */
  async deleteHistory(historyId: string): Promise<void> {
    try {
      const response = await this.api.delete(`/history/${historyId}`)
      if (response.status !== 200 && response.status !== 204) {
        throw new Error(response.data?.message || `HTTP Error: ${response.status}`)
      }
      // No return value needed
    } catch (error: any) {
      throw new Error(`Deleting history failed: ${error?.message || error}`)
    }
  }
}

// Export singleton instance
export const historyService = HistoryService.getInstance()
