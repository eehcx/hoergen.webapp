import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/moderation/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/a/moderation/"!</div>
}
