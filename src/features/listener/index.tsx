import { useState, useEffect } from 'react'
// Shadcn UI components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// Components
import { Footer } from '@/components/footer'
import { useMiniPlayer } from '@/context/mini-player-context'
import HeaderNavbar from '@/components/header-navbar'
// Icons
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react'
// Dependencies
import { Link, useNavigate } from '@tanstack/react-router'
// Hooks
import { useRadioBrowserStations } from '@/hooks/radio-browser'
import { useRoleStations } from './hooks'
import { useStaticTranslation } from '@/hooks/useTranslation'
// Services
import { genreService } from '@/core/services'
import type { ResponseStationDto, GenreResponseDto, RadioBrowserStation } from '@/core/types'
// Utilities
import { 
  getRandomColor, 
  normalizeRadioBrowserStation, 
  slugify 
} from '@/utils'

export default function Listener() {
  const { t } = useStaticTranslation();
  // Navigations
  const navigate = useNavigate()
  // Use TanStack Query for Radio Browser stations
  const { stations: radioBrowserStations, isLoading: isLoadingRadioBrowser } = useRadioBrowserStations({
    strategy: 'random-genre',
    genreFilter: ['garage', 'house', 'techno', 'jazz', 'electronic', 'indie']
  })

  const {
    featuredStation,
    liveStations,
    madeForYouStations,
    creatorNames,
    isLoading,
    isError,
    userType,
    //userRole
  } = useRoleStations();

  const [genres, setGenres] = useState<GenreResponseDto[]>([])
  const [isLoadingGenres, setIsLoadingGenres] = useState(true)
  const { player, play, pause } = useMiniPlayer()

  // Helper function to check if a station is currently playing
  const isStationPlaying = (station: ResponseStationDto | RadioBrowserStation): boolean => {
    if (!player || !player.isPlaying) return false
    
    const currentStationId = player.station?.id
    const stationId = isOwnStation(station) ? station.id : station.stationuuid
    
    return currentStationId === stationId
  }

  // Load genres for Browse by Genre section
  useEffect(() => {
    const loadGenres = async () => {
      try {
        setIsLoadingGenres(true)

        // Get all genres
        const allGenres = await genreService.getAllGenres()

        if (allGenres.length > 0) {
          // Shuffle and take 6 random genres
          const shuffled = [...allGenres].sort(() => Math.random() - 0.5)
          const selectedGenres = shuffled.slice(0, 6)
          setGenres(selectedGenres)
        }
      } catch (error) {
        console.error('Error loading genres:', error)
      } finally {
        setIsLoadingGenres(false)
      }
    }

    loadGenres()
  }, [])

  // Helper function to check if station is own station
  const isOwnStation = (station: ResponseStationDto | RadioBrowserStation): station is ResponseStationDto => {
    return 'ownerId' in station;
  };

  // Helper function to get creator name based on station type
  const getCreatorName = (station: ResponseStationDto | RadioBrowserStation): string => {
    if (isOwnStation(station)) {
      return creatorNames[station.ownerId] || 'Loading...';
    } else {
      return creatorNames[station.stationuuid] || `${station.country} • ${station.language}`;
    }
  };

  // Helper function to get station ID based on type
  const getStationId = (station: ResponseStationDto | RadioBrowserStation): string => {
    return isOwnStation(station) ? station.id : station.stationuuid;
  };

  // Helper function to get favorites/votes count
  const getFavoritesCount = (station: ResponseStationDto | RadioBrowserStation): number => {
    return isOwnStation(station) ? station.favoritesCount : station.votes;
  };

  // Helper function to get description/tags
  const getDescription = (station: ResponseStationDto | RadioBrowserStation): string => {
    return isOwnStation(station) ? (station.description || '') : (station.tags || '');
  };

  // Handler para reproducir/pausar cualquier tipo de estación
  const handlePlayStation = (e: React.MouseEvent, station: ResponseStationDto | RadioBrowserStation) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Si la estación está reproduciéndose, pausar
    if (isStationPlaying(station)) {
      pause();
      return;
    }
    
    // Si no está reproduciéndose, reproducir
    if (isOwnStation(station)) {
      play({ station });
    } else {
      play({ station: normalizeRadioBrowserStation(station) });
    }
  };

  const handleViewAll = () => {
    navigate({ to: '/worldwide' });
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <HeaderNavbar sticky />

        {/* Main Content */}
        <main className="flex-1 bg-background">
          <div className="container space-y-8 p-6 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="py-12">
              <div className="text-center space-y-4 mb-12">
                <h1 className="text-5xl font-bold tracking-tight">
                  {userType === 'platform' ? t('listener.broadcastRebellion') : t('listener.undergroundFrequencies')}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {userType === 'platform'
                    ? t('listener.broadcastRebellionDescription')
                    : t('listener.undergroundFrequenciesDescription')
                  }
                </p>
              </div>

              {/* Featured Station Hero */}
              {isLoading ? (
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 mb-8">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-muted rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('listener.loading')}</span>
                    </div>
                    <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-muted rounded animate-pulse mb-1 w-1/3"></div>
                    <div className="h-4 bg-muted rounded animate-pulse mb-6 w-1/2"></div>
                    <div className="flex items-center gap-4">
                      <div className="h-9 bg-muted rounded animate-pulse w-32"></div>
                    </div>
                  </div>
                </div>
              ) : isError ? (
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 mb-8">
                  <div className="relative z-10 text-center">
                    <p className="text-red-500">{t('listener.errorLoadingStations')}</p>
                  </div>
                </div>
              ) : featuredStation ? (
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 mb-8">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">{t('listener.live')}</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">
                    {featuredStation.name.length > 60
                      ? featuredStation.name.slice(0, 60) + '...'
                      : featuredStation.name}
                    </h2>
                    <p className="text-muted-foreground mb-1">
                      {t('listener.by')} {getCreatorName(featuredStation)}
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      {getDescription(featuredStation)}
                    </p>
                    <div className="flex items-center gap-4">
                      <Link
                        to={isOwnStation(featuredStation) ? '/$slugName' : '/s/$stationSlug'}
                        params={
                          isOwnStation(featuredStation)
                            ? { slugName: featuredStation.slug } 
                            : { stationSlug: slugify(featuredStation.name) }
                        }
                        search={
                          isOwnStation(featuredStation)
                            ? undefined
                            : normalizeRadioBrowserStation(featuredStation)
                        }
                        className="flex items-center justify-center text-normal text-white dark:text-zinc-900 h-8 px-5 bg-zinc-900 dark:bg-white"
                      >
                        {t('listener.listenNow')}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {getFavoritesCount(featuredStation)} {isOwnStation(featuredStation) ? t('listener.favorites') : t('listener.votes')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 mb-8">
                  <div className="relative z-10 text-center">
                    <p className="text-muted-foreground">{t('listener.noStationsAvailable')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Live Radio Worldwide */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">{t('listener.worldwideRadio')}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xs"
                  onClick={handleViewAll}
                >
                  {t('listener.viewAll')}
                </Button>
              </div>

              {isLoadingRadioBrowser ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="relative aspect-square bg-muted rounded-xl mb-4 animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                        <div className="h-3 bg-muted rounded animate-pulse w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : radioBrowserStations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {radioBrowserStations.map((station) => (
                    <div key={station.stationuuid} className="group cursor-pointer">
                      {/* Station Cover */}
                      <div className="relative aspect-square bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-t-xl mb-4 overflow-hidden">
                        {station.favicon ? (
                          <Link
                            to='/s/$stationSlug'
                            params={{ stationSlug: slugify(station.name) }}
                            search={normalizeRadioBrowserStation(station)}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <img
                              src={station.favicon}
                              alt={station.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to gradient background if favicon fails to load
                                const target = e.currentTarget
                                target.style.display = 'none'
                                const parent = target.parentElement
                                if (parent) {
                                  parent.classList.add('bg-gradient-to-br', 'from-blue-500/30', 'via-purple-500/30', 'to-pink-500/30')
                                }
                              }}
                              onLoad={(e) => {
                                // Remove gradient classes if image loads successfully
                                const target = e.currentTarget
                                const parent = target.parentElement
                                if (parent) {
                                  parent.classList.remove('bg-gradient-to-br', 'from-blue-500/30', 'via-purple-500/30', 'to-pink-500/30')
                                }
                              }}
                            />
                          </Link>
                        ) : (
                          <Link
                            to='/s/$stationSlug'
                            params={{ stationSlug: slugify(station.name) }}
                            search={normalizeRadioBrowserStation(station)}
                            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                          />
                        )}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-semibold text-white uppercase tracking-wide">LIVE</span>
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <Button 
                            size="sm" 
                            className="rounded-full h-10 w-10 p-0 bg-white/90 hover:bg-white text-zinc-900 dark:bg-zinc-900/90 dark:hover:bg-zinc-900 dark:text-white" 
                            onClick={(e) => handlePlayStation(e, station)}
                          >
                            {isStationPlaying(station) ? (
                              <IconPlayerPause className="h-4 w-4 fill-current" />
                            ) : (
                              <IconPlayerPlay className="h-4 w-4 fill-current" />
                            )}
                          </Button>
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="text-sm font-medium">{station.clickcount}</div>
                          <div className="text-xs opacity-80">clicks</div>
                        </div>
                      </div>

                      {/* Station Info */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors truncate">
                          {station.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {station.country} • {station.language}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs rounded-xs">
                            {station.codec} {station.bitrate}kbps
                          </Badge>
                          <Badge variant="outline" className="text-xs rounded-xs">
                            {station.votes} votes
                          </Badge>
                        </div>
                        {station.tags && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {station.tags.split(',').slice(0, 3).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('listener.noGlobalStationsAvailable')}</p>
                </div>
              )}
            </div>

            {/* Featured Stations */}
            <div className="my-28">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight">{t('listener.madeForYou')}</h2>
                {/*<Button variant="outline" size="sm" className="rounded-xs">View more</Button>*/}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/*key={getStationId(station)} */}
                {madeForYouStations.map((station) => (
                  <Link
                    to={isOwnStation(station) ? '/$slugName' : '/s/$stationSlug'}
                    params={
                      isOwnStation(station)
                        ? { slugName: station.slug } 
                        : { stationSlug: slugify(station.name) }
                    }
                    search={
                      isOwnStation(station)
                        ? undefined
                        : normalizeRadioBrowserStation(station)
                    }
                    className="group cursor-pointer bg-muted/20 rounded-xs p-6 hover:bg-muted/30 transition-all duration-300 no-underline"
                  >
                    <div className="flex items-center gap-4">
                      {/* Station Cover */}
                      <div className="w-20 h-20 bg-gradient-to-br from-muted via-muted/80 to-muted/60 rounded-none flex-shrink-0 relative overflow-hidden">
                        {isOwnStation(station) && station.coverImage && (
                          <img src={station.coverImage} alt={station.name} className="w-full h-full object-cover" />
                        )}
                        {!isOwnStation(station) && station.favicon && (
                          <img src={station.favicon} alt={station.name} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute bottom-1 right-1">
                          <Button 
                            size="sm" 
                            className="rounded-full h-6 w-6 p-0 bg-transparent hover:bg-transparent text-white" 
                            onClick={(e) => handlePlayStation(e, station)}
                          >
                            {isStationPlaying(station) ? (
                              <IconPlayerPause className="h-3 w-3 fill-current" />
                            ) : (
                              <IconPlayerPlay className="h-3 w-3 fill-current" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Station Info */}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                          {station.name.length > 30
                            ? station.name.slice(0, 30) + '...'
                            : station.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t('listener.by')} {getCreatorName(station)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs rounded-xs">{t('listener.radio')}</Badge>
                          <Badge variant="outline" className="text-xs rounded-xs">
                            {getFavoritesCount(station)} {isOwnStation(station) ? t('listener.favorites') : t('listener.votes')}
                          </Badge>
                        </div>
                        {getDescription(station) && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {getDescription(station)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent & Genres */}
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Recently Played */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold">{t('listener.recentlyPlayed')}</h3>
                <div className="space-y-1">
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg animate-pulse">
                        <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                          <div className="h-3 bg-muted rounded w-3/4" />
                          <div className="h-2 bg-muted rounded w-1/2" />
                        </div>
                        <div className="h-2 bg-muted rounded w-8" />
                      </div>
                    ))
                  ) : (
                    liveStations.map((station) => (
                      <div 
                        key={getStationId(station)} 
                        className="group flex items-center gap-4 p-3 rounded-xs hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={(e) => handlePlayStation(e, station)}
                      >
                        {/* Mini Cover */}
                        <div className="w-12 h-12 bg-gradient-to-br from-muted via-muted/80 to-muted/60 rounded-none flex-shrink-0 relative overflow-hidden">
                          {isOwnStation(station) && station.coverImage && (
                            <img src={station.coverImage} alt={station.name} className="w-full h-full object-cover" />
                          )}
                          {!isOwnStation(station) && station.favicon && (
                            <img src={station.favicon} alt={station.name} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {isStationPlaying(station) ? (
                              <IconPlayerPause className="h-4 w-4 fill-current text-zinc-900 dark:text-white" />
                            ) : (
                              <IconPlayerPlay className="h-4 w-4 fill-current text-zinc-900 dark:text-white" />
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{station.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            by {getCreatorName(station)}
                          </p>
                        </div>

                        {/* Favorites */}
                        <div className="text-xs text-muted-foreground">
                          {getFavoritesCount(station)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Browse by Genre */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold">{t('listener.browseByGenre')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {isLoadingGenres ? (
                    // Loading skeleton for genres
                    Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded p-4 h-20 bg-muted/30 animate-pulse"
                      >
                        <div className="relative z-10">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </div>
                      </div>
                    ))
                  ) : genres.length > 0 ? (
                    genres.map((genre) => (
                      <Link
                        key={genre.id}
                        className={`relative overflow-hidden rounded p-4 h-20 cursor-pointer hover:scale-95 transition-transform bg-gradient-to-br ${getRandomColor()}`}
                        to="/browse"
                        search={{ genre: genre.canonicalName }}
                      >
                        <div className="relative z-10">
                          <h4 className="font-semibold text-sm">{genre.name}</h4>
                          {genre.description && (
                            <p className="text-xs mt-1 line-clamp-2 font-semibold drop-shadow-sm">
                              {genre.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))
                  ) : (
                    // Fallback to hardcoded genres if API fails
                    [
                      { name: 'Jazz', color: 'from-blue-500/20 to-blue-600/20' },
                      { name: 'Electronic', color: 'from-purple-500/20 to-purple-600/20' },
                      { name: 'Rock', color: 'from-red-500/20 to-red-600/20' },
                      { name: 'Chill', color: 'from-green-500/20 to-green-600/20' },
                      { name: 'Indie', color: 'from-orange-500/20 to-orange-600/20' },
                      { name: 'Folk', color: 'from-yellow-500/20 to-yellow-600/20' }
                    ].map((genre) => (
                      <div
                        key={genre.name}
                        className={`relative overflow-hidden rounded p-4 h-20 cursor-pointer bg-gradient-to-br ${genre.color}`}
                      >
                        <div className="relative z-10">
                          <h4 className="font-semibold text-sm">{genre.name}</h4>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
