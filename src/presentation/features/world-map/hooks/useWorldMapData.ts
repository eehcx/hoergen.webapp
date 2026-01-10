import { useMemo, useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { StationService, CountryService, CountryCoordinatesService, radioBrowserService } from '@/core/services'
import { ResponseStationDto, RadioBrowserStation } from '@/core/types'
import type { CountryCoordinates } from '@/core/services/country-coordinates.service.ts'
import { normalizeRadioBrowserStation } from '@/utils'

export function useWorldMapData() {
  // Estado para Radio Browser stations (carga progresiva optimizada)
  const [radioBrowserStations, setRadioBrowserStations] = useState<RadioBrowserStation[]>([])
  const [isLoadingRadioBrowser, setIsLoadingRadioBrowser] = useState(false)
  const [isRadioBrowserLoaded, setIsRadioBrowserLoaded] = useState(false)

  // Cache de coordenadas de países
  const [countryCoordinates, setCountryCoordinates] = useState<Map<string, CountryCoordinates>>(new Map())

  // Query optimizada para países
  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const service = CountryService.getInstance()
      const result = await service.getAllCountries()
      console.log(`🌍 Países cargados: ${result.length}`)
      return result
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false
  })

  // Query optimizada para estaciones internas
  const { data: internalStations = [], isLoading: isLoadingInternal } = useQuery({
    queryKey: ['internalStations'],
    queryFn: async () => {
      console.log('🏢 Cargando estaciones internas...')
      const service = StationService.getInstance()
      const stations = await service.getAllStations()
      console.log(`✅ Estaciones internas: ${stations.length}`)
      return stations
    },
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false
  })

  // Carga progresiva optimizada usando todos los países de la DB
  const loadRadioBrowserStations = useCallback(async () => {
    if (isRadioBrowserLoaded || isLoadingRadioBrowser || !countries.length) return

    setIsLoadingRadioBrowser(true)
    console.log(`🚀 Iniciando carga optimizada de estaciones para ${countries.length} países...`)

    try {
      const initialStations: RadioBrowserStation[] = []
      
      // FASE 1: Carga SÚPER RÁPIDA - Solo 2-3 estaciones por los primeros 10 países
      const priorityCountries = countries.slice(0, 10)
      
      console.log(`⚡ Fase 1: Carga rápida de ${priorityCountries.length} países (2-3 estaciones c/u)`)
      
      const fastPromises = priorityCountries.map(async (country) => {
        try {
          const stations = await radioBrowserService.searchStationsByCountryCode(country.isoCode, 3) // Solo 3 estaciones
          console.log(`⚡ ${country.isoCode} (${country.name}): ${stations.length} estaciones`)
          return stations.filter(station => 
            station.name?.trim() && 
            station.country?.trim() && 
            station.url_resolved?.trim() &&
            station.lastcheckok === 1 &&
            station.bitrate >= 64 &&
            !station.name.toLowerCase().includes('test')
          ).slice(0, 2) // Limitar a máximo 2 por país en fase rápida
        } catch (error) {
          console.error(`❌ Error ${country.isoCode}:`, error)
          return []
        }
      })

      const fastResults = await Promise.all(fastPromises)
      fastResults.forEach(stations => initialStations.push(...stations))

      // Aplicar inmediatamente las estaciones iniciales
      setRadioBrowserStations(initialStations)
      setIsLoadingRadioBrowser(false)
      console.log(`✅ Carga rápida: ${initialStations.length} estaciones de ${priorityCountries.length} países`)

      // FASE 2: Expandir países iniciales + agregar más países (5-8 estaciones por país)
      setTimeout(async () => {
        console.log(`🔄 Fase 2: Expandiendo estaciones...`)
        try {
          const phase2Stations = [...initialStations]
          const nextCountries = countries.slice(10, 25) // Siguientes 15 países
          
          // Expandir países iniciales con más estaciones
          const expandPromises = priorityCountries.map(async (country) => {
            try {
              const stations = await radioBrowserService.searchStationsByCountryCode(country.isoCode, 8)
              return stations.filter(station => 
                station.name?.trim() && 
                station.url_resolved?.trim() &&
                station.lastcheckok === 1 &&
                station.bitrate >= 48 &&
                !phase2Stations.some(existing => existing.stationuuid === station.stationuuid)
              ).slice(0, 6) // Hasta 6 más por país inicial
            } catch (error) {
              return []
            }
          })

          // Agregar nuevos países
          const newCountriesPromises = nextCountries.map(async (country) => {
            try {
              const stations = await radioBrowserService.searchStationsByCountryCode(country.isoCode, 5)
              console.log(`🌐 Fase 2 ${country.isoCode}: ${stations.length}`)
              return stations.filter(station => 
                station.name?.trim() && 
                station.url_resolved?.trim() &&
                station.lastcheckok === 1 &&
                station.bitrate >= 48 &&
                !phase2Stations.some(existing => existing.stationuuid === station.stationuuid)
              ).slice(0, 4) // 4 estaciones por país nuevo
            } catch (error) {
              return []
            }
          })

          const [expandResults, newResults] = await Promise.all([
            Promise.all(expandPromises),
            Promise.all(newCountriesPromises)
          ])
          
          expandResults.forEach(stations => phase2Stations.push(...stations))
          newResults.forEach(stations => phase2Stations.push(...stations))
          
          setRadioBrowserStations(phase2Stations)
          console.log(`✅ Fase 2: ${phase2Stations.length} estaciones total`)
          
        } catch (error) {
          console.error('❌ Error Fase 2:', error)
        }
      }, 1500) // Más rápido - 1.5 segundos

      // FASE 3: Completar TODOS los países con MUCHAS estaciones (10-15 por país)
      setTimeout(async () => {
        console.log(`🎯 Fase 3: Carga completa de todos los países...`)
        try {
          const finalStations = [...initialStations] // Empezar desde el estado actual
          
          // Re-expandir TODOS los países con muchas más estaciones
          const allCountriesPromises = countries.map(async (country) => {
            try {
              const stations = await radioBrowserService.searchStationsByCountryCode(country.isoCode, 500) // Buscar hasta 500
              console.log(`🎯 Final ${country.isoCode}: ${stations.length}`)
              return stations.filter(station => 
                station.name?.trim() && 
                station.url_resolved?.trim() &&
                station.lastcheckok === 1 &&
                station.bitrate >= 24 && // Bitrate más bajo para mayor variedad
                !finalStations.some(existing => existing.stationuuid === station.stationuuid)
              ).slice(0, 500) // Hasta 500 estaciones por país
            } catch (error) {
              console.error(`❌ Error final ${country.isoCode}:`, error)
              return []
            }
          })

          const finalResults = await Promise.all(allCountriesPromises)
          finalResults.forEach(stations => {
            // Evitar duplicados al agregar
            stations.forEach(station => {
              if (!finalStations.some(existing => existing.stationuuid === station.stationuuid)) {
                finalStations.push(station)
              }
            })
          })
          
          setRadioBrowserStations(finalStations)
          setIsRadioBrowserLoaded(true)
          console.log(`🎉 CARGA FINAL: ${finalStations.length} estaciones de ${countries.length} países`)
          
        } catch (error) {
          console.error('❌ Error Fase 3:', error)
          setIsRadioBrowserLoaded(true)
        }
      }, 5000) // 5 segundos para la carga masiva
      
    } catch (error) {
      console.error('❌ Error carga inicial:', error)
      setIsLoadingRadioBrowser(false)
    }
  }, [isRadioBrowserLoaded, isLoadingRadioBrowser, countries, internalStations])

  // Efecto para inicializar todo
  useEffect(() => {
    const initializeData = async () => {
      if (!countries.length) return

      // 1. Cargar coordenadas si no están cargadas
      if (countryCoordinates.size === 0) {
        console.log('📍 Cargando coordenadas...')
        const coordinatesService = CountryCoordinatesService.getInstance()
        
        try {
          const isoCodes = countries.map(c => c.isoCode)
          const coords = await coordinatesService.getMultipleCoordinates(isoCodes)
          setCountryCoordinates(coords)
          console.log(`✅ Coordenadas: ${coords.size} países`)
        } catch (error) {
          console.error('❌ Error coordenadas:', error)
          // Usar coordenadas fallback básicas
          const fallback = new Map<string, CountryCoordinates>()
          fallback.set('US', { lat: 39.8283, lng: -98.5795, name: 'United States', isoCode: 'US' })
          fallback.set('DE', { lat: 51.1657, lng: 10.4515, name: 'Germany', isoCode: 'DE' })
          fallback.set('GB', { lat: 55.3781, lng: -3.4360, name: 'United Kingdom', isoCode: 'GB' })
          setCountryCoordinates(fallback)
        }
      }

      // 2. Iniciar carga de estaciones Radio Browser
      if (!isRadioBrowserLoaded && !isLoadingRadioBrowser) {
        loadRadioBrowserStations()
      }
    }

    initializeData()
  }, [countries, countryCoordinates.size, loadRadioBrowserStations, isRadioBrowserLoaded, isLoadingRadioBrowser])

  // Procesamiento optimizado de datos del mapa
  const processedData = useMemo(() => {
    console.log('🔄 Procesando datos del mapa...')
    
    const stationsByCountry = new Map<string, (ResponseStationDto | RadioBrowserStation)[]>()

    // 1. Agregar estaciones internas (prioridad)
    internalStations.forEach(station => {
      const country = countries.find(c => c.isoCode === station.countryId)
      if (country) {
        if (!stationsByCountry.has(country.name)) {
          stationsByCountry.set(country.name, [])
        }
        stationsByCountry.get(country.name)!.push(station)
      }
    })

    // 2. Agregar estaciones Radio Browser normalizadas
    radioBrowserStations.forEach(station => {
      const normalized = normalizeRadioBrowserStation(station)
      const country = countries.find(c => c.isoCode === normalized.countryId)
      if (country) {
        if (!stationsByCountry.has(country.name)) {
          stationsByCountry.set(country.name, [])
        }
        stationsByCountry.get(country.name)!.push(normalized)
      }
    })

    const result = Array.from(stationsByCountry.entries()).map(([countryName, stations]) => ({
      countryName,
      stationCount: stations.length,
      stations: stations.slice(0, 500) // Limitar a 500 estaciones por país para rendimiento
    }))

    console.log(`📊 Países procesados: ${result.length}, Total estaciones: ${result.reduce((sum, r) => sum + r.stationCount, 0)}`)
    return result
  }, [radioBrowserStations, internalStations, countries])

  // Generación optimizada de puntos del globo
  const globePoints = useMemo(() => {
    if (!countries.length) return []

    // Coordenadas fallback para países principales
    const fallbackCoords: Record<string, { lat: number, lng: number }> = {
      'US': { lat: 39.8283, lng: -98.5795 },
      'DE': { lat: 51.1657, lng: 10.4515 },
      'GB': { lat: 55.3781, lng: -3.4360 },
      'FR': { lat: 46.2276, lng: 2.2137 },
      'ES': { lat: 40.4637, lng: -3.7492 },
      'IT': { lat: 41.8719, lng: 12.5674 },
      'CA': { lat: 56.1304, lng: -106.3468 },
      'AU': { lat: -25.2744, lng: 133.7751 },
      'BR': { lat: -14.2350, lng: -51.9253 },
      'MX': { lat: 23.6345, lng: -102.5528 },
      'JP': { lat: 36.2048, lng: 138.2529 },
      'CN': { lat: 35.8617, lng: 104.1954 },
      'IN': { lat: 20.5937, lng: 78.9629 },
      'RU': { lat: 61.5240, lng: 105.3188 },
      'ZA': { lat: -30.5595, lng: 22.9375 },
      'AR': { lat: -38.4161, lng: -63.6167 },
      'KR': { lat: 35.9078, lng: 127.7669 },
      'NL': { lat: 52.1326, lng: 5.2913 },
      'SE': { lat: 60.1282, lng: 18.6435 },
      'NO': { lat: 60.4720, lng: 8.4689 },
      'PL': { lat: 51.9194, lng: 19.1451 },
      'PT': { lat: 39.3999, lng: -8.2245 },
      'CH': { lat: 46.8182, lng: 8.2275 },
      'AT': { lat: 47.5162, lng: 14.5501 },
      'DK': { lat: 56.2639, lng: 9.5018 },
      'EG': { lat: 26.8206, lng: 30.8025 }
    }

    const points = countries.map(country => {
      const countryData = processedData.find(d => d.countryName === country.name)
      const stationCount = countryData?.stationCount || 0
      
      // Obtener coordenadas (servicio o fallback)
      const coords = countryCoordinates.get(country.isoCode.toUpperCase()) || 
                    fallbackCoords[country.isoCode.toUpperCase()]
      
      if (!coords) return null

      // Color y tamaño optimizado
      let size = 0.4 // Gris (sin estaciones)
      let color = '#666666'
      
      if (stationCount > 0) {
        color = '#10B981' // Verde para estaciones
        size = Math.min(0.6 + (stationCount * 0.1), 2.5) // Tamaño dinámico
      }

      return {
        lat: coords.lat,
        lng: coords.lng,
        size,
        color,
        country: country.name,
        stationCount,
        countryId: country.id,
        countryIsoCode: country.isoCode
      }
    }).filter((point): point is NonNullable<typeof point> => point !== null)

    console.log(`🌍 Puntos generados: ${points.length}`)
    return points
  }, [countries, processedData, countryCoordinates])

  return {
    // Datos del mapa
    countryData: processedData,
    globePoints,
    
    // Estados de carga optimizados
    isLoading: isLoadingCountries || isLoadingInternal,
    isLoadingRadioBrowser,
    error: null,
    
    // Datos de estaciones
    internalStations,
    radioBrowserStations,
    
    // Metadatos útiles
    stats: {
      totalCountries: countries.length,
      countriesWithStations: processedData.length,
      totalStations: processedData.reduce((sum, data) => sum + data.stationCount, 0),
      internalStationsCount: internalStations.length,
      radioBrowserStationsCount: radioBrowserStations.length
    },
    
    // Funciones de control
    refetchStations: loadRadioBrowserStations
  }
}
