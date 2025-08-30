interface CountryCoordinates {
  lat: number
  lng: number
  name: string
  isoCode: string
}

interface RestCountryResponse {
  name: {
    common: string
    official: string
  }
  cca2: string
  cca3: string
  latlng: [number, number]
}

class CountryCoordinatesService {
  private static instance: CountryCoordinatesService
  private coordinatesCache = new Map<string, CountryCoordinates>()
  private readonly baseUrl = 'https://restcountries.com/v3.1'

  private constructor() {}

  static getInstance(): CountryCoordinatesService {
    if (!CountryCoordinatesService.instance) {
      CountryCoordinatesService.instance = new CountryCoordinatesService()
    }
    return CountryCoordinatesService.instance
  }

  /**
   * Obtiene las coordenadas de un país por su ISO code
   */
  async getCoordinatesByIsoCode(isoCode: string): Promise<CountryCoordinates | null> {
    try {
      // Verificar cache primero
      const cached = this.coordinatesCache.get(isoCode.toUpperCase())
      if (cached) {
        return cached
      }

      // Intentar fallback primero para países principales
      const fallback = this.getFallbackCoordinates(isoCode)
      if (fallback) {
        this.coordinatesCache.set(isoCode.toUpperCase(), fallback)
        return fallback
      }

      // Llamar a la API REST Countries solo si no hay fallback
      const response = await fetch(`${this.baseUrl}/alpha/${isoCode}`, {
        signal: AbortSignal.timeout(5000) // 5 segundos timeout
      })
      
      if (!response.ok) {
        console.warn(`No se encontraron coordenadas para el país: ${isoCode}`)
        return null
      }

      const data: RestCountryResponse[] = await response.json()
      
      if (data.length === 0) {
        return null
      }

      const country = data[0]
      const coordinates: CountryCoordinates = {
        lat: country.latlng[0],
        lng: country.latlng[1],
        name: country.name.common,
        isoCode: country.cca2
      }

      // Guardar en cache
      this.coordinatesCache.set(isoCode.toUpperCase(), coordinates)
      
      return coordinates
    } catch (error) {
      console.error(`Error obteniendo coordenadas para ${isoCode}:`, error)
      
      // Intentar fallback como último recurso
      const fallback = this.getFallbackCoordinates(isoCode)
      if (fallback) {
        this.coordinatesCache.set(isoCode.toUpperCase(), fallback)
        return fallback
      }
      
      return null
    }
  }

  /**
   * Obtiene las coordenadas de múltiples países
   */
  async getMultipleCoordinates(isoCodes: string[]): Promise<Map<string, CountryCoordinates>> {
    const results = new Map<string, CountryCoordinates>()
    
    // Procesar en lotes para no sobrecargar la API
    const batchSize = 10
    for (let i = 0; i < isoCodes.length; i += batchSize) {
      const batch = isoCodes.slice(i, i + batchSize)
      
      const promises = batch.map(async (isoCode) => {
        const coords = await this.getCoordinatesByIsoCode(isoCode)
        if (coords) {
          results.set(isoCode.toUpperCase(), coords)
        }
      })

      await Promise.all(promises)
      
      // Pequeña pausa entre lotes
      if (i + batchSize < isoCodes.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return results
  }

  /**
   * Obtiene coordenadas por nombre de país (fallback)
   */
  async getCoordinatesByName(countryName: string): Promise<CountryCoordinates | null> {
    try {
      // Verificar cache por nombre
      const cached = Array.from(this.coordinatesCache.values())
        .find(coord => coord.name.toLowerCase() === countryName.toLowerCase())
      
      if (cached) {
        return cached
      }

      // Llamar a la API REST Countries por nombre
      const response = await fetch(`${this.baseUrl}/name/${encodeURIComponent(countryName)}`)
      
      if (!response.ok) {
        console.warn(`No se encontraron coordenadas para el país: ${countryName}`)
        return null
      }

      const data: RestCountryResponse[] = await response.json()
      
      if (data.length === 0) {
        return null
      }

      const country = data[0]
      const coordinates: CountryCoordinates = {
        lat: country.latlng[0],
        lng: country.latlng[1],
        name: country.name.common,
        isoCode: country.cca2
      }

      // Guardar en cache
      this.coordinatesCache.set(country.cca2, coordinates)
      
      return coordinates
    } catch (error) {
      console.error(`Error obteniendo coordenadas para ${countryName}:`, error)
      return null
    }
  }

  /**
   * Coordenadas hardcodeadas como fallback para países principales
   */
  private getFallbackCoordinates(isoCode: string): CountryCoordinates | null {
    const fallbackCoords: Record<string, CountryCoordinates> = {
      'US': { lat: 39.8283, lng: -98.5795, name: 'United States', isoCode: 'US' },
      'DE': { lat: 51.1657, lng: 10.4515, name: 'Germany', isoCode: 'DE' },
      'GB': { lat: 55.3781, lng: -3.4360, name: 'United Kingdom', isoCode: 'GB' },
      'FR': { lat: 46.2276, lng: 2.2137, name: 'France', isoCode: 'FR' },
      'ES': { lat: 40.4637, lng: -3.7492, name: 'Spain', isoCode: 'ES' },
      'IT': { lat: 41.8719, lng: 12.5674, name: 'Italy', isoCode: 'IT' },
      'CA': { lat: 56.1304, lng: -106.3468, name: 'Canada', isoCode: 'CA' },
      'AU': { lat: -25.2744, lng: 133.7751, name: 'Australia', isoCode: 'AU' },
      'BR': { lat: -14.2350, lng: -51.9253, name: 'Brazil', isoCode: 'BR' },
      'MX': { lat: 23.6345, lng: -102.5528, name: 'Mexico', isoCode: 'MX' },
      'AR': { lat: -38.4161, lng: -63.6167, name: 'Argentina', isoCode: 'AR' },
      'JP': { lat: 36.2048, lng: 138.2529, name: 'Japan', isoCode: 'JP' },
      'CN': { lat: 35.8617, lng: 104.1954, name: 'China', isoCode: 'CN' },
      'IN': { lat: 20.5937, lng: 78.9629, name: 'India', isoCode: 'IN' },
      'RU': { lat: 61.5240, lng: 105.3188, name: 'Russia', isoCode: 'RU' }
    }

    return fallbackCoords[isoCode.toUpperCase()] || null
  }

  /**
   * Obtiene coordenadas con fallback automático
   */
  async getCoordinatesWithFallback(isoCode: string): Promise<CountryCoordinates | null> {
    // Intentar API primero
    let coordinates = await this.getCoordinatesByIsoCode(isoCode)
    
    // Si falla, usar fallback
    if (!coordinates) {
      coordinates = this.getFallbackCoordinates(isoCode)
    }

    return coordinates
  }

  /**
   * Limpiar cache (útil para testing)
   */
  clearCache(): void {
    this.coordinatesCache.clear()
  }
}

export { CountryCoordinatesService }
export type { CountryCoordinates }
