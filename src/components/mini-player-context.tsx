import { createContext, useContext, useState } from 'react'

type PlayerState = {
  streamUrl: string
  stationName: string
  stationCover?: string
}

type PlayerContextType = {
  player: PlayerState | null
  play: (data: PlayerState) => void
  stop: () => void
}

const MiniPlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function MiniPlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<PlayerState | null>(null)
  const play = (data: PlayerState) => setPlayer(data)
  const stop = () => setPlayer(null)
  return (
    <MiniPlayerContext.Provider value={{ player, play, stop }}>
      {children}
    </MiniPlayerContext.Provider>
  )
}

export function useMiniPlayer() {
  const ctx = useContext(MiniPlayerContext)
  if (!ctx) throw new Error('useMiniPlayer must be used within MiniPlayerProvider')
  return ctx
}
