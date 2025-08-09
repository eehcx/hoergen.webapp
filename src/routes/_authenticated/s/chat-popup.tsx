import { createFileRoute } from '@tanstack/react-router'
import { ChatWindow } from '@/features/station/components/chat-window'

export const Route = createFileRoute('/_authenticated/s/chat-popup')({
  component: ChatPopupPage,
  validateSearch: (search) => ({
    stationId: search.stationId as string,
    stationName: search.stationName as string,
    ownerId: search.ownerId as string,
  }),
})

function ChatPopupPage() {
  const { stationId, stationName, ownerId } = Route.useSearch()

  return (
    <div className="h-screen">
      <ChatWindow
        stationId={stationId}
        ownerId={ownerId}
        stationName={stationName}
        readonly={true}
      />
    </div>
  )
}
