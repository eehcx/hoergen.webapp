import { useQuery } from '@tanstack/react-query'
import { ChatService } from '@/core/services/chats/chat.service'

interface ModerationAnalytics {
  totalMessages: number
  messagesWithModeration: number
  averageScores: {
    IDENTITY_ATTACK: number
    INSULT: number
    PROFANITY: number
    SEVERE_TOXICITY: number
    THREAT: number
    TOXICITY: number
  }
  percentageWithModeration: number
  stateDistribution: {
    approved: number
    pending: number
    hidden: number
    deleted: number
  }
  flaggedBySystemCount: number
  reviewedCount: number
  totalChats: number
  chatsWithMessages: number
  averageMessagesPerChat: number
}

export function useChatsPlatformAnalytics() {
  return useQuery<ModerationAnalytics>({
    queryKey: ['chatsPlatformAnalytics'],
    queryFn: async () => {
      const chatService = ChatService.getInstance()
      const analytics = await chatService.getChatsPlatformAnalytics()
      return analytics
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
