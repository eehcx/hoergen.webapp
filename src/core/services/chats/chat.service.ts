import { db } from '@/core/firebase'
import {
  CreateChatDto,
  AddMessageDto,
  ChatResponseDto,
  MessageResponseDto,
  ApiResponse,
  ChatAnalyticsResponse,
} from '@/core/types'
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  addDoc,
  setDoc,
  doc,
  //deleteDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { BaseService } from '../base.service'

/**
 * Chat Service - Manages all chat-related API operations with real-time Firebase integration
 * Adapted from React Native version to web with singleton pattern
 */
export class ChatService extends BaseService {
  private static instance: ChatService
  private readonly CHATS_COLLECTION = 'chats'
  private readonly MESSAGES_SUBCOLLECTION = 'messages'

  private constructor() {
    super()
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService()
    }
    return ChatService.instance
  }

  // ===== REST API METHODS =====

  /**
   * Create a new chat with first message
   */
  async createChat(data: CreateChatDto): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/chats', data)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Add message to chat via REST API
   */
  async addMessage(chatId: string, data: AddMessageDto): Promise<ApiResponse> {
    try {
      const response = await this.api.post(`/chats/${chatId}/messages`, data)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Delete entire chat
   */
  async deleteChat(chatId: string): Promise<ApiResponse> {
    try {
      const response = await this.api.delete(`/chats/${chatId}/messages`)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Delete specific message
   */
  async deleteMessage(chatId: string, messageId: string): Promise<ApiResponse> {
    try {
      const response = await this.api.delete(
        `/chats/${chatId}/messages/${messageId}`
      )
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Clear all messages from a chat (delete all messages in Firestore)
   * @param chatId - Chat ID to clear
   * @returns Promise<void>
   */
  async clearChat(chatId: string): Promise<void> {
    try {
      console.log(`🧹 Clearing all messages from chat: ${chatId}`)

      // Get all messages in the chat
      const messagesRef = collection(
        db,
        this.CHATS_COLLECTION,
        chatId,
        this.MESSAGES_SUBCOLLECTION
      )

      const messagesQuery = query(messagesRef)
      const snapshot = await getDocs(messagesQuery)

      if (snapshot.empty) {
        console.log('No messages to delete')
        return
      }

      // Use batch to delete all messages at once (max 500 per batch)
      const batch = writeBatch(db)
      let operationCount = 0

      snapshot.forEach((doc) => {
        if (operationCount < 500) {
          batch.delete(doc.ref)
          operationCount++
        }
      })

      await batch.commit()
      console.log(
        `✅ Successfully cleared ${operationCount} messages from chat: ${chatId}`
      )

      // If there were more than 500 messages, recursively clear the rest
      if (snapshot.size >= 500) {
        await this.clearChat(chatId)
      }
    } catch (error: any) {
      console.error('❌ Error clearing chat:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        chatId,
      })
      throw error
    }
  }

  // ===== FIREBASE REALTIME METHODS =====

  /**
   * Get chat ID for a station
   * @param stationId - Station ID to search for
   * @returns Promise<string | null> - Returns chat ID if exists, null otherwise
   */
  async getChatIdByStationId(stationId: string): Promise<string | null> {
    try {
      console.log(`Searching for chat with stationId: ${stationId}`)

      const chatsRef = collection(db, this.CHATS_COLLECTION)
      const q = query(chatsRef, where('stationId', '==', stationId))
      const snapshot = await getDocs(q)

      console.log(`Found ${snapshot.size} chats for station ${stationId}`)

      if (!snapshot.empty) {
        const chatId = snapshot.docs[0].id
        console.log(`Found chat ID: ${chatId}`)
        return chatId
      } else {
        console.log(`No chat found for stationId: ${stationId}`)
        return null
      }
    } catch (error) {
      console.error(`Error checking chat for station ${stationId}:`, error)
      return null
    }
  }

  /**
   * Subscribe to chat messages in real time
   * @param chatId - Chat ID to get messages from
   * @param onMessagesUpdate - Callback for messages updates
   * @returns Unsubscribe function
   */
  subscribeToMessages(
    chatId: string,
    onMessagesUpdate: (messages: MessageResponseDto[]) => void
  ): () => void {
    console.log(`Subscribing to messages for chat: ${chatId}`)

    const messagesRef = collection(
      db,
      this.CHATS_COLLECTION,
      chatId,
      this.MESSAGES_SUBCOLLECTION
    )
    const q = query(messagesRef, orderBy('timestamp', 'asc'))

    return onSnapshot(
      q,
      (snapshot) => {
        console.log(`Messages snapshot received: ${snapshot.size} messages`)
        const messages: MessageResponseDto[] = []

        snapshot.forEach((doc) => {
          const data = doc.data()

          // Debug: Log data structure for first message
          if (messages.length === 0 && data.moderationResult) {
            console.log('🛡️ Found moderationResult in Firestore data:', {
              docId: doc.id,
              moderationResult: data.moderationResult,
              hasModeration: !!data.moderationResult,
            })
          }

          messages.push({
            id: doc.id,
            userId: data.userId,
            message: data.message,
            timestamp: data.timestamp?.toDate() || new Date(),
            moderationResult: data.moderationResult || undefined,
            isModerated: data.isModerated || false,
          })
        })

        onMessagesUpdate(messages)
      },
      (error) => {
        console.error(`Error listening to chat messages for ${chatId}:`, error)
      }
    )
  }

  /**
   * Send message directly to Firestore (for real-time updates)
   * @param chatId - Chat ID
   * @param messageData - Message data
   * @returns Promise<void>
   */
  async sendMessageToFirestore(
    chatId: string,
    messageData: AddMessageDto
  ): Promise<void> {
    try {
      const messagesRef = collection(
        db,
        this.CHATS_COLLECTION,
        chatId,
        this.MESSAGES_SUBCOLLECTION
      )

      await addDoc(messagesRef, {
        ...messageData,
        timestamp: serverTimestamp(),
      })

      console.log(`Message sent to chat ${chatId}`)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to send message to Firestore: ${errorMessage}`)
    }
  }

  // ===== ADDITIONAL CONVENIENCE METHODS =====

  /**
   * Get chats by station (REST API method)
   */
  async getChatsByStation(stationId: string): Promise<ChatResponseDto[]> {
    try {
      const response = await this.api.get(`/chats?stationId=${stationId}`)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get chat by ID (REST API method)
   */
  async getChatById(chatId: string): Promise<ChatResponseDto> {
    try {
      const response = await this.api.get(`/chats/${chatId}`)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get recent messages from chat (REST API method with limit)
   */
  async getRecentMessages(
    chatId: string,
    limit: number = 50
  ): Promise<MessageResponseDto[]> {
    try {
      const response = await this.api.get(
        `/chats/${chatId}/messages?limit=${limit}`
      )
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Combined method: Create chat if it doesn't exist, then return chat ID
   */
  async getOrCreateChatForStation(
    stationId: string,
    firstMessage: { userId: string; message: string }
  ): Promise<string> {
    try {
      // First try to find existing chat
      let chatId = await this.getChatIdByStationId(stationId)

      if (!chatId) {
        // Create new chat if it doesn't exist
        console.log(`Creating new chat for station: ${stationId}`)
        await this.createChat({
          stationId,
          firstMessage,
        })

        // Get the newly created chat ID
        chatId = await this.getChatIdByStationId(stationId)

        if (!chatId) {
          throw new Error('Failed to create or retrieve chat')
        }
      }

      return chatId
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      throw new Error(
        `Failed to get or create chat for station: ${errorMessage}`
      )
    }
  }

  // ===== EPHEMERAL CHATS METHODS =====

  async createEphemeralChat(stationuuid: string): Promise<string> {
    try {
      //console.log('🔍 Getting/creating ephemeral chat for:', stationuuid)

      // ID determinístico - SIEMPRE el mismo para cada estación
      const chatId = `radiobrowser-${stationuuid}`

      // Crear o actualizar el documento (idempotente)
      const chatDocRef = doc(db, this.CHATS_COLLECTION, chatId)
      await setDoc(
        chatDocRef,
        {
          stationId: stationuuid,
          createdAt: serverTimestamp(),
          isEphemeral: true,
          source: 'radiobrowser', // Para identificar fácilmente
        },
        { merge: true }
      ) // ✅ merge: true = no sobreescribe si ya existe

      //console.log('✅ Ephemeral chat ready:', chatId)
      return chatId
    } catch (error: any) {
      console.error('❌ Error in getOrCreateEphemeralChat:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stationuuid,
      })
      throw error
    }
  }

  async getChatsPlatformAnalytics(): Promise<any> {
    try {
      const response = await this.api.get('/chats/analytics/platform')
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getChatAnalyticsById(chatId: string): Promise<ChatAnalyticsResponse> {
    try {
      const response = await this.api.get(`/chats/analytics/chat/${chatId}`)
      return response.data
    } catch (error) {
      return this.handleError(error)
    }
  }
}
