import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useMiniPlayer } from '../context/mini-player-context'
import { toast } from 'sonner'
import { IconPlayerPlay, IconPlayerPause, IconVolume, IconVolumeOff } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
// Utils
import { slugify } from '@/utils'
import { formatTime } from '@/lib/utils/format'
import { truncateStationName } from '@/lib/utils/format'

export function MiniPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const dragRef = useRef<HTMLDivElement>(null)
    const [elapsed, setElapsed] = useState(0)
    const [volume, ] = useState(1) //setVolume
    const [isMuted, setIsMuted] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    // Posición inicial: bottom-4 left-4 convertido a coordenadas top/left
    const [position, setPosition] = useState(() => ({
        x: 16, // left-4 = 1rem = 16px
        y: window.innerHeight - 100 - 16 // desde arriba, menos altura aprox del player y bottom-4
    }))
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const { player, setIsPlaying } = useMiniPlayer()
    const [errorToastShown, setErrorToastShown] = useState(false)

    if (!player) return null

    const { station, isPlaying = true } = player
    const { streamUrl, name: stationName, coverImage: stationCover } = station

    // Helper function to check if station is from radio-browser
    const isRadioBrowserStation = (station: any): boolean => {
        return station.ownerId === 'radiobrowser' || !('ownerId' in station);
    };

    const [currentStreamUrl, setCurrentStreamUrl] = useState<string>('')
    
    // Manejo del audio nativo
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const isNewStation = streamUrl !== currentStreamUrl
        if (isNewStation) {
            setCurrentStreamUrl(streamUrl)
            setElapsed(0)
            setErrorToastShown(false)
            audio.src = streamUrl
            audio.volume = volume
            audio.muted = isMuted
        }
        
        if (isPlaying && audio.paused) {
            const playPromise = audio.play()
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Play was prevented by browser
                })
            }
        } else if (!isPlaying && !audio.paused) {
            audio.pause()
        }
    }, [streamUrl, isPlaying, currentStreamUrl, volume, isMuted])

    // Contador de tiempo
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateTime = () => {
            if (!audio.paused) {
                setElapsed(Math.floor(audio.currentTime))
            }
        }

        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    // Manejadores de eventos
    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    const handleVolumeToggle = () => {
        setIsMuted(!isMuted)
        if (audioRef.current) {
            audioRef.current.muted = !isMuted
        }
    }

    // Funcionalidad de arrastre
    const handleMouseDown = (e: React.MouseEvent) => {
        // Prevenir arrastre si se hace clic en botones o links
        const target = e.target as HTMLElement
        if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
            return
        }
        
        setIsDragging(true)
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        })
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return
        
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        
        // Limitar el movimiento dentro de la ventana
        const maxX = window.innerWidth - 320 // 320px es el ancho del mini-player (w-80)
        const maxY = window.innerHeight - 100 // altura aproximada del mini-player
        
        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    // Efectos para el arrastre
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDragging, dragStart])

    // Audio error handler
    const handleAudioError = () => {
        if (errorToastShown) return
        setErrorToastShown(true)
        toast.error('Unable to play this stream.', { duration: 5000 })
        setTimeout(() => setErrorToastShown(false), 6000)
    }

    return (
        <div
            ref={dragRef}
            className={`fixed z-50 w-80 bg-card border border-border rounded-none shadow-xl backdrop-blur-sm overflow-hidden transition-shadow select-none ${
                isDragging ? 'shadow-2xl cursor-grabbing' : 'cursor-grab hover:shadow-2xl'
            }`}
            style={{ 
                left: position.x,
                top: position.y,
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.16)',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none'
            }}
            onMouseDown={handleMouseDown}
            onDragStart={(e) => e.preventDefault()}
        >
            {/* Audio element oculto */}
            <audio
                ref={audioRef}
                onError={handleAudioError}
                preload="none"
            />
            
            {/* Toda la información y controles en una sola fila */}
            <div className="flex items-center gap-3 p-3">
                {/* Link clickeable con cover e info */}
                <Link 
                    to={isRadioBrowserStation(station) ? '/s/$stationSlug' : '/$slugName'}
                    params={
                        isRadioBrowserStation(station)
                            ? { stationSlug: slugify(stationName || 'unknown') }
                            : { slugName: station.slug || slugify(stationName) }
                    }
                    search={
                        isRadioBrowserStation(station)
                            ? {
                                id: station.id,
                                ownerId: station.ownerId,
                                name: station.name,
                                streamUrl: station.streamUrl,
                                coverImage: station.coverImage || '',
                                description: station.description || '',
                                countryId: station.countryId || '',
                                genreIds: station.genreIds || [],
                                favoritesCount: station.favoritesCount || 0,
                                createdAt: station.createdAt || '',
                                updatedAt: station.updatedAt || '',
                            }
                            : undefined
                    }
                    className='flex items-center gap-3 flex-1 min-w-0 hover:bg-muted/50 transition-colors rounded px-2 py-1 select-none' 
                >
                    {stationCover ? (
                        <img 
                            src={stationCover} 
                            alt={stationName} 
                            className="w-10 h-10 object-cover rounded-none select-none"        
                            loading="lazy"
                            onError={e => { e.currentTarget.style.display = 'none' }}
                            draggable={false}
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-teal-600/20 rounded flex items-center justify-center select-none">
                            <span className="text-sm font-bold text-muted-foreground select-none">{stationName[0]}</span>
                        </div>
                    )}
                    <div className="flex-1 min-w-0 select-none">
                        <div className="flex items-center gap-2 mb-0.5 select-none">
                            <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-red-500 uppercase tracking-wide select-none">LIVE</span>
                        </div>
                        <h4 className="font-semibold text-sm truncate text-foreground select-none">{truncateStationName(stationName)}</h4>
                        <p className="text-xs text-muted-foreground select-none">{formatTime(elapsed)}</p>
                    </div>
                </Link>
                
                {/* Controles de audio */}
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={handlePlayPause}
                        className="w-9 h-9 rounded-full"
                    >
                        {isPlaying ? (
                            <IconPlayerPause className="h-4 w-4" />
                        ) : (
                            <IconPlayerPlay className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleVolumeToggle}
                        className="w-9 h-9 rounded-full"
                    >
                        {isMuted ? (
                            <IconVolumeOff className="h-4 w-4" />
                        ) : (
                            <IconVolume className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
