import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { IconSearch } from '@tabler/icons-react'

export const Route = createFileRoute('/_authenticated/app/search')({
  component: SearchPage,
})

function SearchPage() {
  return (
    <div className="container space-y-6 p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Search</h1>
          <p className="text-muted-foreground">
            Find your favorite artists, stations, and genres
          </p>
        </div>
        
        <div className="relative max-w-md">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for stations, artists, genres..."
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Browse Categories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 p-6">
            <h3 className="text-lg font-semibold text-white">Rock</h3>
          </div>
          
          <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6">
            <h3 className="text-lg font-semibold text-white">Pop</h3>
          </div>
          
          <div className="rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 p-6">
            <h3 className="text-lg font-semibold text-white">Jazz</h3>
          </div>
          
          <div className="rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6">
            <h3 className="text-lg font-semibold text-white">Electronic</h3>
          </div>
          
          <div className="rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6">
            <h3 className="text-lg font-semibold text-white">Hip Hop</h3>
          </div>
          
          <div className="rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/20 p-6">
            <h3 className="text-lg font-semibold text-white">Indie</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
