import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/browse')({
  component: BrowsePage,
})

function BrowsePage() {
  return (
    <div className="container space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Browse</h1>
        <p className="text-muted-foreground">
          Discover new music and radio stations
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6 hover:bg-muted/30 transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Genres</h3>
          <p className="text-sm text-muted-foreground">Browse by music genre</p>
        </div>
        
        <div className="rounded-lg border p-6 hover:bg-muted/30 transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Countries</h3>
          <p className="text-sm text-muted-foreground">Explore radio from around the world</p>
        </div>
        
        <div className="rounded-lg border p-6 hover:bg-muted/30 transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Top Stations</h3>
          <p className="text-sm text-muted-foreground">Most popular radio stations</p>
        </div>
        
        <div className="rounded-lg border p-6 hover:bg-muted/30 transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">New Releases</h3>
          <p className="text-sm text-muted-foreground">Latest stations and content</p>
        </div>
        
        <div className="rounded-lg border p-6 hover:bg-muted/30 transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Trending</h3>
          <p className="text-sm text-muted-foreground">What's popular right now</p>
        </div>
        
        <div className="rounded-lg border p-6 hover:bg-muted/30 transition-colors cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Live Shows</h3>
          <p className="text-sm text-muted-foreground">Currently broadcasting</p>
        </div>
      </div>
    </div>
  )
}
