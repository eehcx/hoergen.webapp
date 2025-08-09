import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/core/services'

export function useFavorites(id: string) {
    return useQuery({
        queryKey: ['favorites', id],
        queryFn: async () => {
            const favorites = await userService.getFavorites(id)
            return favorites
        },
        staleTime: 5 * 60 * 1000,
        retry: 3,
    })
}

export function useFavoriteIds(id: string) {
    return useQuery({
        queryKey: ['favoriteStationIds', id],
        queryFn: async () => {
            const favorites = await userService.getFavorites(id)
            return Array.isArray(favorites) ? favorites.map((station: { id: string }) => station.id) : []
        },
        staleTime: 5 * 60 * 1000,
        retry: 3,
    })
}

export function useAddFavorite() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ userId, stationId }: { userId: string; stationId: string }) => {
            return await userService.addFavorites(userId, stationId)
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['favorites', variables.userId] })
        },
    })
}

export function useRemoveFavorite() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ userId, stationId }: { userId: string; stationId: string }) => {
            return await userService.removeFavorite(userId, stationId)
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['favorites', variables.userId] })
            queryClient.invalidateQueries({ queryKey: ['favoriteStationIds', variables.userId] })
        },
    })
}