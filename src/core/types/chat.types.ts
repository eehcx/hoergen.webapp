export type MessageState = 'approved' | 'pending' | 'hidden' | 'deleted'

export interface CreateChatDto {
  stationId: string
  firstMessage: {
    userId: string
    message: string
  }
}

export interface CreateMessageDto {
  userId: string
  message: string
}

export interface AddMessageDto {
  userId: string // Required
  message: string // Required
}

export interface ChatResponseDto {
  id: string
  stationId: string
  createdAt: {
    _seconds: number
    _nanoseconds: number
  }
  updatedAt: {
    _seconds: number
    _nanoseconds: number
  }
}

export interface ModerationResult {
  IDENTITY_ATTACK: number
  INSULT: number
  PROFANITY: number
  SEVERE_TOXICITY: number
  THREAT: number
  TOXICITY: number
}

export interface MessageResponseDto {
  id: string
  userId: string
  message: string
  timestamp: Date
  moderationResult?: ModerationResult
  state?: MessageState
  isModerated?: boolean // Para marcar mensajes que fueron moderados
}

export interface ChatQueryParams {
  stationId?: string
}

export interface Chat {
  id: string
  stationId: string
}

export interface Message {
  id: string
  userId: string
  message: string
  createdAt: {
    _seconds: number
    _nanoseconds: number
  }
  moderationResult: ModerationResult
}

export interface ChatSubscription {
  unsubscribe: () => void
  chatId: string
}

export interface ChatAnalyticsResponse {
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
}
