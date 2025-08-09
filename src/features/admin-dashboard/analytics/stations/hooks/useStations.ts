import { useQuery } from '@tanstack/react-query'
import { stationService } from '@/core/services'

export function useGeneralStations() {
    return useQuery({
        queryKey: ['stations', 'general'],
        queryFn: async () => {
            const customers = await stationService.getGeneralAnalytics()
            return customers
        },
        staleTime: 5 * 60 * 1000,
        retry: 2,
    })
}

export function useTopStations(limit: number) {
    return useQuery({
        queryKey: ['stations', 'top', limit],
        queryFn: async () => {
            const customers = await stationService.getAnalyticsTopStations({ limit })
            return customers
        },
        staleTime: 5 * 60 * 1000,
        retry: 2,
    })
}
