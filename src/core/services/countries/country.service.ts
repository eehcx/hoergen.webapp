import { BaseService } from '../base.service'
import {
    CreateCountryDto,
    CountryResponseDto,
    ApiResponse
} from '../../types'

/**
 * Country Service - Manages all country-related API operations
 * Singleton pattern like Angular services
 */
export class CountryService extends BaseService {
    private static instance: CountryService

    private constructor() {
        super()
    }

    /**
     * Get singleton instance
     */
    static getInstance(): CountryService {
        if (!CountryService.instance) {
        CountryService.instance = new CountryService()
        }
        return CountryService.instance
    }

    /**
     * Create a new country
     */
    async createCountry(data: CreateCountryDto): Promise<ApiResponse> {
        try {
        const response = await this.api.post('/countries', data)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get all countries
     */
    async getAllCountries(): Promise<CountryResponseDto[]> {
        try {
        const response = await this.api.get('/countries')
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get country by ISO code
     */
    async getCountryByIsoCode(isoCode: string): Promise<CountryResponseDto> {
        try {
        const response = await this.api.get(`/countries/${isoCode}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Delete country by ISO code
     */
    async deleteCountry(isoCode: string): Promise<ApiResponse> {
        try {
        const response = await this.api.delete(`/countries/${isoCode}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get countries by continent
     */
    async getCountriesByContinent(continent: string): Promise<CountryResponseDto[]> {
        try {
        const response = await this.api.get(`/countries?continent=${encodeURIComponent(continent)}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get countries by language
     */
    async getCountriesByLanguage(language: string): Promise<CountryResponseDto[]> {
        try {
        const response = await this.api.get(`/countries?language=${encodeURIComponent(language)}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get most popular countries
     */
    async getMostPopularCountries(limit: number = 10): Promise<CountryResponseDto[]> {
        try {
        const response = await this.api.get(`/countries?sortBy=popularity&order=desc&limit=${limit}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Search countries by name or ISO code
     */
    async searchCountries(query: string): Promise<CountryResponseDto[]> {
        try {
        const response = await this.api.get(`/countries?search=${encodeURIComponent(query)}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get countries with most stations
     */
    async getCountriesWithMostStations(limit: number = 10): Promise<CountryResponseDto[]> {
        try {
        const response = await this.api.get(`/countries?sortBy=stationCount&order=desc&limit=${limit}`)
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }

    /**
     * Get country statistics
     */
    async getCountryStats(): Promise<{
        totalCountries: number
        totalStations: number
        avgStationsPerCountry: number
        topContinents: Array<{ continent: string; count: number }>
    }> {
        try {
        const response = await this.api.get('/countries/stats')
        return response.data
        } catch (error) {
        return this.handleError(error)
        }
    }
}
