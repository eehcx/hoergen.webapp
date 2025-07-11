/**
 * Radio Browser Service - Manages all Radio Browser API operations
 * Singleton pattern like Angular services
 * API Documentation: https://api.radio-browser.info/
 */
export class RadioBrowserService {
    private static instance: RadioBrowserService
    private readonly baseUrl = 'https://de1.api.radio-browser.info/json'

    private constructor() {}

    /**
     * Get singleton instance
     */
    static getInstance(): RadioBrowserService {
        if (!RadioBrowserService.instance) {
            RadioBrowserService.instance = new RadioBrowserService()
        }
        return RadioBrowserService.instance
    }

    /**
     * Generic fetch method for Radio Browser API
     */
    private async fetchFromRadioBrowser<T>(endpoint: string): Promise<T> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`)
            
            if (!response.ok) {
                throw new Error(`Radio Browser API error: ${response.status} ${response.statusText}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('Radio Browser API error:', error)
            throw error
        }
    }

    /**
     * Get top stations by votes
     */
    async getTopStations(limit: number = 10): Promise<RadioBrowserStation[]> {
        return this.fetchFromRadioBrowser<RadioBrowserStation[]>(`/stations/topvote/${limit}`)
    }

    /**
     * Get stations by country
     */
    async getStationsByCountry(country: string, limit: number = 10): Promise<RadioBrowserStation[]> {
        return this.fetchFromRadioBrowser<RadioBrowserStation[]>(`/stations/bycountry/${encodeURIComponent(country)}?limit=${limit}`)
    }

    /**
     * Get stations by tag/genre
     */
    async getStationsByTag(tag: string, limit: number = 10): Promise<RadioBrowserStation[]> {
        return this.fetchFromRadioBrowser<RadioBrowserStation[]>(`/stations/bytag/${encodeURIComponent(tag)}?limit=${limit}`)
    }

    /**
     * Get recently added stations
     */
    async getRecentStations(limit: number = 10): Promise<RadioBrowserStation[]> {
        return this.fetchFromRadioBrowser<RadioBrowserStation[]>(`/stations/lastchange?limit=${limit}`)
    }

    /**
     * Search stations by name
     */
    async searchStations(name: string, limit: number = 10): Promise<RadioBrowserStation[]> {
        return this.fetchFromRadioBrowser<RadioBrowserStation[]>(`/stations/byname/${encodeURIComponent(name)}?limit=${limit}`)
    }

    /**
     * Get popular stations with good quality
     */
    async getPopularStations(limit: number = 10): Promise<RadioBrowserStation[]> {
        return this.fetchFromRadioBrowser<RadioBrowserStation[]>(`/stations/topclick/${limit}`)
    }
}

// Radio Browser Station interface
export interface RadioBrowserStation {
    changeuuid: string
    stationuuid: string
    serveruuid: string | null
    name: string
    url: string
    url_resolved: string
    homepage: string
    favicon: string
    tags: string
    country: string
    countrycode: string
    iso_3166_2: string | null
    state: string
    language: string
    languagecodes: string
    votes: number
    lastchangetime: string
    lastchangetime_iso8601: string
    codec: string
    bitrate: number
    hls: number
    lastcheckok: number
    lastchecktime: string
    lastchecktime_iso8601: string
    lastcheckoktime: string
    lastcheckoktime_iso8601: string
    lastlocalchecktime: string
    lastlocalchecktime_iso8601: string
    clicktimestamp: string
    clicktimestamp_iso8601: string
    clickcount: number
    clicktrend: number
    ssl_error: number
    geo_lat: number | null
    geo_long: number | null
    has_extended_info: boolean
}
