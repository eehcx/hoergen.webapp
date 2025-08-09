//import { useEffect, useState } from 'react'
import { useMiniPlayer } from '@/context/mini-player-context'

export function PlaybackVisualizer() {
    const { player } = useMiniPlayer()
    const isPlaying = !!(player?.isPlaying && player.station)

    // Generamos 20 barras con desfase de animación variable
    const bars = Array.from({ length: 20 }).map((_, i) => (
        <div
        key={i}
        className={`bg-primary flex-1 rounded-sm ${
            isPlaying ? 'animate-[pulse_1.2s_ease-in-out_infinite]' : ''
        }`}
        style={{
            animationDelay: `${(i % 5) * 0.1}s`,
            height: `${20 + (i % 5) * 15}%`,
        }}
        />
    ))

    return (
        <div
        aria-hidden={!isPlaying}
        className="w-full h-16 flex items-end gap-1 overflow-hidden bg-card rounded border"
        >
        {bars}
        </div>
    )
}
