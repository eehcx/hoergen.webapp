import { useQuery } from '@tanstack/react-query'
import { CountryService } from '@/core/services/countries/country.service'
import type { CountryResponseDto } from '@/core/types/country.types'

export function useCountryCurrencies() {
    return useQuery({
        queryKey: ['country-currencies'],
        queryFn: async () => {
            const countries: CountryResponseDto[] = await CountryService.getInstance().getAllCountries()
            // Extraer y filtrar currencies únicos
            const currencySet = new Set<string>()
            countries.forEach(country => {
                if (country.currency) currencySet.add(country.currency)
            })
            return Array.from(currencySet)
        },
        staleTime: 24 * 60 * 60 * 1000, // 1 día
        retry: 2,
    })
}
