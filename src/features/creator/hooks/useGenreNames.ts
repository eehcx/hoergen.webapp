import { useEffect, useState } from "react"
import { GenreService } from "@/core/services/genres/genre.service"
import type { ResponseStationDto } from "@/core/types/station.types"

export function useGenreNames(stations: ResponseStationDto[] | undefined) {
    const [genreNamesMap, setGenreNamesMap] = useState<Record<string, string>>({})
    useEffect(() => {
        if (!stations || stations.length === 0) {
            setGenreNamesMap({})
            return
        }

        let isMounted = true
        const fetchGenres = async () => {
        
        const allIds = Array.from(new Set(stations.flatMap((s: ResponseStationDto) => s.genreIds as string[])))
        const promises = allIds.map((id: string) => GenreService.getInstance().getGenreById(id))
        const results = await Promise.all(promises)
        const map: Record<string, string> = {}
        allIds.forEach((id: string, idx: number) => {
            map[id] = (results[idx] as { name?: string })?.name || id
        })
        if (isMounted) setGenreNamesMap(map)
        }
        fetchGenres()
        return () => { isMounted = false }
    }, [stations])
    return genreNamesMap
}
