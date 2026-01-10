import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChatService } from '@/core/services'
import { toast } from 'sonner'

const chatService = ChatService.getInstance()

interface DeleteMessageParams {
    chatId: string
    messageId: string
}

/**
* Hook para eliminar un mensaje del chat
* @returns Mutación para eliminar mensaje con manejo de errores y notificaciones
*/
export function useDeleteMessage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ chatId, messageId }: DeleteMessageParams) => {
            const response = await chatService.deleteMessage(chatId, messageId)
            return response
        },
        onSuccess: (_, variables) => {
        // Invalidar queries relacionadas con el chat para refrescar los datos
        queryClient.invalidateQueries({
            queryKey: ['chat', variables.chatId]
        })
        
        // Mostrar notificación de éxito
        toast.success('Message deleted successfully')
        },
        onError: (error: any) => {
            // Mostrar notificación de error
            const errorMessage = error?.message || 'Failed to delete message'
            toast.error(errorMessage)
            console.error('Error deleting message:', error)
        }
    })
}

/**
* Hook para eliminar un chat completo
* @returns Mutación para eliminar chat con manejo de errores y notificaciones
*/
export function useDeleteChat() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (chatId: string) => {
            const response = await chatService.deleteChat(chatId)
            return response
        },
        onSuccess: () => {
            // Invalidar queries relacionadas con chats
            queryClient.invalidateQueries({
                queryKey: ['chat']
            })
            
            // Mostrar notificación de éxito
            toast.success('Chat deleted successfully')
        },
        onError: (error: any) => {
            // Mostrar notificación de error
            const errorMessage = error?.message || 'Failed to delete chat'
            toast.error(errorMessage)
            console.error('Error deleting chat:', error)
        }
    })
}