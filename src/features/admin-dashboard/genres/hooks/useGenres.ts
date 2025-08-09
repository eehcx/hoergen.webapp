import { useQuery } from '@tanstack/react-query'
import { GenreService } from '@/core/services/genres/genre.service'

export function useGenres() {
    return useQuery({
        queryKey: ['genres'],
        queryFn: async () => {
            const genres = await GenreService.getInstance().getAllGenres()
            return genres
        },
        staleTime: 5 * 60 * 1000,
        retry: 3,
    })
}
