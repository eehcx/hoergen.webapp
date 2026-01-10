import { useInfiniteQuery } from '@tanstack/react-query'
import { radioBrowserService } from '@/core/services'
import type { RadioBrowserStation } from '@/core/types'

// Types for the infinite query hook
export interface RadioBrowserInfiniteParams {
    pageSize?: number
    strategy?: 'top-voted' | 'most-clicked' | 'recent' | 'search'
    searchTerm?: string
    country?: string
    genre?: string
}

export interface RadioBrowserPage {
    stations: RadioBrowserStation[]
    nextOffset: number | null
    hasMore: boolean
}

// Validation functions (reusing from the main hook)
const validateStation = async (station: RadioBrowserStation): Promise<boolean> => {
    // Basic validation checks
    if (!station.url_resolved || station.url_resolved.trim() === '') {
        return false
    }
    // Check if URL is properly formatted
    try {
        new URL(station.url_resolved)
    } catch {
        return false
    }
    // Validate that it's a streaming URL (common streaming protocols)
    const validProtocols = ['http:', 'https:']
    const url = new URL(station.url_resolved)
    if (!validProtocols.includes(url.protocol)) {
        return false
    }
    // Only filter out obviously invalid/corrupt URLs (not geo-restricted)
    const invalidPatterns = [
        /localhost/i,
        /127\.0\.0\.1/,
        /0\.0\.0\.0/,
        /example\.com/,
        /invalid/,
        /\.txt$/i,
        /\.json$/i,
        /\/test\//i,
        /\/dummy\//i,
        /\/404/,
        /\/notfound/,
        /\/error/,
        /\/offline/,
        /\/unavailable/
    ]
    if (invalidPatterns.some(pattern => pattern.test(station.url_resolved))) {
        return false
    }
    return true
}

const validateFavicon = (station: RadioBrowserStation): boolean => {
    if (!station.favicon || station.favicon.trim() === '') {
        return true // Allow stations without favicon
    }
    
    // Check if favicon is a valid URL
    try {
        new URL(station.favicon)
        return true
    } catch {
        return false
    }
}

const filterHighQualityStations = async (stations: RadioBrowserStation[]): Promise<RadioBrowserStation[]> => {
    const validatedStations: RadioBrowserStation[] = []
    
    for (const station of stations) {
        // Apply all validation checks
        const isValidStream = await validateStation(station)
        const isValidFavicon = validateFavicon(station)
        
        // Additional quality checks
        const qualityChecks = 
        station.bitrate >= 64 && // Lower bitrate threshold for more results
        station.lastcheckok === 1 &&
        station.name && station.name.trim() !== '' &&
        station.country && station.country.trim() !== '' &&
        !station.name.toLowerCase().includes('test') &&
        !station.name.toLowerCase().includes('error') &&
        isValidStream &&
        isValidFavicon
        
        if (qualityChecks) {
        validatedStations.push(station)
        }
    }
    
    return validatedStations
}

// Enhanced Radio Browser service methods with offset support
const fetchStationsPage = async (
    params: RadioBrowserInfiniteParams,
    offset: number
): Promise<RadioBrowserPage> => {
    const { pageSize = 20, strategy = 'top-voted', searchTerm, country } = params
    
    let stations: RadioBrowserStation[] = []
    
    try {
        // Since Radio Browser API doesn't support offset directly, we'll fetch larger chunks
        // and simulate pagination on the client side
        const fetchSize = Math.min(pageSize * 5, 100) // Fetch 5 pages worth or max 100
        
        // If country is specified, use country filter regardless of strategy
        if (country) {
            stations = await radioBrowserService.getStationsByCountry(country, fetchSize)
        } else {
            switch (strategy) {
            case 'top-voted':
                stations = await radioBrowserService.getTopStations(fetchSize)
                break
            case 'most-clicked':
                stations = await radioBrowserService.getPopularStations(fetchSize)
                break
            case 'recent':
                stations = await radioBrowserService.getRecentStations(fetchSize)
                break
            case 'search':
                if (searchTerm) {
                stations = await radioBrowserService.searchStations(searchTerm, fetchSize)
                } else {
                stations = await radioBrowserService.getTopStations(fetchSize)
                }
                break
            default:
                stations = await radioBrowserService.getTopStations(fetchSize)
            }
        }
        
        // Filter for high quality stations
        const validatedStations = await filterHighQualityStations(stations)
        
        // Sort by quality score
        const sortedStations = validatedStations.sort((a, b) => {
            const scoreA = (a.votes * 2) + (a.clickcount / 100) + (a.bitrate / 10)
            const scoreB = (b.votes * 2) + (b.clickcount / 100) + (b.bitrate / 10)
            
            return scoreB - scoreA
        })
        
        // Simulate pagination by slicing the results
        const startIndex = offset
        const endIndex = offset + pageSize
        const pageStations = sortedStations.slice(startIndex, endIndex)
        const hasMore = endIndex < sortedStations.length
        const nextOffset = hasMore ? endIndex : null
        
        return {
            stations: pageStations,
            nextOffset,
            hasMore
        }
        
    } catch (error) {
        throw error
    }
}

// Infinite query hook
export const useRadioBrowserInfiniteQuery = (params: RadioBrowserInfiniteParams = {}) => {
    return useInfiniteQuery({
        queryKey: ['radioBrowserInfinite', params],
        queryFn: ({ pageParam = 0 }) => fetchStationsPage(params, pageParam),
        getNextPageParam: (lastPage) => lastPage.nextOffset,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        refetchOnWindowFocus: false,
        initialPageParam: 0,
    })
}
