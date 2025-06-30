import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { useMiniPlayer } from '../context/mini-player-context'
import { toast } from 'sonner'
// Utils
import { slugify } from '@/lib/utils/slugify'
import { formatTime } from '@/lib/utils/format'
import { truncateStationName } from '@/lib/utils/format'

export function MiniPlayer() {
    const playerRef = useRef<AudioPlayer>(null)
    const [elapsed, setElapsed] = useState(0)
    const { player, setIsPlaying } = useMiniPlayer()
    const [errorToastShown, setErrorToastShown] = useState(false)

    if (!player) return null

    const { station, isPlaying = true } = player
    const { streamUrl, name: stationName, coverImage: stationCover, genreIds, ...rest } = station


    const [currentStreamUrl, setCurrentStreamUrl] = useState<string>('')
    // Solo reproduce automáticamente cuando cambia a una nueva estación
    useEffect(() => {
        const isNewStation = streamUrl !== currentStreamUrl
        if (isNewStation) {
            setCurrentStreamUrl(streamUrl)
            setElapsed(0)
            // Solo reproduce automáticamente si es una nueva estación Y isPlaying es true
            if (isPlaying && playerRef.current?.audio.current) {
                const playPromise = playerRef.current.audio.current.play()
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Auto-play was prevented by browser
                    })
                }
            }
        }
    }, [streamUrl, isPlaying, currentStreamUrl])

    // Maneja el estado de reproducción cuando cambia isPlaying (pero NO para nuevas estaciones)
    useEffect(() => {
        const isNewStation = streamUrl !== currentStreamUrl
        if (!isNewStation && playerRef.current?.audio.current) {
            if (isPlaying) {
                const playPromise = playerRef.current.audio.current.play()
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Play was prevented by browser
                    })
                }
            } else {
                playerRef.current.audio.current.pause()
            }
        }
    }, [isPlaying, streamUrl, currentStreamUrl])

    // Efecto adicional para manejar el estado cuando el componente se monta con un estado específico
    useEffect(() => {
        const timer = setTimeout(() => {
            if (playerRef.current?.audio.current) {
                const audio = playerRef.current.audio.current
                // Si el estado actual del audio no coincide con isPlaying, corregirlo
                if (isPlaying && audio.paused) {
                    const playPromise = audio.play()
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {
                            // Play was prevented on mount
                        })
                    }
                } else if (!isPlaying && !audio.paused) {
                    audio.pause()
                }
            }
        }, 100) // Pequeño delay para asegurar que el audio esté listo

        return () => clearTimeout(timer)
    }, []) // Solo se ejecuta una vez al montar el componente

    // Contador de tiempo
    useEffect(() => {
        const interval = setInterval(() => {
            const audio = playerRef.current?.audio.current
            if (audio && !audio.paused) {
                setElapsed(Math.floor(audio.currentTime))
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Manejadores de eventos del audio player
    const handlePlay = () => {
        setIsPlaying(true)
    }

    const handlePause = () => {
        setIsPlaying(false)
    }

    // Audio error handler
    const handleAudioError = (e: any) => {
        if (errorToastShown) return
        setErrorToastShown(true)
        let message = 'Unable to play this stream.'
        if (e?.target?.error) {
            switch (e.target.error.code) {
                case 1:
                    message = 'Playback aborted.'
                    break
                case 2:
                    message = 'Network error: Could not load the stream.'
                    break
                case 3:
                    message = 'Unsupported stream format.'
                    break
                case 4:
                    message = 'Stream cannot be played (possibly geo-restricted or offline).'
                    break
                default:
                    message = 'Unknown playback error.'
            }
        }
        toast.error(message, { duration: 5000 })
        setTimeout(() => setErrorToastShown(false), 6000)
    }

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg flex items-center justify-center px-6 py-1 backdrop-blur-sm bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-100/90 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700/90"
            style={{ boxShadow: '0 -2px 16px 0 rgba(0,0,0,0.12)' }}
        >
            <div className="flex items-center gap-4 w-full max-w-5xl mx-auto">
                <Link 
                    to='/s/$stationSlug'
                    params={{ stationSlug: slugify(stationName) }}
                    search={station}
                    className='flex items-center gap-4 w-full max-w-[400px] min-w-0' style={{ minWidth: 0 }}
                >
                    {stationCover && (
                        <img 
                            src={stationCover} 
                            alt={stationName} 
                            className="w-10 h-10 object-cover"        
                            loading="lazy"
                            onError={e => { e.currentTarget.style.display = 'none' }}
                        />
                    )}
                    <div className="flex flex-col justify-center min-w-0" style={{ minWidth: 0 }}>
                        <span className="inline-flex items-center gap-2 mt-2">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">LIVE</span>
                        </span>
                        <span className="font-semibold truncate text-base text-foreground select-none">{truncateStationName(stationName)}</span>
                    </div>
                </Link>
                <div className="flex items-center justify-end gap-6 min-w-[120px] flex-1">
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="w-[400px] max-w-[400px]">
                            <AudioPlayer
                                ref={playerRef}
                                src={streamUrl}
                                autoPlay={false}
                                onPlay={handlePlay}
                                onPause={handlePause}
                                onError={handleAudioError}
                                showJumpControls={false}
                                showDownloadProgress={false}
                                showFilledProgress={false}
                                showFilledVolume={false}
                                hasDefaultKeyBindings={false}
                                customAdditionalControls={[]}
                                customProgressBarSection={[]}
                                customVolumeControls={[RHAP_UI.VOLUME]}
                                layout="horizontal"
                                style={{
                                    background: 'transparent',
                                    boxShadow: 'none',
                                    border: 'none',
                                    padding: 0,
                                    minWidth: 400,
                                    maxWidth: 400,
                                }}
                                className="!bg-transparent !shadow-none !border-0 !p-0"
                            />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Listening: {formatTime(elapsed)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
