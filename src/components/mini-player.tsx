import { useEffect, useRef, useState } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

export interface MiniPlayerProps {
    streamUrl: string
    stationName: string
    stationCover?: string
}

export function MiniPlayer({ streamUrl, stationName, stationCover }: MiniPlayerProps) {
    const playerRef = useRef<AudioPlayer>(null)
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        playerRef.current?.audio.current?.play()
        setElapsed(0)
        const interval = setInterval(() => {
        const audio = playerRef.current?.audio.current
        if (audio && !audio.paused) {
            setElapsed(Math.floor(audio.currentTime))
        }
        }, 1000)
        return () => clearInterval(interval)
    }, [streamUrl])

    // Formatea el tiempo transcurrido en mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg flex items-center justify-center px-6 py-2 backdrop-blur-sm bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700/90"
            style={{ boxShadow: '0 -2px 16px 0 rgba(0,0,0,0.12)' }}
        >
            <div className="flex items-center gap-4 w-full max-w-5xl mx-auto">
                {stationCover && (
                <img src={stationCover} alt={stationName} className="w-12 h-12 object-cover" />
                )}
                <div className="flex flex-col justify-center min-w-0" style={{ minWidth: 0 }}>
                    <span className="inline-flex items-center gap-2 mb-1">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-red-500 uppercase tracking-widest">EN VIVO</span>
                    </span>
                    <span className="font-semibold truncate text-base text-foreground">{stationName}</span>
                </div>
                <div className="flex items-center justify-end gap-6 min-w-[120px] flex-1">
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="w-[320px] max-w-[400px]">
                            <AudioPlayer
                                ref={playerRef}
                                src={streamUrl}
                                autoPlay
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
                                    minWidth: 300,
                                    maxWidth: 400,
                                }}
                                className="!bg-transparent !shadow-none !border-0 !p-0"
                            />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Escuchando: {formatTime(elapsed)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
