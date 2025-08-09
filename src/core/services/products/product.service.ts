import { BaseService } from '../base.service'
import {
    UpdateProductDto,
    CreatePriceDto,
    UpdatePriceMetadataDto,
    ProductQueryParams,
    ProductWithPrice,
    ProductWithPriceResponse,
    PriceResponseDto,
    //Price,
    //Product,
} from '@/core/types/product.types'
import type { ApiResponse } from '@/core/types'

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

    // Crear producto y precio
    async create(data: ProductWithPrice): Promise<ApiResponse> {
        try {
            const response = await this.api.post('/products', data)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    // Listar productos
    async list(params?: ProductQueryParams): Promise<ProductWithPriceResponse[]> {
        try {
            const response = await this.api.get('/products', { params })
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    // Obtener producto por ID
    async getById(id: string, withPrices?: boolean): Promise<ProductWithPriceResponse> {
        try {
            const response = await this.api.get(`/products/${id}`, { params: { withPrices } })
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    // Actualizar producto
    async update(id: string, data: UpdateProductDto): Promise<ApiResponse> {
        try {
            const response = await this.api.put(`/products/${id}`, data)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    // Eliminar producto
    async delete(id: string): Promise<ApiResponse> {
        try {
            const response = await this.api.delete(`/products/${id}`)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    // Crear precio para producto
    async createPrice(productId: string, price: CreatePriceDto): Promise<ApiResponse> {
        try {
            const response = await this.api.post(`/products/${productId}/prices`, price)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    // Listar precios de producto
    async listPrices(productId: string): Promise<PriceResponseDto[]> {
        try {
            const response = await this.api.get(`/products/${productId}/prices`)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    // Actualizar metadatos de precio
    async updatePrice(priceId: string, metadata: UpdatePriceMetadataDto): Promise<ApiResponse> {
        try {
            const response = await this.api.put(`/products/prices/${priceId}`, { metadata })
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }
}
