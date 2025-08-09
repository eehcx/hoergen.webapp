export interface CreateCountryDto {
    isoCode: string        // Required - ISO code (2-3 characters)
    name: string           // Required - Country name
    localName: string      // Required - Local name of country
    continent: string      // Required - Continent name
    languages: string[]    // Required - Array of spoken languages
    dialingCode: string    // Required - Phone dialing code
    capital: string        // Required - Capital city
    currency: string       // Required - Currency used
    stationCount: number   // Required - Number of stations (min: 0)
    popularStations?: string[] // Optional - Array of popular station names
    searchTerms?: string[] // Optional - Array of search terms
}

export interface CountryResponseDto {
    id: string
    isoCode: string
    name: string
    localName: string
    continent: string
    languages: string[]
    dialingCode: string
    capital: string
    currency: string
    stationCount: number
    popularStations: string[]
    createdAt: {
        _seconds: number;
        _nanoseconds: number;
    } | string
    updatedAt: {
        _seconds: number;
        _nanoseconds: number;
    } | string
    searchTerms: string[]
}

export interface CountryQueryParams {
    continent?: string
    language?: string
}
