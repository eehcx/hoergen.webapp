import { apiV2 } from '../api/client'

// Define the API interface to match our fetch-based client
interface ApiClient {
    get: (endpoint: string) => Promise<{ data: any }>
    post: (endpoint: string, data?: any) => Promise<{ data: any }>
    put: (endpoint: string, data?: any) => Promise<{ data: any }>
    delete: (endpoint: string) => Promise<{ data: any }>
}

/**
 * Base service class - All endpoints use API v2
 * All feature services should extend this class
 */
export abstract class BaseService {
    protected api: ApiClient

    protected constructor() {
        this.api = apiV2
    }

    /**
     * Handle API errors consistently across all services
     */
    protected handleError(error: any): never {
        console.error('API Error:', error)
        throw error
    }
}

// For backward compatibility - remove BaseServiceV1
export abstract class BaseServiceV1 extends BaseService {}
