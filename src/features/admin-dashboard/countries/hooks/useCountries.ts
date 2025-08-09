import { useQuery } from '@tanstack/react-query'
import { CountryService } from '@/core/services/countries/country.service'
//import type { CountryResponseDto } from '@/core/types'

export function useCountries() {
    return useQuery({
        queryKey: ['countries'],
        queryFn: async () => {
            const countries = await CountryService.getInstance().getAllCountries()
            return countries
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 3,
    })
}
