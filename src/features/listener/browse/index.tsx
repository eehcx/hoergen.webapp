import { useRef, useEffect, useState, useCallback } from 'react'
import { Footer } from '@/components/footer'
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
import { useMiniPlayer } from '@/context/mini-player-context'
// Radio Browser hooks
import { useRadioBrowserInfiniteQuery, useRadioBrowserCountries } from '@/hooks/radio-browser'
import type { RadioBrowserInfiniteParams } from '@/hooks/radio-browser'
import type { RadioBrowserStation, GenreResponseDto } from '@/core/types'
// Services
import { genreService } from '@/core/services'
import debounce from 'lodash.debounce'
// Utilities
import { 
    normalizeRadioBrowserStation, 
    slugify 
} from '@/utils'
import { withImageProxy } from '@/lib/utils/image'
import { useStaticTranslation } from '@/hooks/useTranslation'

export default function Browse() {
    const { t } = useStaticTranslation();
    const [searchTerm, setSearchTerm] = useState('')
    const [strategy, setStrategy] = useState<RadioBrowserInfiniteParams['strategy']>('top-voted')
    const [selectedCountry, setSelectedCountry] = useState<string>('all')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [genreData, setGenreData] = useState<GenreResponseDto | null>(null)
    const [, setIsLoadingGenre] = useState(false)
    const { play } = useMiniPlayer() //player
    const inputRef = useRef<HTMLInputElement>(null)

    // Get genre from URL search params
    const urlParams = new URLSearchParams(window.location.search)
    const genreCanonicalName = urlParams.get('genre') || undefined

    // Get countries data
    const { data: allCountries, isLoading: isLoadingCountries } = useRadioBrowserCountries()

    // Use all countries instead of just top 30
    const countries = allCountries || []

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    // Load genre data when genreCanonicalName changes
    useEffect(() => {
        const loadGenreData = async () => {
            if (!genreCanonicalName) {
                setGenreData(null)
                return
            }

            try {
                setIsLoadingGenre(true)
                const allGenres = await genreService.getAllGenres()
                const foundGenre = allGenres.find(g => g.canonicalName === genreCanonicalName)
                setGenreData(foundGenre || null)
            } catch (error) {
                console.error('Error loading genre data:', error)
                setGenreData(null)
            } finally {
                setIsLoadingGenre(false)
            }
        }

        loadGenreData()
    }, [genreCanonicalName])

    // Create search terms from genre data - try different strategies
    const [searchStrategy, setSearchStrategy] = useState<'name' | 'aliases' | 'searchTerms'>('name')

    const genreSearchTerms = genreData ? (() => {
        switch (searchStrategy) {
            case 'name':
                return genreData.name
            case 'aliases':
                return genreData.aliases.length > 0 ? genreData.aliases[0] : genreData.name
            case 'searchTerms':
                return genreData.searchTerms.length > 0 ? genreData.searchTerms[0] : genreData.name
            default:
                return genreData.name
        }
    })() : undefined

    // Debug: log search terms (remove in production)
    useEffect(() => {
        // Debug logging removed for production
    }, [genreSearchTerms, genreData, searchStrategy])

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Query parameters - use search strategy when filtering by genre
    const queryParams: RadioBrowserInfiniteParams = {
        pageSize: 20,
        strategy: (debouncedSearchTerm || genreSearchTerms) ? 'search' : strategy,
        searchTerm: debouncedSearchTerm || genreSearchTerms || undefined,
        country: selectedCountry && selectedCountry !== 'all' ? selectedCountry : undefined,
    }

    // Update page title when genre filter is active
    useEffect(() => {
        if (genreData) {
            document.title = `${genreData.name} Stations - Hörgen`
        } else {
            document.title = 'Browse Stations - Hörgen'
        }
    }, [genreData])

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

    // Debounced handlers
    const debouncedPlayStation = useCallback(debounce((station: RadioBrowserStation) => {
        play({ station: normalizeRadioBrowserStation(station) })
    }, 300, { leading: true, trailing: false }), [play])

    const debouncedFetchNextPage = useCallback(debounce(() => {
        fetchNextPage()
    }, 300, { leading: true, trailing: false }), [fetchNextPage])

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
        { value: 'top-voted', label: t('browse.topVoted') },
        { value: 'most-clicked', label: t('browse.mostPopular') },
        { value: 'recent', label: t('browse.recentlyAdded') },
    ]

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

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
                            <Link to="/">{t('navigation.radio')}</Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs bg-primary text-primary-foreground">
                            <Link to="/browse">{t('navigation.browse')}</Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs">
                            <Link to="/you/library">{t('navigation.library')}</Link>
                        </Button>
                    </nav>

                    {/* Search */}
                    <div className="ml-8 flex-1 max-w-md relative">
                        <div className="relative">
                            <IconSearch
                                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                                ref={inputRef}
                                type="search"
                                placeholder={t('browse.searchPlaceholder')}
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
                                <SelectValue placeholder={t('browse.sortBy')} />
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
                        <h1 className="text-3xl font-bold tracking-tight">
                            {genreData ? t('browse.genreStations').replace('{genre}', genreData.name) : t('browse.worldSignals')}
                        </h1>
                        <p className="text-muted-foreground">
                            {genreData
                                ? t('browse.discoverGenreStations').replace('{genre}', genreData.name)
                                : t('browse.authenticSounds')
                            }
                        </p>
                        
                        {/* Country Filter */}
                        {!genreData && (
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{t('browse.filterByCountry')}:</span>
                                    <Select 
                                        value={selectedCountry} 
                                        onValueChange={setSelectedCountry}
                                    >
                                        <SelectTrigger className="w-64">
                                            <SelectValue placeholder={t('browse.selectCountry')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t('browse.allCountries')}
                                            </SelectItem>
                                            {isLoadingCountries ? (
                                                <SelectItem value="loading" disabled>
                                                    {t('browse.loadingCountries')}
                                                </SelectItem>
                                            ) : (
                                                countries.map((country) => (
                                                    <SelectItem key={country} value={country}>
                                                        {country}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                {selectedCountry && selectedCountry !== 'all' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedCountry('all')}
                                    >
                                        {t('browse.clearCountryFilter')}
                                    </Button>
                                )}
                            </div>
                        )}
                        
                        {genreData && (
                            <div className="flex items-center gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        window.history.pushState({}, '', '/browse')
                                        window.location.reload()
                                    }}
                                >
                                    {t('browse.clearFilter')}
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {t('browse.filteringBy')}: <strong>{genreData.name}</strong>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error State */}
                {isError && (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground mb-4">
                            {t('browse.failedToLoadStations')}: {error?.message}
                        </div>
                        <Button onClick={() => refetch()} variant="outline">
                            {t('browse.tryAgain')}
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
                            {t('browse.foundStations').replace('{count}', allStations.length.toString())}
                            {genreData && t('browse.inGenre').replace('{genre}', genreData.name)}
                            {debouncedSearchTerm && t('browse.forSearch').replace('{search}', debouncedSearchTerm)}
                            {selectedCountry && selectedCountry !== 'all' && t('browse.fromCountry').replace('{country}', selectedCountry)}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allStations.map((station, index) => (
                        <div
                            key={`${station.stationuuid}-${index}`}
                            className="group relative bg-card hover:bg-card/80 rounded-t-xl overflow-hidden border transition-all duration-200 hover:shadow-xs hover:scale-[1.02]"
                        >
                            {/* Station Image/Cover */}
                            <div className="relative aspect-square bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-teal-600/20">
                                <Link
                                    to='/s/$stationSlug'
                                    params={{ stationSlug: slugify(station.name) }}
                                    search={normalizeRadioBrowserStation(station)}
                                >
                                    {station.favicon && (
                                        <img
                                            src={withImageProxy(station.favicon)}
                                            alt={station.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            loading="lazy"
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
                                </Link>

                                {/* Live indicator */}
                                <div className="absolute top-3 left-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-semibold text-white uppercase tracking-wide rounded">
                                            LIVE
                                        </span>
                                    </div>

                                    {/* Play button */}
                                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            className="rounded-full h-10 w-10 p-0 bg-white/90 hover:bg-white text-[#111] shadow-lg"
                                            onClick={() => debouncedPlayStation(station)}
                                        >
                                            <IconPlayerPlay className="h-4 w-4 text-[#111]" />
                                        </Button>
                                    </div>

                                    {/* Stats */}
                                    <div className="absolute bottom-3 left-3 text-white">
                                    <div className="text-sm font-medium">
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
                                    <Badge variant="secondary" className="text-xs !rounded-none">
                                        {station.codec} {station.bitrate}kbps
                                    </Badge>

                                    {station.votes > 0 && (
                                        <Badge variant="outline" className="text-xs !rounded-none">
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
                                        className="text-xs bg-muted/50 !rounded-none"
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
                        <Button onClick={debouncedFetchNextPage} variant="outline" size="lg">
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
                        <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-semibold mb-2">
                                {genreCanonicalName
                                    ? `No ${genreData?.name || genreCanonicalName} stations found`
                                    : debouncedSearchTerm
                                        ? 'No stations found'
                                        : 'No stations available'
                                }
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {genreCanonicalName
                                    ? `We couldn't find any ${genreData?.name || genreCanonicalName} stations. Try browsing all stations or selecting a different genre.`
                                    : debouncedSearchTerm
                                        ? 'Try adjusting your search terms or browse all stations'
                                        : 'Try refreshing the page or check your connection'
                                }
                            </p>
                            {genreSearchTerms && (
                                <div className="text-xs text-muted-foreground mb-4 space-y-2">
                                    <p>Search terms used: <strong>{genreSearchTerms}</strong></p>
                                    <p>Strategy: <strong>{searchStrategy}</strong></p>
                                    {genreData && (
                                        <div className="space-y-1">
                                            <p>Available search options:</p>
                                            <div className="flex gap-2 justify-center flex-wrap">
                                                {searchStrategy !== 'name' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setSearchStrategy('name')}
                                                    >
                                                        Try "{genreData.name}"
                                                    </Button>
                                                )}
                                                {genreData.aliases.length > 0 && searchStrategy !== 'aliases' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setSearchStrategy('aliases')}
                                                    >
                                                        Try "{genreData.aliases[0]}"
                                                    </Button>
                                                )}
                                                {genreData.searchTerms.length > 0 && searchStrategy !== 'searchTerms' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setSearchStrategy('searchTerms')}
                                                    >
                                                        Try "{genreData.searchTerms[0]}"
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="flex gap-2 justify-center">
                                {genreCanonicalName && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            window.history.pushState({}, '', '/browse')
                                            window.location.reload()
                                        }}
                                    >
                                        Browse All Stations
                                    </Button>
                                )}
                                {debouncedSearchTerm && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        Clear Search
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => refetch()}
                                >
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
