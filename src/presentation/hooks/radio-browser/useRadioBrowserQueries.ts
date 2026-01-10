import { useQuery } from '@tanstack/react-query'
import { radioBrowserService } from '@/core/services'
import type { RadioBrowserStation } from '@/core/types'

// Hook for getting top stations by votes
export const useTopRadioStations = (limit: number = 10) => {
  return useQuery<RadioBrowserStation[], Error>({
    queryKey: ['radioBrowserStations', 'top', limit],
    queryFn: () => radioBrowserService.getTopStations(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for getting popular stations by clicks
export const usePopularRadioStations = (limit: number = 10) => {
  return useQuery<RadioBrowserStation[], Error>({
    queryKey: ['radioBrowserStations', 'popular', limit],
    queryFn: () => radioBrowserService.getPopularStations(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for getting stations by tag/genre
export const useRadioStationsByTag = (tag: string, limit: number = 10) => {
  return useQuery<RadioBrowserStation[], Error>({
    queryKey: ['radioBrowserStations', 'tag', tag, limit],
    queryFn: () => radioBrowserService.getStationsByTag(tag, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    enabled: !!tag, // Only run if tag is provided
  })
}

// Hook for getting stations by country
export const useRadioStationsByCountry = (country: string, limit: number = 10) => {
  return useQuery<RadioBrowserStation[], Error>({
    queryKey: ['radioBrowserStations', 'country', country, limit],
    queryFn: () => radioBrowserService.getStationsByCountry(country, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    enabled: !!country, // Only run if country is provided
  })
}

// Hook for searching stations by name
export const useSearchRadioStations = (searchTerm: string, limit: number = 10) => {
  return useQuery<RadioBrowserStation[], Error>({
    queryKey: ['radioBrowserStations', 'search', searchTerm, limit],
    queryFn: () => radioBrowserService.searchStations(searchTerm, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes (shorter for search results)
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    enabled: !!searchTerm && searchTerm.length > 2, // Only run if search term is at least 3 characters
  })
}

// Hook for getting recent stations
export const useRecentRadioStations = (limit: number = 10) => {
  return useQuery<RadioBrowserStation[], Error>({
    queryKey: ['radioBrowserStations', 'recent', limit],
    queryFn: () => radioBrowserService.getRecentStations(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for getting a single station by UUID
export const useRadioStationByUUID = (uuid: string | null) => {
  return useQuery<RadioBrowserStation | null, Error>({
    queryKey: ['radioBrowserStation', 'uuid', uuid],
    queryFn: () => radioBrowserService.getStationByUUID(uuid!),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: !!uuid, // Only run if uuid is provided
  })
}

// Hook for getting all available countries
export const useRadioBrowserCountries = () => {
  return useQuery<string[], Error>({
    queryKey: ['radioBrowserCountries'],
    queryFn: () => radioBrowserService.getAllCountries(),
    staleTime: 30 * 60 * 1000, // 30 minutes (countries don't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  })
}
