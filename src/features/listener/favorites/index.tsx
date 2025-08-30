import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { IconPlayerPlay, IconPlayerPause, IconHeart } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponseStationDto } from '@/core/types'
import { useGenreNames, useFavorites, useRemoveFavorite } from '@/hooks'
import { getFlagEmojiFromIsoCode } from '@/utils/flagUtils'
import React from 'react'
import { useMiniPlayer } from '@/context/mini-player-context'
import { slugify } from '@/utils'
import { useStaticTranslation } from '@/hooks/useTranslation'

function useCountryName(isoCode?: string) {
    const [name, setName] = React.useState<string | null>(null)
    React.useEffect(() => {
        if (!isoCode) return
        import('@/core/services').then(({ countryService }) => {
            countryService.getCountryByIsoCode(isoCode).then((country) => setName(country?.name || null))
        })
    }, [isoCode])
    return name
}

export default function Favorites() {
    const { t } = useStaticTranslation();
    const { user } = useAuthStore()
    const { data: favorites, isLoading } = useFavorites(user?.uid || '')
    const [genreFilter, setGenreFilter] = React.useState<string | null>(null)
    const [countryFilter, setCountryFilter] = React.useState<string | null>(null)
    const [search, setSearch] = React.useState('')

    // Obtener todos los géneros y países únicos de las estaciones favoritas
    const allGenreIds = React.useMemo(() => {
        const ids = new Set<string>()
        favorites?.forEach(st => st.genreIds.forEach(id => ids.add(id)))
        return Array.from(ids)
    }, [favorites])
    const allCountries = React.useMemo(() => {
        const ids = new Set<string>()
        favorites?.forEach(st => st.countryId && ids.add(st.countryId))
        return Array.from(ids)
    }, [favorites])

    // Filtros
    const filtered = (favorites || []).filter(station =>
        (!genreFilter || station.genreIds.includes(genreFilter)) &&
        (!countryFilter || station.countryId === countryFilter) &&
        (!search || station.name.toLowerCase().includes(search.toLowerCase()))
    )

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-t-xl border overflow-hidden">
                        <Skeleton className="aspect-square w-full" />
                        <div className="p-4 space-y-2">
                            <Skeleton className="h-5 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-1" />
                            <Skeleton className="h-4 w-1/3 mb-1" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!favorites || favorites.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">{t('favorites.noFavoritesFound')}</div>
    }

    return (
        <>
            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mb-4">
                <Select value={genreFilter || '__all__'} onValueChange={v => setGenreFilter(v === '__all__' ? null : v)}>
                    <SelectTrigger className="min-w-[140px]">
                        <SelectValue placeholder={t('favorites.allGenres')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">{t('favorites.allGenres')}</SelectItem>
                        {allGenreIds.map(id => (
                            <GenreNameSelectItem key={id} id={id} />
                        ))}
                    </SelectContent>
                </Select>
                <Select value={countryFilter || '__all__'} onValueChange={v => setCountryFilter(v === '__all__' ? null : v)}>
                    <SelectTrigger className="min-w-[140px]">
                        <SelectValue placeholder={t('favorites.allCountries')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">{t('favorites.allCountries')}</SelectItem>
                        {allCountries.map(id => (
                            <CountryNameSelectItem key={id} id={id} />
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-xs"
                />
            </div>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((station: ResponseStationDto) => (
                    <StationCard key={station.id} station={station} />
                ))}
            </div>
        </>
    )
}

// Componente para mostrar el nombre del género en el filtro (SelectItem)
function GenreNameSelectItem({ id }: { id: string }) {
    const names = useGenreNames([id], undefined)
    if (!names) return null
    return <SelectItem value={id}>{names[0]}</SelectItem>
}

// Componente para mostrar el nombre del país en el filtro (SelectItem)
function CountryNameSelectItem({ id }: { id: string }) {
    const name = useCountryName(id)
    if (!name) return null
    return <SelectItem value={id}>{name}</SelectItem>
}

// Card de estación favorita
function StationCard({ station }: { station: ResponseStationDto }) {
    const genreNames = useGenreNames(station.genreIds, station.ownerId)
    const countryName = useCountryName(station.countryId)
    const flag = getFlagEmojiFromIsoCode(station.countryId)
    const { play, pause, player } = useMiniPlayer()
    const { user } = useAuthStore()
    const removeFavorite = useRemoveFavorite()
    const [removing, setRemoving] = React.useState(false)

    const handlePlayStation = (station: ResponseStationDto) => {
        if (isStationPlaying(station)) {
            pause()
        } else {
            play({ station })
        }
    }

    const isStationPlaying = (station: ResponseStationDto) => {
        return player?.station?.id === station?.id && player?.isPlaying
    }

    return (
        <div className="group relative bg-card hover:bg-card/80 rounded-t-xl overflow-hidden border transition-all duration-200 hover:shadow-xs hover:scale-[1.02]">
            {/* Cover image or placeholder, now clickable */}
            <Link
                to="/$slugName"
                params={{ slugName: station.slug || slugify(station.name) }}
                className="block"
            >
                <div className="relative aspect-square bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-teal-600/20 flex items-center justify-center">
                    {station.coverImage ? (
                        <img src={station.coverImage} alt={station.name} className="object-cover w-full h-full" />
                    ) : (
                        <span className="text-4xl text-zinc-400">{station.name[0]}</span>
                    )}
                    {/* Play button */}
                    <Button
                        size="icon"
                        className="absolute bottom-3 right-3 bg-white/80 hover:bg-white text-zinc-900 shadow-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={e => {
                            e.preventDefault();
                            handlePlayStation(station)
                        }}
                    >
                        {isStationPlaying(station) ? (
                            <IconPlayerPause className="h-6 w-6" fill="currentColor" />
                        ) : (
                            <IconPlayerPlay className="h-6 w-6" fill="currentColor" />
                        )}
                    </Button>
                </div>
            </Link>
            {/* Info */}
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors truncate">
                    {station.name}
                </h3>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    {genreNames && genreNames.map((name, i) => (
                        <Badge key={i} variant="secondary" className="rounded-none px-2 py-0.5 text-xs font-medium">{name}</Badge>
                    ))}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{station.description}</p>
                <div className="flex items-center gap-2 mt-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="bg-zinc-100 dark:bg-zinc-800 text-[#26E056]"
                        disabled={removing || removeFavorite.isPending}
                        onClick={async () => {
                            if (!user) return
                            setRemoving(true)
                            try {
                                await removeFavorite.mutateAsync({ userId: user.uid, stationId: station.id })
                            } finally {
                                setRemoving(false)
                            }
                        }}
                        title="Remove from favorites"
                        aria-label="Remove from favorites"
                    >
                        <IconHeart className="h-5 w-5" fill="#26E056" />
                    </Button>
                    {flag && <span className="text-xl ml-1 select-none" title={countryName || ''}>{flag}</span>}
                </div>
            </div>
        </div>
    )
}