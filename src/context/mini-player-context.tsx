import { createContext, useContext, useState } from 'react'
import { ResponseStationDto } from '@/core/types'
import { useAuth } from '@/hooks'
import { useCreateHistory } from '@/hooks/history/useHistory'

type PlayerState = {
  station: ResponseStationDto
  isPlaying?: boolean
}

type PlayerContextType = {
  player: PlayerState | null
  play: (data: PlayerState) => void
  stop: () => void
  pause: () => void
  resume: () => void
  setIsPlaying: (isPlaying: boolean) => void
}

const MiniPlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function MiniPlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<PlayerState | null>(null)
  const { user } = useAuth()
  const createHistory = useCreateHistory()
  
  const play = (data: PlayerState) => {
    setPlayer({ ...data, isPlaying: true })
    
    // Crear registro de historial cuando se inicia la reproducción
    if (user?.uid && data.station?.id) {
      createHistory.mutate({
        stationId: data.station.id,
        userId: user.uid
      })
    }
  }
  const stop = () => setPlayer(null)
  const pause = () => setPlayer(prev => prev ? { ...prev, isPlaying: false } : null)
  const resume = () => setPlayer(prev => prev ? { ...prev, isPlaying: true } : null)
  const setIsPlaying = (isPlaying: boolean) => setPlayer(prev => prev ? { ...prev, isPlaying } : null)
  
  return (
    <MiniPlayerContext.Provider value={{ player, play, stop, pause, resume, setIsPlaying }}>
      {children}
    </MiniPlayerContext.Provider>
  )
}

export function useMiniPlayer() {
  const ctx = useContext(MiniPlayerContext)
  if (!ctx) throw new Error('useMiniPlayer must be used within MiniPlayerProvider')
  return ctx
}
