import { useState, useEffect, useCallback } from 'react'
// Tanstack Router
import { Link } from '@tanstack/react-router'
// Shadcn UI components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select'
import { 
    IconPlayerPlay, 
    IconSearch, 
    IconLoader2, 
    IconFilter 
} from '@tabler/icons-react'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
// Mini player context
import { MiniPlayer } from '@/components/mini-player'
import { useMiniPlayer } from '@/context/mini-player-context'
// Radio Browser hooks
import { useRadioBrowserInfiniteQuery } from '@/hooks/radio-browser'
import type { RadioBrowserInfiniteParams } from '@/hooks/radio-browser'
import type { RadioBrowserStation } from '@/core/types'

export default function Browse() {
    const [searchTerm, setSearchTerm] = useState('')
    const [strategy, setStrategy] = useState<RadioBrowserInfiniteParams['strategy']>('top-voted')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const { play, player } = useMiniPlayer()

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Query parameters
    const queryParams: RadioBrowserInfiniteParams = {
        pageSize: 20,
        strategy: debouncedSearchTerm ? 'search' : strategy,
        searchTerm: debouncedSearchTerm || undefined,
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useRadioBrowserInfiniteQuery(queryParams)

    // Flatten all pages into a single array
    const allStations = data?.pages.flatMap(page => page.stations) ?? []

    // Handle playing a station
    const handlePlayStation = useCallback((station: RadioBrowserStation) => {
        console.log('Playing station:', {
            name: station.name,
            url: station.url_resolved,
            favicon: station.favicon
        })
        
        play({
            streamUrl: station.url_resolved,
            stationName: station.name,
            stationCover: station.favicon || undefined,
        })
    }, [play])

    // Load more stations when user scrolls near bottom
    useEffect(() => {
        const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 1000 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage()
        }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [fetchNextPage, hasNextPage, isFetchingNextPage])

    // Strategy options
    const strategyOptions = [
        { value: 'top-voted', label: 'Top Voted' },
        { value: 'most-clicked', label: 'Most Popular' },
        { value: 'recent', label: 'Recently Added' },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
                <div className="container flex h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 select-none">
                        <h1 className="text-xl font-bold tracking-widest font-[Orbitron]">Hörgen</h1>
                    </Link>
                    
                    {/* Navigation */}
                    <nav className="ml-8 flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs">
                            <Link to="/">Radio</Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs bg-primary text-primary-foreground">
                            <Link to="/browse">Browse</Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs">
                            <Link to="/library">Library</Link>
                        </Button>
                    </nav>
                    
                    {/* Search */}
                    <div className="ml-8 flex-1 max-w-md relative">
                        <div className="relative">
                            <IconSearch 
                                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" 
                            />
                            
                            <Input
                                type="search"
                                placeholder="Search radio stations..."
                                className="pl-12 h-11 bg-muted/50 border-0 rounded-xs focus-visible:ring-2 focus-visible:ring-primary/30 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-6">
                        <Select value={strategy} onValueChange={(value) => setStrategy(value as RadioBrowserInfiniteParams['strategy'])}>
                            <SelectTrigger className="w-full sm:w-48 rounded-xs">
                                <IconFilter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                {strategyOptions.map((option) => (
                                    <SelectItem 
                                        key={option.value} 
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
        
                    {/* User Actions */}
                    <div className="ml-6 flex items-center space-x-4">
                        <ThemeSwitch />
                        <ProfileDropdown />
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-6 py-20">
                {/* Page Header */}
                <div className="space-y-6 mb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">World Signals</h1>
                        <p className="text-muted-foreground">
                            Authentic sounds, Real stations. Broadcast beyond borders.
                        </p>
                    </div>
                </div>

                {/* Error State */}
                {isError && (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground mb-4">
                            Failed to load stations: {error?.message}
                        </div>
                        <Button onClick={() => refetch()} variant="outline">
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="aspect-square rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    ))}
                </div>
                )}

                {/* Stations Grid */}
                {!isLoading && allStations.length > 0 && (
                <>
                    <div className="mb-6">
                        <p className="text-sm text-muted-foreground">
                            Found {allStations.length} stations
                            {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allStations.map((station, index) => (
                        <div
                            key={`${station.stationuuid}-${index}`}
                            className="group relative bg-card hover:bg-card/80 rounded-t-xl overflow-hidden border transition-all duration-200 hover:shadow-xs hover:scale-[1.02]"
                        >
                            {/* Station Image/Cover */}
                            <div className="relative aspect-square bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20">
                                {station.favicon && (
                                <img
                                    src={station.favicon}
                                    alt={station.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => {
                                    // Hide broken images and show gradient background
                                    const target = e.currentTarget
                                    target.style.display = 'none'
                                    }}
                                    onLoad={(e) => {
                                    // Ensure image is visible when loaded successfully
                                    const target = e.currentTarget
                                    target.style.display = 'block'
                                    }}
                                />
                                )}
                                
                                {/* Live indicator */}
                                <div className="absolute top-3 left-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-semibold text-white uppercase tracking-wide bg-black/50 px-2 py-1 rounded">
                                    LIVE
                                </span>
                                </div>
                                
                                {/* Play button */}
                                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    size="sm"
                                    className="rounded-full h-10 w-10 p-0 bg-white/90 hover:bg-white text-black shadow-lg"
                                    onClick={() => handlePlayStation(station)}
                                >
                                    <IconPlayerPlay className="h-4 w-4" />
                                </Button>
                                </div>
                                
                                {/* Stats */}
                                <div className="absolute bottom-3 left-3 text-white">
                                <div className="text-sm font-medium bg-black/50 px-2 py-1 rounded">
                                    {station.clickcount.toLocaleString()}
                                </div>
                                <div className="text-xs opacity-80">clicks</div>
                                </div>
                            </div>

                            {/* Station Info */}
                            <div className="p-4 space-y-3">
                                <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors truncate">
                                {station.name}
                                </h3>
                                
                                <p className="text-sm text-muted-foreground">
                                {station.country}
                                {station.language && ` • ${station.language}`}
                                </p>
                                
                                <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                    {station.codec} {station.bitrate}kbps
                                </Badge>
                                
                                {station.votes > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                    {station.votes} votes
                                    </Badge>
                                )}
                                </div>
                                
                                {station.tags && (
                                <div className="flex items-center gap-1 flex-wrap">
                                    {station.tags.split(',').slice(0, 2).map((tag, tagIndex) => (
                                    <Badge
                                        key={tagIndex}
                                        variant="outline"
                                        className="text-xs bg-muted/50"
                                    >
                                        {tag.trim()}
                                    </Badge>
                                    ))}
                                </div>
                                )}
                            </div>
                        </div>
                    ))}
                    </div>

                    {/* Load More Button / Loading Indicator */}
                    <div className="mt-12 text-center">
                    {isFetchingNextPage && (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <IconLoader2 className="h-4 w-4 animate-spin" />
                        Loading more stations...
                        </div>
                    )}
                    
                    {hasNextPage && !isFetchingNextPage && (
                        <Button onClick={() => fetchNextPage()} variant="outline" size="lg">
                        Load More Stations
                        </Button>
                    )}
                    
                    {!hasNextPage && allStations.length > 0 && (
                        <p className="text-muted-foreground">
                        You've reached the end of the stations list
                        </p>
                    )}
                    </div>
                </>
                )}

                {/* Empty State */}
                {!isLoading && allStations.length === 0 && !isError && (
                <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">
                    {debouncedSearchTerm 
                        ? `No stations found for "${debouncedSearchTerm}"`
                        : 'No stations available'
                    }
                    </div>
                    {debouncedSearchTerm && (
                    <Button onClick={() => setSearchTerm('')} variant="outline">
                        Clear Search
                    </Button>
                    )}
                </div>
                )}
            </div>
            
            {/* Mini Player */}
            {player && (
                <MiniPlayer
                    streamUrl={player.streamUrl}
                    stationName={player.stationName}
                    stationCover={player.stationCover}
                    isPlaying={player.isPlaying}
                />
            )}
        </div>
    )
}
