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
        onMutate: async ({ userId, stationId }) => {
            // Cancelar queries en progreso para evitar conflictos
            await queryClient.cancelQueries({ queryKey: ['favoriteStationIds', userId] })
            await queryClient.cancelQueries({ queryKey: ['station', stationId] })
            
            // Obtener datos actuales
            const previousFavoriteIds = queryClient.getQueryData(['favoriteStationIds', userId])
            const previousStationData = queryClient.getQueryData(['station', stationId])
            
            // Actualizar optimísticamente el cache de favoriteIds
            queryClient.setQueryData(['favoriteStationIds', userId], (old: string[] = []) => {
                if (!old.includes(stationId)) {
                    return [...old, stationId]
                }
                return old
            })
            
            // Actualizar optimísticamente el conteo de favoritos de la estación
            queryClient.setQueryData(['station', stationId], (old: any) => {
                if (old) {
                    return {
                        ...old,
                        favoritesCount: (old.favoritesCount || 0) + 1
                    }
                }
                return old
            })
            
            // Retornar contexto para rollback si es necesario
            return { previousFavoriteIds, previousStationData }
        },
        onError: (_error, variables, context) => {
            // Rollback en caso de error
            if (context?.previousFavoriteIds) {
                queryClient.setQueryData(['favoriteStationIds', variables.userId], context.previousFavoriteIds)
            }
            if (context?.previousStationData) {
                queryClient.setQueryData(['station', variables.stationId], context.previousStationData)
            }
        },
        onSuccess: (_data, variables) => {
            // Invalidar ambas queries para asegurar consistencia
            queryClient.invalidateQueries({ queryKey: ['favorites', variables.userId] })
            queryClient.invalidateQueries({ queryKey: ['favoriteStationIds', variables.userId] })
            queryClient.invalidateQueries({ queryKey: ['station', variables.stationId] })
        },
    })
}

export function useRemoveFavorite() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ userId, stationId }: { userId: string; stationId: string }) => {
            return await userService.removeFavorite(userId, stationId)
        },
        onMutate: async ({ userId, stationId }) => {
            // Cancelar queries en progreso para evitar conflictos
            await queryClient.cancelQueries({ queryKey: ['favoriteStationIds', userId] })
            await queryClient.cancelQueries({ queryKey: ['station', stationId] })
            
            // Obtener datos actuales
            const previousFavoriteIds = queryClient.getQueryData(['favoriteStationIds', userId])
            const previousStationData = queryClient.getQueryData(['station', stationId])
            
            // Actualizar optimísticamente el cache de favoriteIds
            queryClient.setQueryData(['favoriteStationIds', userId], (old: string[] = []) => {
                return old.filter(id => id !== stationId)
            })
            
            // Actualizar optimísticamente el conteo de favoritos de la estación
            queryClient.setQueryData(['station', stationId], (old: any) => {
                if (old) {
                    return {
                        ...old,
                        favoritesCount: Math.max((old.favoritesCount || 0) - 1, 0)
                    }
                }
                return old
            })
            
            // Retornar contexto para rollback si es necesario
            return { previousFavoriteIds, previousStationData }
        },
        onError: (_error, variables, context) => {
            // Rollback en caso de error
            if (context?.previousFavoriteIds) {
                queryClient.setQueryData(['favoriteStationIds', variables.userId], context.previousFavoriteIds)
            }
            if (context?.previousStationData) {
                queryClient.setQueryData(['station', variables.stationId], context.previousStationData)
            }
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['favorites', variables.userId] })
            queryClient.invalidateQueries({ queryKey: ['favoriteStationIds', variables.userId] })
            queryClient.invalidateQueries({ queryKey: ['station', variables.stationId] })
        },
    })
}