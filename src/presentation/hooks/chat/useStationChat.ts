import { useEffect, useState, useRef } from 'react'
import { useQueries } from '@tanstack/react-query'
import { MessageResponseDto } from '@/core/types'
import { ChatService } from '@/core/services'
import { UserService } from '@/core/services'

const chatService = ChatService.getInstance()

export function useStationChat(stationId: string, ownerId: string) {
  const [chatMessages, setChatMessages] = useState<MessageResponseDto[]>([])
  const [chatId, setChatId] = useState<string | null>(null)
  const unsubscribeRef = useRef<() => void>(undefined)

  useEffect(() => {
    let isMounted = true

    async function setupChat() {
      // Limpia suscripción anterior si existe
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = undefined
      }

      let id: string | null = null
      if (ownerId === 'radiobrowser') {
        id = await chatService.createEphemeralChat(stationId)
      } else {
        id = await chatService.getChatIdByStationId(stationId)
      }

      if (!isMounted) return
      setChatId(id)

      if (id) {
        unsubscribeRef.current = chatService.subscribeToMessages(
          id,
          (messages) => {
            if (isMounted) setChatMessages(messages)
          }
        )
      }
    }

    setupChat()

    return () => {
      isMounted = false
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = undefined
      }
    }
  }, [stationId, ownerId])

  // Obtener nombres de usuarios únicos
  const uniqueUserIds = Array.from(new Set(chatMessages.map(m => m.userId)))

  const userQueries = useQueries({
    queries: uniqueUserIds.map(userId => ({
      queryKey: ['userName', userId],
      queryFn: async () => {
        const userService = UserService.getInstance()
        const user = await userService.getUserById(userId)
        return user.displayName || 'Anónimo'
      },
      enabled: !!userId,
      staleTime: 1000 * 60 * 10,
    }))
  })

  const userIdToName = Object.fromEntries(
    uniqueUserIds.map((id, idx) => [id, userQueries[idx].data || id])
  )

  const isLoadingMessages = chatMessages === null || chatMessages === undefined
  const isLoadingNames = userQueries.some(q => q.isLoading)
  const isLoadingChat = isLoadingMessages || isLoadingNames

  return {
    chatMessages,
    chatId,
    userIdToName,
    isLoadingChat
  }
}
