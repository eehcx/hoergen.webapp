import { useQuery } from '@tanstack/react-query'
import { stationService } from '@/core/services'
import { ChatService } from '@/core/services/chats/chat.service'
import { ChatAnalyticsResponse } from '@/core/types'

export function useStationBySlug(slug: string) {
  return useQuery({
    queryKey: ['stationBySlug', slug],
    queryFn: async () => {
      const stations = await stationService.getStationsBySlug(slug)
      return stations
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

export function useAnalyticsByStation(stationId: string) {
  return useQuery({
    queryKey: ['analytics', stationId],
    queryFn: async () => {
      const analytics = await stationService.getAnalyticsByStationId(stationId)
      return analytics
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}

export function useChatAnalytics(chatId: string | null) {
  return useQuery<ChatAnalyticsResponse | null>({
    queryKey: ['chatAnalytics', chatId],
    queryFn: async () => {
      if (!chatId) return null
      const chatService = ChatService.getInstance()
      const analytics = await chatService.getChatAnalyticsById(chatId)
      return analytics
    },
    enabled: !!chatId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
