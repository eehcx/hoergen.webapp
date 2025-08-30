import { useState, useRef, useEffect } from 'react'
import Globe from 'react-globe.gl'
import { Link } from '@tanstack/react-router'
import { ResponseStationDto, RadioBrowserStation } from '@/core/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Radio as RadioIcon, Heart, X } from 'lucide-react'
import { WorldMapHeader } from './components'
import { normalizeRadioBrowserStation, slugify } from '@/utils'
import { useTranslations } from './hooks/useTranslations'
import { useWorldMapData } from './hooks'
import { CountryService } from '@/core/services'
import { useQuery } from '@tanstack/react-query'
import './world-map.css'

// Hook personalizado para manejar todos los datos del mapa mundial

export default function WorldMap() {
  const [selectedCountry, setSelectedCountry] = useState<{
    countryId: string
    countryName: string
    countryIsoCode: string
    stationCount: number
    stations: (ResponseStationDto | RadioBrowserStation)[]
    coordinates: [number, number]
    countryDetails?: {
      name: string
      localName: string
      languages: string[]
    }
  } | null>(null)
  const [flagLoadingStates, setFlagLoadingStates] = useState<Record<string, boolean | 'error'>>({})
  const globeRef = useRef<any>(null)
  // Infinite scroll en modal del país
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const INITIAL_BATCH = 60
  const BATCH_SIZE = 50
  
  // Hook personalizado optimizado para manejar todos los datos
  const {
    countryData,
    globePoints,
    isLoading,
    isLoadingRadioBrowser,
    error,
    internalStations,
    radioBrowserStations,
    stats,
    refetchStations
  } = useWorldMapData()

  // Log para debug con estadísticas completas
  useEffect(() => {
    console.log('🗺️ WorldMap - Estado actual:', {
      isLoading,
      isLoadingRadioBrowser,
      error,
      countryDataLength: countryData.length,
      globePointsLength: globePoints.length,
      internalStationsCount: internalStations.length,
      radioBrowserStationsCount: radioBrowserStations.length,
      stats: stats
    })
  }, [isLoading, isLoadingRadioBrowser, error, countryData.length, globePoints.length, internalStations.length, radioBrowserStations.length, stats])

  // Hook de traducciones
  const { t } = useTranslations()

  // Query para países
  const countriesQuery = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const service = CountryService.getInstance()
      return await service.getAllCountries()
    }
  })

  // Ya no necesitamos inicializar regiones, se cargan automáticamente

  // Helper functions para manejar ambos tipos de estaciones

  const isRadioBrowserStation = (station: ResponseStationDto | RadioBrowserStation): boolean => {
    // Raw RadioBrowserStation tiene stationuuid; Normalizada usa ownerId === 'radiobrowser'
    return 'stationuuid' in (station as any) || (( 'ownerId' in station) && (station as any).ownerId === 'radiobrowser')
  }
  
  const getStationId = (station: ResponseStationDto | RadioBrowserStation): string => {
    return 'stationuuid' in (station as any) ? (station as RadioBrowserStation).stationuuid : (station as ResponseStationDto).id
  }
  
  const getStationName = (station: ResponseStationDto | RadioBrowserStation): string => {
    return station.name
  }
  
  const getStationDescription = (station: ResponseStationDto | RadioBrowserStation): string => {
    return isRadioBrowserStation(station)
      ? (( 'tags' in (station as any)) ? (station as RadioBrowserStation).tags || '' : (station as ResponseStationDto).description || '')
      : ((station as ResponseStationDto).description || '')
  }
  
  const getStationCoverImage = (station: ResponseStationDto | RadioBrowserStation): string | null => {
    return isRadioBrowserStation(station)
      ? (( 'favicon' in (station as any)) ? (station as RadioBrowserStation).favicon || null : (station as ResponseStationDto).coverImage || null)
      : ((station as ResponseStationDto).coverImage || null)
  }
  
  const getStationFavoritesCount = (station: ResponseStationDto | RadioBrowserStation): number => {
    return isRadioBrowserStation(station)
      ? (( 'votes' in (station as any)) ? (station as RadioBrowserStation).votes : (station as ResponseStationDto).favoritesCount)
      : (station as ResponseStationDto).favoritesCount
  }

  // Función para obtener la URL de la bandera de un país
  const getCountryFlagUrl = (isoCode: string): string => {
    return `https://flagcdn.com/w80/${isoCode.toLowerCase()}.png`
  }

    // Función para manejar el estado de carga de las banderas
  const handleFlagLoad = (isoCode: string) => {
    setFlagLoadingStates(prev => ({ ...prev, [isoCode]: false }))
  }

  const handleFlagError = (isoCode: string) => {
    setFlagLoadingStates(prev => ({ ...prev, [isoCode]: 'error' }))
  }

  // Inicializar el conteo visible cuando se selecciona un país
  useEffect(() => {
    if (selectedCountry) {
      setVisibleCount(Math.min(INITIAL_BATCH, selectedCountry.stations.length))
    } else {
      setVisibleCount(0)
    }
  }, [selectedCountry])

  // Configurar IntersectionObserver para cargar más estaciones al hacer scroll
  useEffect(() => {
    if (!selectedCountry) return
    const container = scrollContainerRef.current
    const sentinel = sentinelRef.current
    if (!container || !sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((prev) => {
              const next = Math.min(prev + BATCH_SIZE, selectedCountry.stations.length)
              return next
            })
          }
        })
      },
      {
        root: container,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0.1,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [selectedCountry, BATCH_SIZE])

  // Derivados para infinite scroll
  const totalStations = selectedCountry?.stations?.length ?? 0
  const displayStations = selectedCountry ? selectedCountry.stations.slice(0, Math.min(visibleCount, totalStations)) : []
  const hasMore = selectedCountry ? visibleCount < totalStations : false



  // Función para manejar el clic en un punto del globo
  const handleGlobePointClick = (point: any) => {
    const selectedCountryData = countryData.find(d => d.countryName === point.country)
    
    if (selectedCountryData) {
      // Buscar coordenadas del país
      const country = countriesQuery.data?.find(c => c.name === point.country)
      
      setSelectedCountry({
        countryId: point.countryId || point.country,
        countryName: point.country,
        countryIsoCode: point.countryIsoCode || point.country.substring(0, 2).toUpperCase(),
        stationCount: point.stationCount || 0,
        stations: selectedCountryData.stations,
        coordinates: [point.lat || 0, point.lng || 0], // Usar coordenadas del punto
        countryDetails: country ? {
          name: country.name,
          localName: country.localName || country.name,
          languages: country.languages || ['en']
        } : undefined
      })
    }
  }

  

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">{t('noInternet')}</h2>
          <p className="text-lg text-white/80">{t('noInternetDescription')}</p>
        </div>
      </div>
    )
  }

  if (countryData.length === 0 && !isLoadingRadioBrowser) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
          <p className="text-lg text-white/80 mb-4">{t('noStationsFound')}</p>
          <div className="text-sm text-white/60 mb-4">
            {stats.totalCountries} países disponibles, {stats.internalStationsCount} estaciones internas
          </div>
          <button
            onClick={refetchStations}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            disabled={isLoadingRadioBrowser}
          >
            {isLoadingRadioBrowser ? 'Cargando...' : 'Intentar cargar estaciones'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header personalizado estilo Google Maps */}
      <WorldMapHeader />
      
      {/* Título y descripción del mapa mundial con indicador de carga progresiva */}
      <div className="absolute top-24 left-6 z-30 text-white">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-lg text-white/80 max-w-md">{t('exploreGlobe')}</p>
        
        {/* Indicador de carga progresiva */}
        {isLoadingRadioBrowser && (
          <div className="mt-3 flex items-center gap-2 text-sm text-white/60">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
            <span>{t('loadingWithCount', { count: stats.radioBrowserStationsCount })}</span>
          </div>
        )}
        

      </div>
      
      {/* Globo terráqueo que ocupa todo el espacio restante */}
      <div className="flex-1 relative fullscreen-globe">
        {/* Mensaje de instrucción cuando no hay país seleccionado */}
        {!selectedCountry && (
          <div className="absolute bottom-6 left-6 z-30 text-white/80 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-lg">
            <p className="text-sm">{t('clickCountry')}</p>
          </div>
        )}
        
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={globePoints}
          pointColor="color"
          pointAltitude={0.01}
          pointRadius="size"
          pointResolution={12}
          onPointClick={handleGlobePointClick}
          atmosphereColor="hsl(220, 70%, 60%)"
          atmosphereAltitude={0.15}
          enablePointerInteraction={true}
          pointLabel={(point: any) => `
            <div class="globe-point-label">
              <strong>${point.country || t('title')}</strong><br/>
              ${point.stationCount || 0} ${(point.stationCount || 0) !== 1 ? t('stationsAvailable') : t('stationAvailable')}
            </div>
          `}
        />
      </div>

      {/* Modal de detalles del país con glassmorphism */}
      {selectedCountry && (
        <div className="fixed inset-0 backdrop-blur-[40px] bg-black/15 z-50">
          <div ref={scrollContainerRef} className="h-full w-full p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {/* Estado de carga */}
                        {flagLoadingStates[selectedCountry.countryIsoCode] === true && (
                          <div className="w-16 h-12 bg-gray-200 rounded shadow-lg animate-pulse flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                          </div>
                        )}
                        
                        {/* Imagen de la bandera */}
                        <img 
                          src={getCountryFlagUrl(selectedCountry.countryIsoCode)}
                          alt={`Bandera de ${selectedCountry.countryDetails?.localName || selectedCountry.countryName}`}
                          className={`w-16 h-12 object-cover rounded shadow-lg transition-opacity duration-300 ${
                            flagLoadingStates[selectedCountry.countryIsoCode] === false ? 'opacity-100' : 'opacity-0'
                          }`}
                          onLoad={() => handleFlagLoad(selectedCountry.countryIsoCode)}
                          onError={() => handleFlagError(selectedCountry.countryIsoCode)}
                          style={{ 
                            display: flagLoadingStates[selectedCountry.countryIsoCode] === false ? 'block' : 'none' 
                          }}
                        />
                        
                        {/* Fallback solo si hay error */}
                        {flagLoadingStates[selectedCountry.countryIsoCode] === 'error' && (
                          <div className="absolute inset-0 w-16 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded shadow-lg flex items-center justify-center text-white text-xs font-bold">
                            {selectedCountry.countryIsoCode}
                          </div>
                        )}
                      </div>
                    </div>
                    <h2 className="text-5xl font-bold text-card-foreground">
                      {selectedCountry.countryDetails?.localName || selectedCountry.countryName}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <p className="text-xl text-muted-foreground">
                      {selectedCountry.stationCount} {selectedCountry.stationCount !== 1 ? t('stationsAvailable') : t('stationAvailable')}
                    </p>
                    {/* Indicadores de tipos de estaciones */}
                    <div className="flex gap-2">
                      {/* Eliminado badge de internas por solicitud */}
                      {selectedCountry.stations.some(s => isRadioBrowserStation(s)) && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                          🌍 Radio Browser: {selectedCountry.stations.filter(s => isRadioBrowserStation(s)).length}
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedCountry.countryDetails?.languages && selectedCountry.countryDetails.languages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{t('languages')}:</span>
                      <div className="flex gap-2">
                        {selectedCountry.countryDetails.languages.map((language: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded border border-primary/30">
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-3 rounded-lg hover:bg-accent/50"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedCountry.stations.length > 0 ? (
                  displayStations.map((station: ResponseStationDto | RadioBrowserStation) => (
                     <Link
                       key={getStationId(station)}
                       to={isRadioBrowserStation(station) ? '/s/$stationSlug' : '/$slugName'}
                       params={
                         isRadioBrowserStation(station)
                           ? { stationSlug: slugify(getStationName(station)) }
                           : { slugName: (station as ResponseStationDto).slug || slugify(getStationName(station)) }
                       }
                       search={
                         isRadioBrowserStation(station)
                           ? (( 'stationuuid' in (station as any))
                               ? normalizeRadioBrowserStation(station as RadioBrowserStation)
                               : (station as ResponseStationDto))
                           : undefined
                       }
                       className="spotify-style-card group cursor-pointer transition-all duration-300 hover:bg-white/10"
                     >
                       <div className="flex items-center gap-4 p-4">
                         {getStationCoverImage(station) ? (
                           <div className="flex-shrink-0">
                             <img
                               src={getStationCoverImage(station)!}
                               alt={getStationName(station)}
                               className="w-14 h-14 object-cover shadow-md group-hover:shadow-lg transition-all duration-300"
                             />
                           </div>
                         ) : (
                           <div className="flex-shrink-0">
                             <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                               <RadioIcon className="h-7 w-7 text-white" />
                             </div>
                           </div>
                         )}
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-semibold text-white text-base group-hover:text-primary/90 transition-colors duration-300 truncate">
                               {getStationName(station)}
                             </h3>
                             {/* Sin badges por ahora */}
                           </div>
                           <p className="text-white/60 text-sm mb-2 leading-relaxed line-clamp-1">
                             {getStationDescription(station) || t('noDescription')}
                           </p>
                           <div className="flex items-center gap-2 text-white/50">
                             <Heart className="h-4 w-4 text-primary/80" />
                             <span className="text-xs font-medium">{getStationFavoritesCount(station)} {t('favorites')}</span>
                           </div>
                         </div>
                       </div>
                    </Link>
                   ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-xl text-white/60">{t('noStationsFound')}</p>
                  </div>
                )}
                {/* Loader y sentinel para infinitescroll */}
                {hasMore && (
                  <div className="col-span-2 flex justify-center py-4 text-white/60">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
                  </div>
                )}
                <div ref={sentinelRef} className="col-span-2 h-2" />
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
