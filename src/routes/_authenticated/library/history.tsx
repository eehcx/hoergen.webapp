import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconPlayerPlay, IconClock, IconCalendar } from '@tabler/icons-react'

export const Route = createFileRoute('/_authenticated/library/history')({
  component: HistoryPage,
})

function HistoryPage() {
  // Sample data for history
  const historyItems = [
    {
      id: 1,
      stationName: 'Jazz Corner',
      creator: 'Carlos López',
      genre: 'Jazz',
      playedAt: '2024-01-15 14:30',
      duration: '1h 15m'
    },
    {
      id: 2,
      stationName: 'Chill Vibes FM',
      creator: 'Ana García',
      genre: 'Chill/Lounge',
      playedAt: '2024-01-15 10:45',
      duration: '45m'
    },
    {
      id: 3,
      stationName: 'Rock Classics',
      creator: 'Miguel Rodríguez',
      genre: 'Rock',
      playedAt: '2024-01-14 20:15',
      duration: '2h 30m'
    },
    {
      id: 4,
      stationName: 'Electronic Pulse',
      creator: 'DJ Alex',
      genre: 'Electronic',
      playedAt: '2024-01-14 16:00',
      duration: '1h 5m'
    }
  ]

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Escuchado</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5h</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stations Visited</CardTitle>
            <IconPlayerPlay className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Different stations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent History</CardTitle>
          <CardDescription>
            The stations you've listened to in recent days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">{item.stationName}</h4>
                  <p className="text-sm text-muted-foreground">por {item.creator}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{item.genre}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.playedAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{item.duration}</div>
                    <div className="text-xs text-muted-foreground">duration</div>
                  </div>
                  <Button size="sm">
                    <IconPlayerPlay className="h-4 w-4 mr-2" />
                    Reproducir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
