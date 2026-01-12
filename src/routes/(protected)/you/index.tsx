import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/you/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/you/"!</div>
}
