import { useState, useEffect } from 'react'
// Shadcn UI components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
// Components
import { Footer } from '@/components/footer'
import { MiniPlayer } from '@/components/mini-player'
import { useMiniPlayer } from '@/context/mini-player-context'
// Icons
import { IconPlayerPlay, IconHeart, IconSearch } from '@tabler/icons-react'
// Dependencies
import { Link, useNavigate } from '@tanstack/react-router'
// Hooks
import { useRadioBrowserStations } from '@/hooks/radio-browser'
// Services
import { stationService, userService, genreService } from '@/core/services'
import type { ResponseStationDto, GenreResponseDto, RadioBrowserStation } from '@/core/types'

export default function Listener() {
  // Navigations
  const navigate = useNavigate()
  const [featuredStation, setFeaturedStation] = useState<ResponseStationDto | null>(null)
  const [liveStations, setLiveStations] = useState<ResponseStationDto[]>([])
  const [madeForYouStations, setMadeForYouStations] = useState<ResponseStationDto[]>([])
  const [creatorNames, setCreatorNames] = useState<Record<string, string>>({})
  const [genres, setGenres] = useState<GenreResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingGenres, setIsLoadingGenres] = useState(true)
  const { player, play } = useMiniPlayer()
  
  // Use TanStack Query for Radio Browser stations
  const { stations: radioBrowserStations, isLoading: isLoadingRadioBrowser } = useRadioBrowserStations({
    strategy: 'random-genre',
    genreFilter: ['garage', 'house', 'techno', 'jazz', 'electronic', 'indie']
  })

  // Load stations on component mount
  useEffect(() => {
    const loadStations = async () => {
      try {
        setIsLoading(true)
        
        // Get all stations
        const allStations = await stationService.getAllStations()
        
        if (allStations.length > 0) {
          // Select random station for hero
          const randomIndex = Math.floor(Math.random() * allStations.length)
          setFeaturedStation(allStations[randomIndex])
          
          // Get last 3 stations (most recently created) for Latest Stations
          const sortedStations = allStations
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3)
          setLiveStations(sortedStations)

          // Get 2 random stations for Made for You (excluding the featured one)
          const availableForMadeForYou = allStations.filter((_, index) => index !== randomIndex)
          const madeForYou = []
          if (availableForMadeForYou.length > 0) {
            // Shuffle the array and take first 2
            const shuffled = [...availableForMadeForYou].sort(() => Math.random() - 0.5)
            madeForYou.push(...shuffled.slice(0, Math.min(2, shuffled.length)))
          }
          setMadeForYouStations(madeForYou)

          // Get unique creator IDs from all stations being displayed
          const creatorIds = [...new Set([
            allStations[randomIndex].ownerId,
            ...sortedStations.map(station => station.ownerId),
            ...madeForYou.map(station => station.ownerId)
          ])]

          // Fetch creator names
          const creatorNameMap: Record<string, string> = {}
          await Promise.all(
            creatorIds.map(async (creatorId) => {
              try {
                const user = await userService.getUserById(creatorId)
                creatorNameMap[creatorId] = user.displayName || user.email || 'Unknown Creator'
              } catch (error) {
                console.error(`Error fetching creator ${creatorId}:`, error)
                creatorNameMap[creatorId] = 'Unknown Creator'
              }
            })
          )
          
          setCreatorNames(creatorNameMap)
        }
      } catch (error) {
        console.error('Error loading stations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStations()
  }, [])

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

  // Color palette for genre cards
  const genreColors = [
    'from-blue-500/20 to-blue-600/20',
    'from-purple-500/20 to-purple-600/20', 
    'from-red-500/20 to-red-600/20',
    'from-green-500/20 to-green-600/20',
    'from-orange-500/20 to-orange-600/20',
    'from-yellow-500/20 to-yellow-600/20',
    'from-pink-500/20 to-pink-600/20',
    'from-indigo-500/20 to-indigo-600/20',
    'from-cyan-500/20 to-cyan-600/20',
    'from-teal-500/20 to-teal-600/20'
  ]

  // Function to get random color for a genre
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * genreColors.length)
    return genreColors[randomIndex]
  }

  // Handler para reproducir una estación de RadioBrowser
  function handlePlayRadioBrowserStation(station: RadioBrowserStation) {
    play({
      streamUrl: station.url_resolved,
      stationName: station.name,
      stationCover: station.favicon || undefined,
    })
  }

  // Handler para reproducir una estación propia
  function handlePlayOwnStation(station: ResponseStationDto) {
    play({
      streamUrl: station.streamUrl,
      stationName: station.name,
      stationCover: station.coverImage || undefined,
    })
  }

  const handleViewAll = () => {
    navigate({ to: '/browse' });
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
          <div className="container flex h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 select-none">
              <h1 className="text-xl font-bold tracking-widest font-[Orbitron]">Hörgen</h1>
            </Link>
            
            {/* Navigation */}
            <nav className="ml-8 flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs bg-primary text-primary-foreground">
                <Link to="/">Radio</Link>
              </Button>
              <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs">
                <Link to="/browse">Browse</Link>
              </Button>
              <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs">
                <Link to="/library">Library</Link>
              </Button>
            </nav>
            
            {/* Search */}
            <div className="ml-8 flex-1 max-w-md relative">
              <div className="relative">
                <IconSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search radio stations around the world..."
                  className="pl-12 h-11 bg-muted/50 border-0 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/30 text-sm"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="ml-6 flex items-center space-x-4">
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-background">
          <div className="container space-y-8 p-6 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="py-12">
              <div className="text-center space-y-4 mb-12">
                <h1 className="text-5xl font-bold tracking-tight">Broadcast the Rebellion</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  From Berlin basements to Villahermosa backstreets — tune into raw, live broadcasts from independent stations defying the mainstream.
                </p>
              </div>
              
              {/* Featured Station Hero */}
              {isLoading ? (
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 mb-8">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-muted rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">LOADING...</span>
                    </div>
                    <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-muted rounded animate-pulse mb-1 w-1/3"></div>
                    <div className="h-4 bg-muted rounded animate-pulse mb-6 w-1/2"></div>
                    <div className="flex items-center gap-4">
                      <div className="h-9 bg-muted rounded animate-pulse w-32"></div>
                    </div>
                  </div>
                </div>
              ) : featuredStation ? (
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 mb-8">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">LIVE</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{featuredStation.name}</h2>
                    <p className="text-muted-foreground mb-1">
                      by {creatorNames[featuredStation.ownerId] || 'Loading...'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">{featuredStation.description || 'No description available'}</p>
                    <div className="flex items-center gap-4">
                      <Button size="lg" className="rounded-xs h-9 px-4">
                        <IconPlayerPlay className="h-5 w-5 mr-2" />
                        Listen Now
                      </Button>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{featuredStation.favoritesCount} favorites</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 mb-8">
                  <div className="relative z-10 text-center">
                    <p className="text-muted-foreground">No stations available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Live Radio Worldwide */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Worldwide Radio</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xs"
                  onClick={handleViewAll}
                >
                  View all
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
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        )}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-semibold text-white uppercase tracking-wide">LIVE</span>
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <Button size="sm" className="rounded-full h-10 w-10 p-0 bg-white/90 hover:bg-white text-black" onClick={() => handlePlayRadioBrowserStation(station)}>
                            <IconPlayerPlay className="h-4 w-4" />
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
                  <p className="text-muted-foreground">No global stations available</p>
                </div>
              )}
            </div>

            {/* Featured Stations */}
            <div className="my-28">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Made for You</h2>
                <Button variant="outline" size="sm" className="rounded-xs">View more</Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {madeForYouStations.map((station) => (
                  <div key={station.id} className="group cursor-pointer bg-muted/20 rounded-xs p-6 hover:bg-muted/30 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      {/* Station Cover */}
                      <div className="w-20 h-20 bg-gradient-to-br from-muted via-muted/80 to-muted/60 rounded-none flex-shrink-0 relative overflow-hidden">
                        {station.coverImage && (
                          <img src={station.coverImage} alt={station.name} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute bottom-1 right-1">
                          <Button size="sm" className="rounded-full h-6 w-6 p-0 bg-white/90 hover:bg-white text-black" onClick={() => handlePlayOwnStation(station)}>
                            <IconPlayerPlay className="h-3 w-3"/>
                          </Button>
                        </div>
                      </div>
                      
                      {/* Station Info */}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                          {station.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          by {creatorNames[station.ownerId] || 'Loading...'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs rounded-xs">Radio</Badge>
                          <Badge variant="outline" className="text-xs rounded-xs">
                            {station.favoritesCount} listeners
                          </Badge>
                        </div>
                        {station.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {station.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0">
                          <IconHeart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent & Genres */}
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Recently Played */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Recently Played</h3>
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
                      <div key={station.id} className="group flex items-center gap-4 p-3 rounded-xs hover:bg-muted/30 transition-colors cursor-pointer">
                        {/* Mini Cover */}
                        <div className="w-12 h-12 bg-gradient-to-br from-muted via-muted/80 to-muted/60 rounded-none flex-shrink-0 relative overflow-hidden">
                          {station.coverImage && (
                            <img src={station.coverImage} alt={station.name} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <IconPlayerPlay className="h-4 w-4" />
                          </div>
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{station.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            by {creatorNames[station.ownerId] || 'Loading...'}
                          </p>
                        </div>
                        
                        {/* Favorites */}
                        <div className="text-xs text-muted-foreground">
                          {station.favoritesCount}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Browse by Genre */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Browse by Genre</h3>
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
                      <div
                        key={genre.id}
                        className={`relative overflow-hidden rounded p-4 h-20 cursor-pointer hover:scale-95 transition-transform bg-gradient-to-br ${getRandomColor()}`}
                      >
                        <div className="relative z-10">
                          <h4 className="font-semibold text-sm">{genre.name}</h4>
                          {genre.description && (
                            <p className="text-xs mt-1 line-clamp-2 font-semibold drop-shadow-sm">
                              {genre.description}
                            </p>
                          )}
                        </div>
                      </div>
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
        {player && (
          <MiniPlayer
            streamUrl={player.streamUrl}
            stationName={player.stationName}
            stationCover={player.stationCover}
            isPlaying={player.isPlaying}
          />
        )}
      </div>
    </>
  )
}
