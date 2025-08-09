import { AxiosInstance } from 'axios'
import { apiV1, apiV2 } from '../api/client'

/**
 * Base service class implementing singleton pattern like Angular services
 * All feature services should extend this class
 */
export abstract class BaseService {
    protected api: AxiosInstance
    protected apiV1: AxiosInstance

    protected constructor() {
        this.api = apiV2
        this.apiV1 = apiV1
    }

    /**
     * Handle API errors consistently across all services
     */
    protected handleError(error: any): never {
        console.error('API Error:', error)
        throw error.response?.data || error
    }
}
