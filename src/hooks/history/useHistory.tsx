import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HistoryService } from '@/core/services/history/history.service'
import { CreateHistoryDto } from '@/core/types'
import { toast } from 'sonner'

const historyService = HistoryService.getInstance()

/**
 * Hook para crear un registro de historial
 * @returns Mutación para crear historial con manejo de errores
 */
export function useCreateHistory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateHistoryDto) => {
        await historyService.createHistory(data)
        return data
        },
        onSuccess: (data) => {
        // Invalidar queries relacionadas con el historial del usuario
        queryClient.invalidateQueries({
            queryKey: ['history', data.userId]
        })
        
        // Invalidar query general de historial
        queryClient.invalidateQueries({
            queryKey: ['history']
        })
        },
        onError: (error: any) => {
        // Solo mostrar error en desarrollo o casos críticos
        // En producción, el historial es una funcionalidad secundaria
        console.error('Error creating history:', error)
        
        // Opcional: mostrar toast solo en desarrollo
        if (process.env.NODE_ENV === 'development') {
            const errorMessage = error?.message || 'Failed to save listening history'
            toast.error(errorMessage)
        }
        }
    })
}

/**
 * Hook para obtener el historial de un usuario
 * @param userId - ID del usuario
 * @returns Query con el historial del usuario
 */
export function useUserHistory(userId: string) {
    return useQuery({
        queryKey: ['history', userId],
        queryFn: async () => {
        if (!userId) return []
            return await historyService.getHistoryByUser(userId)
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 30, // 30 minutos
    })
}

/**
 * Hook para eliminar un registro de historial
 * @returns Mutación para eliminar historial
 */
export function useDeleteHistory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (historyId: string) => {
            await historyService.deleteHistory(historyId)
                return historyId
            },
            onSuccess: () => {
            // Invalidar todas las queries de historial
            queryClient.invalidateQueries({
                queryKey: ['history']
            })
            
            toast.success('History entry deleted successfully')
        },
        onError: (error: any) => {
            const errorMessage = error?.message || 'Failed to delete history entry'
            toast.error(errorMessage)
            console.error('Error deleting history:', error)
        }
    })
}
