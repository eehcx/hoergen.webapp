import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { IconPlayerPlay, IconChevronDown } from '@tabler/icons-react'
import { useAuthStore } from '@/stores/authStore'
import { historyService, stationService, radioBrowserService } from '@/core/services'
import type { HistoryResponse } from '@/core/types'

interface HistoryStationItem {
  historyEntry: HistoryResponse
  station: {
    id: string
    name: string
    coverImage?: string
    streamUrl?: string
    description?: string
    genres: string[]
    source: 'firebase' | 'radio-browser' | 'unknown'
  } | null
  isLoading: boolean
}

export default function History() {
  const { user } = useAuthStore()
  const [historyItems, setHistoryItems] = useState<HistoryStationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'recent' | 'az'>('recent')

  useEffect(() => {
    const fetchPlaybackHistory = async () => {
      if (!user?.uid) {
        setHistoryItems([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const historyData = await historyService.getHistoryByUser(user.uid)
        if (!historyData || historyData.length === 0) {
          setHistoryItems([])
          setLoading(false)
          return
        }
        // Sort by playedAt (most recent first)
        const sortedHistory = historyData.sort((a, b) => {
          const dateA = typeof a.playedAt === 'string'
            ? new Date(a.playedAt).getTime()
            : a.playedAt._seconds * 1000
          const dateB = typeof b.playedAt === 'string'
            ? new Date(b.playedAt).getTime()
            : b.playedAt._seconds * 1000
          return dateB - dateA
        })
        // Fetch station details for each history entry
        const historyPromises = sortedHistory.map(async (historyEntry): Promise<HistoryStationItem> => {
          try {
            // Primero intenta en tu backend
            try {
              const firebaseStation = await stationService.getStationById(historyEntry.stationId)
              let genres: string[] = []
              if (firebaseStation.genreIds && firebaseStation.genreIds.length > 0) {
                genres = firebaseStation.genreIds
              }
              return {
                historyEntry,
                station: {
                  id: firebaseStation.id,
                  name: firebaseStation.name,
                  coverImage: firebaseStation.coverImage,
                  streamUrl: firebaseStation.streamUrl,
                  description: firebaseStation.description,
                  genres,
                  source: 'firebase'
                },
                isLoading: false
              }
            } catch (firebaseError) {
              // Si falla, intenta en Radio Browser por UUID
              try {
                // Busca por UUID exacto
                const rbStations = await radioBrowserService.searchStations(historyEntry.stationId, 1)
                const rbStation = rbStations[0]
                if (rbStation) {
                  return {
                    historyEntry,
                    station: {
                      id: rbStation.stationuuid,
                      name: rbStation.name,
                      coverImage: rbStation.favicon,
                      streamUrl: rbStation.url_resolved,
                      description: rbStation.country,
                      genres: rbStation.tags ? rbStation.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                      source: 'radio-browser'
                    },
                    isLoading: false
                  }
                }
              } catch {}
              // Si ambas fallan, placeholder
              return {
                historyEntry,
                station: {
                  id: historyEntry.stationId,
                  name: 'Estación no encontrada',
                  coverImage: '',
                  streamUrl: '',
                  description: 'Esta estación puede que ya no esté disponible',
                  genres: ['Desconocido'],
                  source: 'unknown'
                },
                isLoading: false
              }
            }
          } catch (error) {
            return {
              historyEntry,
              station: null,
              isLoading: false
            }
          }
        })
        const resolvedHistory = await Promise.all(historyPromises)
        setHistoryItems(resolvedHistory.filter(item => item.station !== null))
      } catch (error) {
        setHistoryItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchPlaybackHistory()
  }, [user?.uid])

  function formatPlayedAt(playedAt: HistoryResponse['playedAt']) {
    try {
      let date: Date
      if (typeof playedAt === 'string') {
        date = new Date(playedAt)
      } else {
        date = new Date(playedAt._seconds * 1000)
      }
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60)
        return minutes <= 0 ? 'Justo ahora' : `${minutes}m ago`
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`
      } else if (diffInHours < 24 * 7) {
        const days = Math.floor(diffInHours / 24)
        return `${days}d ago`
      } else {
        return date.toLocaleDateString('es-ES', {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        })
      }
    } catch (error) {
      return 'Desconocido'
    }
  }

  const filtered = historyItems.filter(item =>
    (!search || item.station?.name?.toLowerCase().includes(search.toLowerCase()) || item.station?.id?.toLowerCase().includes(search.toLowerCase()))
  )
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'recent') {
      const dateA = typeof a.historyEntry.playedAt === 'string' ? new Date(a.historyEntry.playedAt).getTime() : a.historyEntry.playedAt._seconds * 1000
      const dateB = typeof b.historyEntry.playedAt === 'string' ? new Date(b.historyEntry.playedAt).getTime() : b.historyEntry.playedAt._seconds * 1000
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
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSort('recent')}>Reciente</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('az')}>A-Z</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Input placeholder="Buscar en el historial..." className="max-w-xs" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Historial Reciente</CardTitle>
          <CardDescription>
            Las estaciones que has escuchado en los últimos días
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando...</div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No se encontró historial.</div>
          ) : (
            <div className="space-y-4">
              {sorted.map((item) => (
                <div
                  key={item.historyEntry.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none">
                      {item.station?.name || 'Estación desconocida'}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.station?.genres?.length ? item.station.genres.join(', ') : 'Sin géneros'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatPlayedAt(item.historyEntry.playedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button size="sm" disabled={!item.station?.streamUrl}>
                      <IconPlayerPlay className="h-4 w-4 mr-2" />
                      Reproducir
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
