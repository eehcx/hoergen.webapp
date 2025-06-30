import { useEffect, useState, useRef } from 'react'
import type { ResponseStationDto } from '@/core/types/station.types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
    IconHeart, IconPlayerPlay, 
    IconPlayerPause, IconSettings 
} from '@tabler/icons-react'
// External libraries
import AudioSpectrum from 'react-audio-spectrum'
import ColorThief from 'colorthief'
// Utilities
import { withImageProxy } from '@/lib/utils/image'
// Mini player context
import { MiniPlayer } from '@/components/mini-player'
import { useMiniPlayer } from '@/context/mini-player-context'
import { useGenreNames } from '@/hooks/useGenreNames'
import LongText from '@/components/long-text'

export default function Station({ station }: { station: ResponseStationDto }) {
    // Chat states
    const [chatMessages, setChatMessages] = useState([
        { user: 'DJRebel', message: '¡Bienvenidos a la transmisión!' },
        { user: 'Listener42', message: '¡Gran música hoy!' },
        { user: 'MusicFan', message: '¿Cuál es la siguiente canción?' },
    ])
    const [chatInput, setChatInput] = useState('')
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Color extraction for gradient background
    const imgRef = useRef<HTMLImageElement | null>(null)
    const [gradientColors, setGradientColors] = useState<string[]>(['rgba(34,34,34,0.25)', 'rgba(34,34,34,0.25)'])

    // Mini player context
    const { play, player, pause } = useMiniPlayer()

    // Parallel audio processing
    const analysisAudioRef = useRef<HTMLAudioElement>(null)
    // Determinar si la estación actual está sonando
    const isCurrentStationPlaying = player && player.station?.id === station.id && player.isPlaying

    useEffect(() => {
        const audio = analysisAudioRef.current
        if (!audio) return

        const stream = station.streamUrl
        if (!stream) {
            console.warn("No hay streamUrl en station");
            return;
        }


        audio.crossOrigin = 'anonymous'
        audio.src = station.streamUrl    // o station.urlResolved
        audio.muted = true               // para no interferir con mini-player
        audio.play().catch(() => {})     // inicia el análisis
    }, [station.streamUrl])

    const handleSend = () => {
        if (chatInput.trim()) {
            setChatMessages([...chatMessages, { user: 'Tú', message: chatInput }])
            setChatInput('')
        }
    }

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatMessages])

    const genreNames = useGenreNames(station.genreIds, station.ownerId)

    return (
        <div className="max-w-7xl mx-auto pt-8 pb-32 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Station Info */}

            <div className="lg:col-span-2 flex flex-col gap-8">
                {/* Station Header */}
                <div
                    className="flex flex-col relative z-10 md:flex-row gap-8 items-start md:items-center rounded-xs border p-6 shadow-sm text-white transition-all duration-500 ease-in-out"
                    style={{
                        background: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`,
                        borderRight: `1px solid ${gradientColors[1] || 'rgba(34,34,34,0.25)'}`,
                        borderLeft: `1px solid ${gradientColors[0] || 'rgba(34,34,34,0.25)'}`
                    }}
                >
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-md rounded-xs pointer-events-none z-0" />

                    <div className="z-10 w-40 h-40 rounded-xs overflow-hidden bg-gradient-to-br from-zinc-200 to-zinc-400 flex items-center justify-center border">
                        {station.coverImage ? (
                            <img
                                ref={imgRef}
                                crossOrigin="anonymous"
                                src={withImageProxy(station.coverImage)}
                                alt={station.name}
                                className="w-full h-full object-cover"
                                onLoad={() => {
                                    const img = imgRef.current;
                                    if (img && img.complete) {
                                        try {
                                            const thief = new ColorThief();
                                            const palette = thief.getPalette(img, 2);
                                            if (palette && palette.length >= 2) {
                                                const [c1, c2] = palette;
                                                setGradientColors([
                                                    `rgba(${c1[0]},${c1[1]},${c1[2]},0.85)`,
                                                    `rgba(${c2[0]},${c2[1]},${c2[2]},0.85)`
                                                ]);
                                            } else if (palette && palette.length === 1) {
                                                const c1 = palette[0];
                                                setGradientColors([
                                                    `rgba(${c1[0]},${c1[1]},${c1[2]},0.85)`,
                                                    'rgba(34,34,34,0.25)'
                                                ]);
                                            } else {
                                                setGradientColors(['rgba(34,34,34,0.25)', 'rgba(34,34,34,0.25)']);
                                            }
                                        } catch (err) {
                                            setGradientColors(['rgba(34,34,34,0.25)', 'rgba(34,34,34,0.25)']);
                                            console.error('Color extraction failed', err);
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <span className="text-4xl font-bold text-zinc-500">🎵</span>
                        )}
                    </div>

                    <div className="flex-1 z-10 min-w-0">
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={() => {
                                    if (isCurrentStationPlaying) {
                                        pause && pause();
                                    } else {
                                        play && play({ station });
                                    }
                                }}
                                className="rounded-full p-3 bg-white/20 hover:bg-white/30 text-white transition-colors"
                                aria-label={isCurrentStationPlaying ? 'Pausar' : 'Reproducir'}
                            >
                                {isCurrentStationPlaying ? (
                                    <IconPlayerPause size={22} />
                                ) : (
                                    <IconPlayerPlay size={22} />
                                )}
                            </button>

                            <h1 className="text-3xl font-bold leading-tight tracking-tight font-[Inter]">
                                <LongText className="max-w-xs" contentClassName="max-w-xs whitespace-normal" >
                                    {station.name.length > 25 ? station.name.slice(0, 25) + '...' : station.name}
                                </LongText>
                            </h1>
                        </div>
                        <div className="flex flex-nowrap gap-2 mb-4 overflow-x-auto scrollbar-none -mx-1 px-1 py-2">
                            {station.genreIds?.length ? (
                                station.ownerId === 'radiobrowser' ? (
                                    station.genreIds.map((g, i) => (
                                        <Badge
                                            key={i}
                                            className="shrink-0 text-xs rounded-xs uppercase tracking-wide border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/10 text-white backdrop-blur-sm select-none"
                                        >
                                            {g}
                                        </Badge>
                                    ))
                                ) : (
                                    genreNames ? genreNames.map((name, i) => (
                                        <Badge
                                            key={i}
                                            className="shrink-0 text-xs rounded-xs uppercase tracking-wide border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/10 text-white backdrop-blur-sm select-none"
                                        >
                                            {name}
                                        </Badge>
                                    )) : <Badge variant="outline">Cargando géneros...</Badge>
                                )
                            ) : <Badge variant="outline">Sin género</Badge>}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 text-sm px-2 md:px-0">
                    <p className="text-muted-foreground max-w-md md:max-w-xs" style={{ wordBreak: 'break-word' }}>{station.description || 'Sin descripción'}</p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-zinc-300">
                        <IconHeart className="h-4 w-4 text-red-500" />
                        <span>{station.favoritesCount}</span>
                        </div>

                        <div className="text-zinc-400">
                        País: <span className="font-medium">{station.countryId || 'Desconocido'}</span>
                        </div>
                    </div>
                </div>


                {/* Waveform / Player visual (placeholder) */}
                <div className="w-full">
                    <AudioSpectrum
                    id="audio-spectrum"
                    height={80}
                    width={1000}
                    audioId="audio-analysis"
                    capColor="#ffffff"
                    capHeight={2}
                    meterWidth={3}
                    meterCount={64}
                    meterColor={[
                        { stop: 0, color: '#10B981' }, // emerald-500
                        { stop: 0.5, color: '#3B82F6' }, // blue-500
                        { stop: 1, color: '#8B5CF6' }, // violet-500
                    ]}
                    gap={2}
                    />
                </div>

                <audio id="audio-analysis" ref={analysisAudioRef} className="hidden" />
            </div>

            {/* Chat estilo Twitch a la derecha */}
            <aside className="lg:col-span-1 bg-card rounded-xs border shadow-md flex flex-col h-[520px] max-h-[80vh]">
                <div className="flex items-center justify-center p-2.5 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-sm font-bold tracking-tight">Stream chat</h2>
                </div>
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-4 bg-card">
                    {chatMessages.map((msg, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm leading-snug">
                            <span className="font-semibold text-primary">{msg.user}:</span>
                            <span className="text-zinc-700 dark:text-zinc-200">{msg.message}</span>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                
                {/* Input area */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-2 bg-zinc-50 dark:bg-zinc-900">
                    <input
                        type="text"
                        aria-label='Chat input'
                        className="w-full mb-2 rounded-xs border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Send a message..."
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
                    />
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 text-sm">
                            <span className="text-xs">💎 0</span>
                            <span className="text-xs">😊 0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                                <IconSettings size={18} />
                            </Button>
                            <Button size="sm" onClick={handleSend} className="rounded-xs h-8 px-4 text-sm">Chat</Button>
                        </div>
                    </div>
                </div>
            </aside>
            {/* Mini Player */}
            {player && (
                <MiniPlayer />
            )}
        </div>
    )
}