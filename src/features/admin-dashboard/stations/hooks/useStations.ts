import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { StationService } from '@/core/services/stations/station.service'
import type { ResponseStationDto } from '@/core/types'
import { useGenreNames } from './useGenreNames'

// Función para transformar los datos de estación si es necesario
function transformStationData(stations: ResponseStationDto[]): ResponseStationDto[] {
    return stations.map((station) => ({
        ...station,
        favoritesCount: station.favoritesCount || 0,
        genreIds: station.genreIds || [],
        coverImage: station.coverImage || '',
        liveInfo: station.liveInfo || '',
        description: station.description || '',
    }))
}

export function useStations() {
    const { data: stations = [], ...rest } = useQuery({
        queryKey: ['stations'],
        queryFn: async () => {
            const stations = await StationService.getInstance().getAllStations()
            return transformStationData(stations)
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 3,
    })

    const allGenreIds = useMemo(
        () => Array.from(new Set(stations.flatMap(station => station.genreIds))),
        [stations]
    )

    // genres hook
    const genreNames = useGenreNames(allGenreIds)

    const stationsWithGenreNames = useMemo(() => {
        if (!genreNames) return stations
        return stations.map(station => ({
            ...station,
            genreNames: station.genreIds.map((id: string) => {
                const idx = allGenreIds.indexOf(id)
                return genreNames[idx] || id
            })
        }))
    }, [stations, genreNames, allGenreIds])

    return {
        data: stationsWithGenreNames,
        ...rest,
    }
}
