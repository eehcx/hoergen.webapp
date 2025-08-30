import { useLayoutEffect, useRef, useEffect, useState } from 'react'
import { IconMaximize } from '@tabler/icons-react'
import { MessageResponseDto } from '@/core/types'
import { useStationChat } from '@/hooks'
import { useAuth } from '@/hooks'
import { useStaticTranslation } from '@/hooks/useTranslation'
import { toast } from 'sonner'
import { getUserColor } from '@/lib/utils/chatUserHighlight'
import { usePermissions } from '@/hooks/auth/usePermissions'
import { Skeleton } from '@/components/ui/skeleton'
import { StationService, ChatService } from '@/core/services'
import { useDeleteMessage } from '@/features/station/hooks/useChat'
import { MessageContextMenu } from '@/features/station/components/message-context-menu'

const chatService = ChatService.getInstance()

interface ChatWindowProps {
  stationId: string
  ownerId: string
  stationName: string
  readonly?: boolean
}

export function ChatWindow({
  stationId,
  ownerId,
  stationName,
  readonly = false,
}: ChatWindowProps) {
  const { t } = useStaticTranslation()
  const { chatMessages, isLoadingChat, userIdToName, chatId } = useStationChat(
    stationId,
    ownerId
  )
  const { hasAnyRole, hasRole } = usePermissions()
  const { user } = useAuth()
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Local station moderators list
  const [moderators, setModerators] = useState<string[]>([])

  useEffect(() => {
    let mounted = true
    async function fetchStation() {
      try {
        const station = await StationService.getInstance().getStationById(
          stationId
        )
        if (mounted) setModerators(station.moderators ?? [])
      } catch (err) {
        // Silently ignore; context menu will just not appear for moderators
        console.error('Failed to fetch station for moderators:', err)
      }
    }
    fetchStation()
    return () => {
      mounted = false
    }
  }, [stationId])

  // Function to determine if a message should be blurred based on state
  const shouldBlurMessage = (message: MessageResponseDto): boolean => {
    // Only apply filtering for listener and pro users
    const shouldApplyFilter = hasAnyRole(['listener', 'pro'])
    if (!shouldApplyFilter) return false

    // Check if message state is hidden
    return message.state === 'hidden'
  }

  // Delete message handler
  const deleteMessage = useDeleteMessage()
  const handleDeleteMessage = (messageId: string) => {
    if (!chatId) return
    deleteMessage.mutate({ chatId, messageId })
  }

  // Clear entire chat handler
  const handleClearChat = async () => {
    if (!chatId) return

    try {
      const confirmed = window.confirm(
        t('chatWindow.clearChatConfirm')
      )
      if (!confirmed) return

      await chatService.clearChat(chatId)
      toast.success(t('chatWindow.chatClearedSuccess'))
    } catch (error) {
      console.error('Error clearing chat:', error)
      toast.error(t('chatWindow.chatClearFailed'))
    }
  }

  // Auto-scroll al final cuando hay nuevos mensajes
  useLayoutEffect(() => {
    if (isLoadingChat) return
    const container = chatContainerRef.current
    if (!container) return

    const handle = requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight
    })
    return () => cancelAnimationFrame(handle)
  }, [chatMessages, isLoadingChat])

  // Permission check mirroring Station index.tsx
  const canModerate =
    ((hasAnyRole(['admin', 'creator']) && user?.uid === ownerId) ||
      (hasRole('moderator') && moderators?.includes(user?.uid || '')))

  return (
    <div className='bg-card flex h-full flex-col rounded-xs border shadow-md'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-zinc-200 p-3 dark:border-zinc-800'>
        <div className='flex flex-col'>
          <h2 className='text-sm font-bold tracking-tight'>{t('chatWindow.streamChat')}</h2>
          <p className='text-muted-foreground text-xs'>{stationName}</p>
        </div>
        {!readonly && (
          <button
            className='hover:bg-accent rounded-sm p-1'
            onClick={() => window.close()}
            title={t('chatWindow.closeWindow')}
          >
            <IconMaximize size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        className='flex flex-1 flex-col gap-2 overflow-y-auto p-4'
        ref={chatContainerRef}
      >
        {isLoadingChat ? (
          <>
            {[...Array(15)].map((_, i) => (
              <div key={i} className='mb-2 flex items-start gap-2'>
                <Skeleton className='h-4 w-16 rounded' />
                <Skeleton className='h-4 w-52 flex-1 rounded' />
              </div>
            ))}
          </>
        ) : (
          <>
            {chatMessages.length > 0 ? (
              chatMessages.map((msg, i) => {
                const isBlurred = shouldBlurMessage(msg)

                const messageRow = (
                  <div
                    key={i}
                    className='group flex items-start gap-2 text-sm leading-snug'
                  >
                    <span
                      className='shrink-0 font-bold'
                      style={{ color: getUserColor(userIdToName[msg.userId]) }}
                    >
                      {userIdToName[msg.userId]}:
                    </span>
                    <div className='relative flex-1'>
                      <span
                        className={`block break-words text-zinc-700 transition-all duration-200 dark:text-zinc-200 ${
                          isBlurred ? 'blur-sm hover:blur-none' : ''
                        }`}
                      >
                        {msg.message}
                      </span>
                    </div>
                  </div>
                )

                // Wrap with context menu if user can moderate
                return canModerate && msg.id ? (
                  <MessageContextMenu
                    key={msg.id}
                    messageId={msg.id}
                    message={msg.message}
                    moderationResult={msg.moderationResult}
                    onDelete={() => handleDeleteMessage(msg.id!)}
                    onClearChat={handleClearChat}
                  >
                    {messageRow}
                  </MessageContextMenu>
                ) : (
                  <div key={msg.id ?? i}>{messageRow}</div>
                )
              })
            ) : (
              <div className='pb-4 text-center text-sm text-zinc-500'>
                <h3 className='mb-1.5 font-medium text-zinc-700 dark:text-zinc-400'>
                  {stationName}
                </h3>
                <span>{t('chatWindow.welcome')}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
