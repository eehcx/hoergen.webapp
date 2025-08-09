import { useState, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { IconPlayerPlay, IconPlayerPause, IconChevronDown } from '@tabler/icons-react'
import { useAuth } from '@/hooks'
import { useUserHistory } from '@/hooks/history/useHistory'
import { useGenreNames } from '@/hooks/genres/useGenreNames'
import { useMiniPlayer } from '@/context/mini-player-context'
import { StationService } from '@/core/services'
import type { HistoryResponse, ResponseStationDto } from '@/core/types'

interface HistoryStationItem {
  historyEntry: HistoryResponse
  station: ResponseStationDto | null
  isLoading: boolean
}

// Componente helper para obtener nombres de géneros
function GenreNamesDisplay({ station }: { station: ResponseStationDto | null }) {
  const genreNames = useGenreNames(station?.genreIds, station?.ownerId)
  
  if (!station?.genreIds?.length) {
    return <Badge variant="secondary" className="text-xs">No genres</Badge>
  }
  
  if (station.ownerId === 'radiobrowser') {
    // Para radio-browser, mostrar los tags directamente
    const displayGenres = station.genreIds.slice(0, 2).join(', ')
    return <Badge variant="secondary" className="text-xs">{displayGenres}</Badge>
  }
  
  if (genreNames === undefined) {
    // Loading state
    return <Skeleton className="h-5 w-[60px]" />
  }
  
  if (genreNames === null) {
    // Error state
    return <Badge variant="secondary" className="text-xs">Error loading genres</Badge>
  }
  
  // Success state with genre names
  const displayNames = genreNames.slice(0, 2).join(', ')
  return <Badge variant="secondary" className="text-xs">{displayNames}</Badge>
}

export default function History() {
  const { user } = useAuth()
  const { play, pause, player } = useMiniPlayer()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'recent' | 'az'>('recent')

  // Get user history using the hook
  const { data: historyData, isLoading: isLoadingHistory, error } = useUserHistory(user?.uid || '')

  // Sort history by lastPlayedAt (most recent first)
  const sortedHistory = useMemo(() => {
    if (!historyData) return []
    
    return [...historyData].sort((a, b) => {
      const dateA = typeof a.lastPlayedAt === 'string'
        ? new Date(a.lastPlayedAt).getTime()
        : a.lastPlayedAt._seconds * 1000
      const dateB = typeof b.lastPlayedAt === 'string'
        ? new Date(b.lastPlayedAt).getTime()
        : b.lastPlayedAt._seconds * 1000
      return dateB - dateA
    })
  }, [historyData])

  // Get unique station IDs for fetching station details
  const uniqueStationIds = useMemo(() => {
    return Array.from(new Set(sortedHistory.map(h => h.stationId)))
  }, [sortedHistory])

  // Fetch station details for all unique stations
  const stationQueries = useQueries({
    queries: uniqueStationIds.map(stationId => ({
      queryKey: ['station', stationId],
      queryFn: async () => {
        const stationService = StationService.getInstance()
        try {
          return await stationService.getStationById(stationId)
        } catch (error) {
          console.error(`Failed to fetch station ${stationId}:`, error)
          return null
        }
      },
      enabled: !!stationId,
      staleTime: 1000 * 60 * 10, // 10 minutes
    }))
  })

  // Combine history entries with their corresponding station data
  const historyItems: HistoryStationItem[] = useMemo(() => {
    return sortedHistory.map(historyEntry => {
      const stationIndex = uniqueStationIds.indexOf(historyEntry.stationId)
      const stationQuery = stationQueries[stationIndex]
      
      return {
        historyEntry,
        station: stationQuery?.data || null,
        isLoading: stationQuery?.isLoading || false
      }
    })
  }, [sortedHistory, uniqueStationIds, stationQueries])

  function formatPlayedAt(lastPlayedAt: HistoryResponse['lastPlayedAt']) {
    try {
      let date: Date
      if (typeof lastPlayedAt === 'string') {
        date = new Date(lastPlayedAt)
      } else {
        date = new Date(lastPlayedAt._seconds * 1000)
      }
      
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60)
        return minutes <= 0 ? 'Just now' : `${minutes}m ago`
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`
      } else if (diffInHours < 24 * 7) {
        const days = Math.floor(diffInHours / 24)
        return `${days}d ago`
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        })
      }
    } catch (error) {
      return 'Unknown'
    }
  }

  const handlePlayStation = (station: ResponseStationDto) => {
    const isCurrentStationPlaying = player?.station?.id === station.id && player?.isPlaying
    
    if (isCurrentStationPlaying) {
      pause()
    } else {
      play({ station })
    }
  }

  const isStationPlaying = (station: ResponseStationDto | null) => {
    return player?.station?.id === station?.id && player?.isPlaying
  }

  // Filter and sort the items
  const filteredItems = historyItems.filter(item =>
    !search || 
    item.station?.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.station?.id?.toLowerCase().includes(search.toLowerCase())
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sort === 'recent') {
      const dateA = typeof a.historyEntry.lastPlayedAt === 'string' 
        ? new Date(a.historyEntry.lastPlayedAt).getTime() 
        : a.historyEntry.lastPlayedAt._seconds * 1000
      const dateB = typeof b.historyEntry.lastPlayedAt === 'string' 
        ? new Date(b.historyEntry.lastPlayedAt).getTime() 
        : b.historyEntry.lastPlayedAt._seconds * 1000
      return dateB - dateA
    }
    if (sort === 'az') {
      return (a.station?.name || '').localeCompare(b.station?.name || '')
    }
    return 0
  })

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <IconChevronDown className="h-4 w-4" />
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSort('recent')}>Most Recent</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('az')}>A-Z</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Input 
          placeholder="Search listening history..." 
          className="max-w-xs" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>

      <Card className='rounded-none'>
        <CardHeader>
          <CardTitle>Listening History</CardTitle>
          <CardDescription>
            Stations you've listened to recently
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-[80px]" />
                      <Skeleton className="h-3 w-[60px]" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-[100px]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Failed to load listening history. Please try again.
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {search ? 'No stations found matching your search.' : 'No listening history found.'}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedItems.map((item) => (
                <div
                  key={item.historyEntry.id}
                  className="flex items-center justify-between p-4 rounded-none border hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    {item.isLoading ? (
                      <>
                        <Skeleton className="h-4 w-[200px]" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-[60px]" />
                          <Skeleton className="h-3 w-[50px]" />
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="text-sm font-medium leading-none truncate">
                          {item.station?.name || 'Unknown Station'}
                        </h4>
                        <div className="flex items-center gap-2">
                          <GenreNamesDisplay station={item.station} />
                          <span className="text-xs text-muted-foreground">
                            {formatPlayedAt(item.historyEntry.lastPlayedAt)}
                          </span>
                        </div>
                        {item.station?.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {item.station.description}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <Button 
                      size="sm" 
                      disabled={item.isLoading || !item.station?.streamUrl}
                      onClick={() => item.station && handlePlayStation(item.station)}
                      className='bg-primary hover:bg-primary/90 text-primary-foreground'
                    >
                      {isStationPlaying(item.station) ? (
                        <IconPlayerPause className="h-4 w-4 mr-2" fill="currentColor" />
                      ) : (
                        <IconPlayerPlay className="h-4 w-4 mr-2" fill="currentColor" />
                      )}
                      {isStationPlaying(item.station) ? 'Pause' : 'Play'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
