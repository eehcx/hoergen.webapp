import { createFileRoute } from "@tanstack/react-router"
import ListenerPanel from "@/features/listener"

export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="container space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Now Playing</h1>
        <p className="text-muted-foreground">
          Discover and listen to your favorite radio stations
        </p>
      </div>
      <ListenerPanel />
    </div>
  )
}
