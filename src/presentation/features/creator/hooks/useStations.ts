import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { StationService } from "@/core/services"
import type { ResponseStationDto } from '@/core/types'

export function useCreatorStations(creatorId: string) {
    const stationService = StationService.getInstance()
    return useQuery<ResponseStationDto[]>({
        queryKey: ['stations', creatorId],
        queryFn: async () => {
            const stations = await stationService.getStationsByOwner(creatorId)
            return stations
        },
        staleTime: 1000 * 60 * 2,
    })
}

export function useEditStation(onSuccess?: (station?: any) => void, onError?: (error: any) => void) {
    const stationService = StationService.getInstance()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<ResponseStationDto> }) => {
            const updatedStation = await stationService.updateStation(id, data)
            return updatedStation
        },
        onSuccess: (data, variables) => {
            // Invalidate all station-related queries
            queryClient.invalidateQueries({ queryKey: ['stations'] })
            // Invalidate specific station query
            queryClient.invalidateQueries({ queryKey: ['station', variables.id] })
            // Also invalidate creator stations query
            queryClient.invalidateQueries({ queryKey: ['stations', 'creator'] })
            onSuccess?.(data)
        },
        onError: (error) => {
            console.error('Error updating station:', error)
            onError?.(error)
        },
        mutationKey: ['edit-station'],
    })

    return mutation
}

export function useDeleteStation(onSuccess?: (stationId?: string) => void, onError?: (error: any) => void) {
    const stationService = StationService.getInstance()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            await stationService.deleteStation(id)
            return id
        },
        onSuccess: (deletedStationId) => {
            // Invalidate all station-related queries
            queryClient.invalidateQueries({ queryKey: ['stations'] })
            // Remove specific station from cache
            queryClient.removeQueries({ queryKey: ['station', deletedStationId] })
            onSuccess?.(deletedStationId)
        },
        onError: (error) => {
            console.error('Error deleting station:', error)
            onError?.(error)
        },
        mutationKey: ['delete-station'],
    })

    return mutation
}