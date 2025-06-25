import { createFileRoute } from '@tanstack/react-router'
import ListenerPanel from '@/features/listener'

export const Route = createFileRoute('/_authenticated/app/radio')({
  component: RadioPage,
})

function RadioPage() {
  return <ListenerPanel />
}
