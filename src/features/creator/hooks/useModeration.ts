import { useMutation, useQueryClient } from '@tanstack/react-query'
import { StationService } from '@/core/services'
import type { ApiResponse } from '@/core/types'

/**
 * Hook para agregar moderadores a una estación
 */
export function useAddModerators(
  onSuccess?: (data?: ApiResponse) => void,
  onError?: (error: any) => void
) {
  const stationService = StationService.getInstance()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      stationId,
      moderators,
    }: {
      stationId: string
      moderators: string[]
    }) => {
      const response = await stationService.AddModerators(stationId, moderators)
      return response
    },
    onSuccess: (data, variables) => {
      // Invalidate station-related queries to refresh moderators list
      queryClient.invalidateQueries({ queryKey: ['stations'] })
      queryClient.invalidateQueries({
        queryKey: ['station', variables.stationId],
      })
      queryClient.invalidateQueries({ queryKey: ['stations', 'creator'] })

      // Refrescar datos de usuarios si hay nuevos moderadores
      if (data && data.data && Array.isArray(data.data.moderators)) {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        // Invalidar datos específicos de los usuarios moderadores
        data.data.moderators.forEach((moderatorId: string) => {
          queryClient.invalidateQueries({ queryKey: ['user', moderatorId] })
        })
      }

      onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error adding moderators:', error)
      onError?.(error)
    },
    mutationKey: ['add-moderators'],
  })

  return mutation
}

/**
 * Hook para remover moderadores de una estación
 */
export function useRemoveModerators(
  onSuccess?: (data?: ApiResponse) => void,
  onError?: (error: any) => void
) {
  const stationService = StationService.getInstance()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      stationId,
      moderators,
    }: {
      stationId: string
      moderators: string[]
    }) => {
      const response = await stationService.RemoveModerators(
        stationId,
        moderators
      )
      return response
    },
    onSuccess: (data, variables) => {
      // Invalidate station-related queries to refresh moderators list
      queryClient.invalidateQueries({ queryKey: ['stations'] })
      queryClient.invalidateQueries({
        queryKey: ['station', variables.stationId],
      })
      queryClient.invalidateQueries({ queryKey: ['stations', 'creator'] })

      // Refrescar datos de usuarios después de eliminar moderadores
      queryClient.invalidateQueries({ queryKey: ['users'] })

      // Invalidar datos específicos de los usuarios que fueron removidos
      variables.moderators.forEach((moderatorId: string) => {
        queryClient.invalidateQueries({ queryKey: ['user', moderatorId] })
      })

      onSuccess?.(data)
    },
    onError: (error) => {
      console.error('Error removing moderators:', error)
      onError?.(error)
    },
    mutationKey: ['remove-moderators'],
  })

  return mutation
}

/**
 * Hook combinado para gestión de moderadores
 * Incluye ambas funciones (agregar y remover) en un solo hook
 */
export function useModeratorsManagement() {
  const addModerators = useAddModerators()
  const removeModerators = useRemoveModerators()

  return {
    addModerators,
    removeModerators,
    isLoading: addModerators.isPending || removeModerators.isPending,
    isError: addModerators.isError || removeModerators.isError,
    error: (addModerators.error as unknown) || (removeModerators.error as unknown),
  }
}
