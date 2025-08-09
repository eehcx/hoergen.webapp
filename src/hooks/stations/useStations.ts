import { useQuery } from '@tanstack/react-query'
import { stationService } from "@/core/services"
import { ResponseStationDto } from '@/core/types'

export const useStations = () => {
  return useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const stations = await stationService.getAllStations() as unknown as ResponseStationDto[]
      return stations
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
  });
};
