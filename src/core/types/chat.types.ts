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
  userId: string  // Required
  message: string // Required
}

export interface ChatResponseDto {
    id: string
    stationId: string
    createdAt: string
    updatedAt: string
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
    createdAt: Date
    moderationResult: ModerationResult
}

export interface ChatSubscription {
    unsubscribe: () => void
    chatId: string
}
