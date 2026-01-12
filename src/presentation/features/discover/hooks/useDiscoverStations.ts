import { useMemo } from 'react'
import { useRadioBrowserStations, type RadioBrowserStationsParams } from '@/presentation/hooks/radio-browser'
import type { RadioBrowserStation } from '@/core/types'

export interface DiscoverStationsResult {
    featuredStation: RadioBrowserStation | null
    liveStations: RadioBrowserStation[]
    madeForYouStations: RadioBrowserStation[]
    creatorNames: Record<string, string>
    isLoading: boolean
    isError: boolean
    refetch?: () => void
}

export const useDiscoverStations = (params: RadioBrowserStationsParams = {}): DiscoverStationsResult => {
    const { stations = [], isLoading, error, refetch } = useRadioBrowserStations(params)

    const featuredStation = useMemo(() => {
        if (!stations.length) return null
        return stations[Math.floor(Math.random() * stations.length)]
    }, [stations])

    const liveStations = useMemo(() => stations.slice(0, 3), [stations])

    const madeForYouStations = useMemo(() => {
        if (!stations.length) return []
        const pool = stations.filter(s => s.stationuuid !== featuredStation?.stationuuid)
        const shuffled = [...pool].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, 2)
    }, [stations, featuredStation])

    const creatorNames = useMemo(() => {
        const map: Record<string, string> = {}
        ;[...liveStations, ...madeForYouStations, ...(featuredStation ? [featuredStation] : [])].forEach(s => {
        map[s.stationuuid] = `${s.country} • ${s.language}`
        })
        return map
    }, [liveStations, madeForYouStations, featuredStation])

    return {
        featuredStation,
        liveStations,
        madeForYouStations,
        creatorNames,
        isLoading,
        isError: !!error,
        refetch,
    }
}