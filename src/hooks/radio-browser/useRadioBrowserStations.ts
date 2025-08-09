import { useQuery } from '@tanstack/react-query'
import { radioBrowserService } from '@/core/services'
import type { RadioBrowserStation } from '@/core/types'

// Types for the hook
export interface RadioBrowserStationsParams {
  limit?: number
  strategy?: 'top-voted' | 'most-clicked' | 'random-genre'
  genreFilter?: string[]
}

export interface RadioBrowserStationsResult {
  stations: RadioBrowserStation[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

// Validation functions
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
  const validProtocols = ['http:', 'https:', 'icecast:', 'shout:']
  const url = new URL(station.url_resolved)
  if (!validProtocols.includes(url.protocol)) {
    return false
  }
  
  // Check for common invalid extensions or patterns
  const invalidPatterns = [
    /\.html?$/i,
    /\.php$/i,
    /\.asp$/i,
    /\.jsp$/i,
    /\/redirect/i,
    /\/listen\.pls$/i,
    /\/playlist/i
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
      station.bitrate >= 128 &&
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

// Strategy functions
const getTopVotedStations = async (genreFilter: string[] = []) => {
  const topStations = await radioBrowserService.getTopStations(100)
  const musicStations = topStations.filter(station => 
    station.votes >= 10 &&
    genreFilter.some(genre => 
      station.tags.toLowerCase().includes(genre.toLowerCase()) ||
      station.name.toLowerCase().includes(genre.toLowerCase())
    )
  )
  return await filterHighQualityStations(musicStations)
}

const getMostClickedStations = async (genreFilter: string[] = []) => {
  const popularStations = await radioBrowserService.getPopularStations(100)
  const musicStations = popularStations.filter(station => 
    station.clickcount >= 100 &&
    genreFilter.some(genre => 
      station.tags.toLowerCase().includes(genre.toLowerCase()) ||
      station.name.toLowerCase().includes(genre.toLowerCase())
    )
  )
  return await filterHighQualityStations(musicStations)
}

const getRandomGenreStations = async () => {
  const musicGenres = ['garage', 'house', 'techno', 'jazz', 'electronic', 'indie', 'alternative', 'dance', 'jungle']
  const randomGenre = musicGenres[Math.floor(Math.random() * musicGenres.length)]
  const genreStations = await radioBrowserService.getStationsByTag(randomGenre, 50)
  const qualityStations = genreStations.filter(station => 
    (station.votes >= 5 || station.clickcount >= 50)
  )
  return await filterHighQualityStations(qualityStations)
}

// Main fetch function
const fetchRadioBrowserStations = async (params: RadioBrowserStationsParams): Promise<RadioBrowserStation[]> => {
  const { strategy = 'random-genre', genreFilter = ['garage', 'house', 'techno', 'jazz', 'electronic', 'indie'] } = params
  
  try {
    let stations: RadioBrowserStation[] = []
    
    // Select strategy
    switch (strategy) {
      case 'top-voted':
        stations = await getTopVotedStations(genreFilter)
        break
      case 'most-clicked':
        stations = await getMostClickedStations(genreFilter)
        break
      case 'random-genre':
        stations = await getRandomGenreStations()
        break
      default:
        // Random strategy selection
        const strategies = [getTopVotedStations, getMostClickedStations, getRandomGenreStations]
        const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)]
        stations = await randomStrategy(genreFilter)
    }
    
    // Remove duplicates by station UUID and get unique, high-quality stations
    const uniqueStations = stations.reduce((unique, station) => {
      const isDuplicate = unique.some(s => 
        s.stationuuid === station.stationuuid || 
        s.name.toLowerCase() === station.name.toLowerCase()
      )
      if (!isDuplicate && unique.length < 3) {
        unique.push(station)
      }
      return unique
    }, [] as typeof stations)
    
    // Sort by popularity metrics and take top 3
    const finalStations = uniqueStations
      .sort((a, b) => {
        const scoreA = (a.votes * 2) + (a.clickcount / 100) + (a.bitrate / 10)
        const scoreB = (b.votes * 2) + (b.clickcount / 100) + (b.bitrate / 10)
        return scoreB - scoreA
      })
      .slice(0, 3)
    
    return finalStations
    
  } catch (error) {
    console.error('Error loading Radio Browser stations:', error)
    
    // Fallback: simple top stations if strategies fail
    try {
      const fallbackStations = await radioBrowserService.getTopStations(20)
      const validatedFallback = await filterHighQualityStations(fallbackStations)
      return validatedFallback.slice(0, 3)
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      throw fallbackError
    }
  }
}

// Hook
export const useRadioBrowserStations = (params: RadioBrowserStationsParams = {}): RadioBrowserStationsResult => {
  const { data: stations = [], isLoading, error, refetch } = useQuery<RadioBrowserStation[], Error>({
    queryKey: ['radioBrowserStations', params],
    queryFn: () => fetchRadioBrowserStations(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  })
  
  return {
    stations,
    isLoading,
    error: error as Error | null,
    refetch
  }
}
