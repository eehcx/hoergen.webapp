import { BaseService } from '../base.service'
import {
    CreateProductDto,
    ProductResponseDto,
    ProductPriceDto,
    ApiResponse
} from '../../types'

/**
 * Product Service - Manages all product-related API operations
 * Uses v1 API for core product operations as per API documentation:
 * - POST /v1/products - Create product
 * - GET /v1/products - Get active products  
 * - GET /v1/products/:id - Get product by ID
 * - GET /v1/products/:id/prices - Get product prices
 * 
 * Fallback to v2 API for operations not available in v1
 * Singleton pattern like Angular services
 */
export class ProductService extends BaseService {
    private static instance: ProductService

    private constructor() {
        super()
    }

    /**
     * Get singleton instance
     */
    static getInstance(): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService()
        }
        return ProductService.instance
    }

    /**
     * Create a new product (v1 API)
     */
    async createProduct(data: CreateProductDto): Promise<ApiResponse> {
        try {
            const response = await this.apiV1.post('/products', data)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Get active products (v1 API)
     */
    async getActiveProducts(): Promise<ProductResponseDto[]> {
        try {
            const response = await this.apiV1.get('/products')
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Get product by ID (v1 API)
     */
    async getProductById(id: string): Promise<ProductResponseDto> {
        try {
            const response = await this.apiV1.get(`/products/${id}`)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Get product prices (v1 API)
     */
    async getProductPrices(id: string): Promise<ProductPriceDto[]> {
        try {
            const response = await this.apiV1.get(`/products/${id}/prices`)
            
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }


}
