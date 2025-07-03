import { useLayoutEffect, useRef } from 'react'
import { IconMaximize } from '@tabler/icons-react'
import { Skeleton } from "@/components/ui/skeleton"
import { getUserColor } from '@/lib/utils/chatUserHighlight'
import { useStationChat } from '@/hooks'

interface ChatWindowProps {
  stationId: string
  ownerId: string
  stationName: string
  readonly?: boolean
}

export function ChatWindow({ stationId, ownerId, stationName, readonly = false }: ChatWindowProps) {
  const { chatMessages, isLoadingChat, userIdToName } = useStationChat(stationId, ownerId)
  const chatContainerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className='flex h-full flex-col bg-card border rounded-xs shadow-md'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-zinc-200 p-3 dark:border-zinc-800'>
        <div className="flex flex-col">
          <h2 className='text-sm font-bold tracking-tight'>Stream chat</h2>
          <p className='text-xs text-muted-foreground'>{stationName}</p>
        </div>
        {!readonly && (
          <button
            className='hover:bg-accent rounded-sm p-1'
            onClick={() => window.close()}
            title="Close window"
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
              <div key={i} className="flex items-start gap-2 mb-2">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-52 rounded flex-1" />
              </div>
            ))}
          </>
        ) : (
          <>
            {chatMessages.length > 0 ? (
              chatMessages.map((msg, i) => (
                <div key={i} className='flex items-start gap-2 text-sm leading-snug'>
                  <span
                    className='font-bold shrink-0'
                    style={{ color: getUserColor(userIdToName[msg.userId]) }}
                  >
                    {userIdToName[msg.userId]}:
                  </span>
                  <span className='text-zinc-700 dark:text-zinc-200 break-words'>
                    {msg.message}
                  </span>
                </div>
              ))
            ) : (
              <div className='pb-4 text-center text-sm text-zinc-500'>
                <h3 className='font-medium mb-1.5 text-zinc-700 dark:text-zinc-400'>
                  {stationName}
                </h3>
                <span>Welcome! Chat activity will appear here.</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
