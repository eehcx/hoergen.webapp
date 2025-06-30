import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// Icons 
import { 
    IconPlayerPlay, 
    IconHeart, 
    IconShare, 
    IconHeartOff, 
    IconChevronDown 
} from '@tabler/icons-react'
import React from 'react'

export default function Favorites() {
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

    const [filter, setFilter] = React.useState('all')
    const [sort, setSort] = React.useState('recent')
    const [search, setSearch] = React.useState('')
    const genres = Array.from(new Set(favoriteStations.map(s => s.genre)))
    const filteredStations = favoriteStations.filter(station =>
        (filter === 'all' || station.genre === filter) &&
        (station.name.toLowerCase().includes(search.toLowerCase()) || station.creator.toLowerCase().includes(search.toLowerCase()))
    )
    const sortedStations = [...filteredStations].sort((a, b) => {
        if (sort === 'recent') return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        if (sort === 'az') return a.name.localeCompare(b.name)
        if (sort === 'listeners') return b.listeners - a.listeners
        return 0
    })

    return (
        <>
        {/* Filtros y ordenación */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            <IconChevronDown className="h-4 w-4" />
                            {filter === 'all' ? 'All Genres' : filter}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFilter('all')}>All Genres</DropdownMenuItem>
                        {genres.map(g => (
                            <DropdownMenuItem key={g} onClick={() => setFilter(g)}>{g}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            Sort: {sort === 'recent' ? 'Recent' : sort === 'az' ? 'A-Z' : 'Most Listeners'}
                            <IconChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSort('recent')}>Recent</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort('az')}>A-Z</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort('listeners')}>Most Listeners</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Input placeholder="Search favorites..." className="max-w-xs" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Grid de favoritos estilo Browse */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedStations.map((station) => (
                <div
                    key={station.id}
                    className="group relative bg-card hover:bg-card/80 rounded-t-xl overflow-hidden border transition-all duration-200 hover:shadow-xs hover:scale-[1.02]"
                >
                    {/* Imagen de portada (placeholder) */}
                    <div className="relative aspect-square bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-teal-600/20 flex items-center justify-center">
                        {/* Si tienes station.cover pon aquí el <img ... /> */}
                        <IconHeart className="h-12 w-12 text-pink-400 opacity-30" />
                        {/* Botón de play flotante */}
                        <Button size="icon" className="absolute bottom-3 right-3 bg-white/80 hover:bg-white text-pink-500 shadow-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <IconPlayerPlay className="h-6 w-6" />
                        </Button>
                        {/* LIVE badge */}
                        {station.isLive && (
                            <Badge variant="destructive" className="absolute top-3 left-3 text-xs">LIVE</Badge>
                        )}
                    </div>
                    {/* Info */}
                    <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors truncate">{station.name}</h3>
                        <p className="text-xs text-muted-foreground truncate mb-1">by {station.creator}</p>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge variant="secondary">{station.genre}</Badge>
                            <span className="text-xs text-muted-foreground">{station.listeners.toLocaleString()} listeners</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{station.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Button size="icon" variant="ghost" className="hover:bg-pink-100 text-pink-500">
                                <IconHeartOff className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="ghost">
                                <IconShare className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </>
    )
}