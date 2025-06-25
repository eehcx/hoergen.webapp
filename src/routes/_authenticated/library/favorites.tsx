import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconPlayerPlay, IconHeart, IconShare, IconUsers, IconHeartOff } from '@tabler/icons-react'

export const Route = createFileRoute('/_authenticated/library/favorites')({
  component: FavoritesPage,
})

function FavoritesPage() {
  // Sample data for favorites
  const favoriteStations = [
    {
      id: 1,
      name: 'Jazz Corner',
      creator: 'Carlos López',
      genre: 'Jazz',
      listeners: 1204,
      isLive: true,
      description: 'Los mejores clásicos del jazz moderno',
      addedAt: '2024-01-10'
    },
    {
      id: 2,
      name: 'Chill Vibes FM',
      creator: 'Ana García',
      genre: 'Chill/Lounge',
      listeners: 856,
      isLive: false,
      description: 'Relaxing music for concentration',
      addedAt: '2024-01-08'
    },
    {
      id: 3,
      name: 'Indie Underground',
      creator: 'Laura Martín',
      genre: 'Indie',
      listeners: 345,
      isLive: true,
      description: 'Descubre artistas independientes emergentes',
      addedAt: '2024-01-05'
    }
  ]

  return (
    <>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Favorites</CardTitle>
            <IconHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoriteStations.length}</div>
            <p className="text-xs text-muted-foreground">Saved stations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Vivo</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {favoriteStations.filter(s => s.isLive).length}
            </div>
            <p className="text-xs text-muted-foreground">Streaming now</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Géneros</CardTitle>
            <IconShare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(favoriteStations.map(s => s.genre)).size}
            </div>
            <p className="text-xs text-muted-foreground">Diferentes géneros</p>
          </CardContent>
        </Card>
      </div>

      {/* Favorites Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your Favorite Stations</h3>
          <Button variant="outline" size="sm">
            Compartir lista
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favoriteStations.map((station) => (
            <Card key={station.id} className="group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {station.name}
                      {station.isLive && (
                        <Badge variant="destructive" className="text-xs">EN VIVO</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>por {station.creator}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{station.listeners.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">oyentes</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{station.genre}</Badge>
                  <span className="text-xs text-muted-foreground">
                    Agregado el {new Date(station.addedAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {station.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <Button className="flex-1">
                    <IconPlayerPlay className="h-4 w-4 mr-2" />
                    Reproducir
                  </Button>
                  <Button size="icon" variant="outline" className="text-red-500 hover:text-red-600">
                    <IconHeartOff className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <IconShare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
