import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { IconBell, IconBellOff, IconUserPlus, IconUsers, IconPlayerPlay } from '@tabler/icons-react'

export const Route = createFileRoute('/_authenticated/library/following')({
  component: FollowingPage,
})

function FollowingPage() {
  // Sample data for subscriptions
  const subscriptions = [
    {
      id: 1,
      creatorName: 'Carlos López',
      creatorHandle: '@carloslopez',
      stations: 3,
      followers: 1204,
      isLive: true,
      subscribedAt: '2024-01-10',
      recentStation: 'Jazz Corner',
      notificationsEnabled: true
    },
    {
      id: 2,
      creatorName: 'Ana García',
      creatorHandle: '@anagarcia',
      stations: 2,
      followers: 856,
      isLive: false,
      subscribedAt: '2024-01-08',
      recentStation: 'Chill Vibes FM',
      notificationsEnabled: true
    },
    {
      id: 3,
      creatorName: 'Miguel Rodríguez',
      creatorHandle: '@miguelrock',
      stations: 5,
      followers: 2341,
      isLive: false,
      subscribedAt: '2024-01-05',
      recentStation: 'Rock Classics',
      notificationsEnabled: false
    }
  ]

  return (
    <>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Following</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
            <p className="text-xs text-muted-foreground">Creadores seguidos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Vivo</CardTitle>
            <IconPlayerPlay className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions.filter(s => s.isLive).length}
            </div>
            <p className="text-xs text-muted-foreground">Transmitiendo ahora</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
            <IconBell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions.filter(s => s.notificationsEnabled).length}
            </div>
            <p className="text-xs text-muted-foreground">Activadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Following List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Following</h3>
          <Button>
            <IconUserPlus className="h-4 w-4 mr-2" />
            Find creators
          </Button>
        </div>
        
        <div className="space-y-4">
          {subscriptions.map((creator) => (
            <Card key={creator.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-lg font-semibold">
                        {creator.creatorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-semibold">{creator.creatorName}</h4>
                        {creator.isLive && (
                          <Badge variant="destructive" className="text-xs">EN VIVO</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{creator.creatorHandle}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{creator.stations} stations</span>
                        <span>{creator.followers.toLocaleString()} followers</span>
                      </div>
                      {creator.recentStation && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Latest:</span>{' '}
                          <span className="font-medium">{creator.recentStation}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className={creator.notificationsEnabled ? 'text-blue-500' : 'text-muted-foreground'}
                    >
                      {creator.notificationsEnabled ? (
                        <IconBell className="h-4 w-4" />
                      ) : (
                        <IconBellOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button>Visit profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
