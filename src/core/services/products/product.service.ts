import { BaseService } from '../base.service'
import {
    CreateProductDto,
    UpdateProductDto,
    ProductResponseDto,
    ProductQueryParams,
    ApiResponse
} from '../../types'

/**
 * Product Service - Manages all product-related API operations
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
     * Create a new product (with Stripe integration)
     */
    async createProduct(data: CreateProductDto): Promise<ApiResponse> {
        try {
        const response = await this.api.post('/products', data)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get all products with optional filters
     */
    async getAllProducts(params?: ProductQueryParams): Promise<ProductResponseDto[]> {
        try {
        const response = await this.api.get('/products', { params })
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get product by ID
     */
    async getProductById(id: string): Promise<ProductResponseDto> {
        try {
        const response = await this.api.get(`/products/${id}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Update product by ID
     */
    async updateProduct(id: string, data: UpdateProductDto): Promise<ApiResponse> {
        try {
        const response = await this.api.put(`/products/${id}`, data)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Delete product by ID
     */
    async deleteProduct(id: string): Promise<ApiResponse> {
        try {
        const response = await this.api.delete(`/products/${id}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get products by type
     */
    async getProductsByType(type: 'subscription' | 'one_time'): Promise<ProductResponseDto[]> {
        return this.getAllProducts({ type })
    }

    /**
     * Get subscription products
     */
    async getSubscriptionProducts(): Promise<ProductResponseDto[]> {
        return this.getProductsByType('subscription')
    }

    /**
     * Get one-time purchase products
     */
    async getOneTimeProducts(): Promise<ProductResponseDto[]> {
        return this.getProductsByType('one_time')
    }

    /**
     * Get products by subscription type
     */
    async getProductsBySubscriptionType(subscriptionType: 'free' | 'premium' | 'business'): Promise<ProductResponseDto[]> {
        try {
        const response = await this.api.get(`/products?subscriptionType=${subscriptionType}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }
}
