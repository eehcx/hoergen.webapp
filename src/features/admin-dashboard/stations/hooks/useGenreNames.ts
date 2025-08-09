import { useQueries } from '@tanstack/react-query'
import { GenreService } from '@/core/services/genres/genre.service'
import { GenreResponseDto } from '@/core/types/genre.types'

export function useGenreNames(genreIds: string[] | undefined) {
    const queries = useQueries({
        queries: !genreIds || !genreIds.length
            ? []
            : genreIds.map(id => ({
                queryKey: ['genre', id],
                queryFn: () => GenreService.getInstance().getGenreById(id),
                staleTime: 1000 * 60 * 10, // 10 minutos
            }))
    })

    if (!genreIds || !genreIds.length) {
        return []
    }

    const isLoading = queries.some(q => q.isLoading)
    const isError = queries.some(q => q.isError)
    const genreNames = queries.map(q => (q.data as GenreResponseDto | undefined)?.name || '')

    if (isLoading) return undefined // loading
    if (isError) return null // error
    return genreNames
}
