import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/library')({
  component: LibraryLayout,
})

function LibraryLayout() {
  return (
    <div className="container space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Library</h1>
        <p className="text-muted-foreground">
          Your favorite stations, history, and subscriptions
        </p>
      </div>
      
      <div className="grid gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Access</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-4 hover:bg-muted/30 transition-colors cursor-pointer">
              <h3 className="font-medium mb-1">Favorites</h3>
              <p className="text-xs text-muted-foreground">Your liked stations</p>
            </div>
            
            <div className="rounded-lg border p-4 hover:bg-muted/30 transition-colors cursor-pointer">
              <h3 className="font-medium mb-1">History</h3>
              <p className="text-xs text-muted-foreground">Recently played</p>
            </div>
            
            <div className="rounded-lg border p-4 hover:bg-muted/30 transition-colors cursor-pointer">
              <h3 className="font-medium mb-1">Following</h3>
              <p className="text-xs text-muted-foreground">Your subscriptions</p>
            </div>
            
            <div className="rounded-lg border p-4 hover:bg-muted/30 transition-colors cursor-pointer">
              <h3 className="font-medium mb-1">Downloads</h3>
              <p className="text-xs text-muted-foreground">Offline content</p>
            </div>
          </div>
        </div>
      </div>
      
      <Outlet />
    </div>
  )
}
