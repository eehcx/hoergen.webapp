import { useState, useEffect } from 'react'
import { getCurrentLocale } from '@/lib/i18n'

// Traducciones hardcodeadas para el mapa mundial (como fallback)
const translations = {
  en: {
    title: "World Map",
    exploreGlobe: "Explore the globe to discover radio stations from different countries",
    clickCountry: "Click on a country to see available stations",
    stationsAvailable: "stations available",
    stationAvailable: "station available",
    languages: "Languages",
    noDescription: "No description",
    favorites: "favorites",
    close: "Close",
    loadingStations: "Loading stations...",
    loadingWithCount: "Loading stations... ({count} loaded)",
    noStationsFound: "No stations found for this country",
    error: "Error",
    localStation: "Local",
    globalStation: "Global",
    loadingBasicMap: "Loading basic map...",
    loadingAdditionalStations: "Loading additional stations...",
    mapFullyLoaded: "Map fully loaded!",
    localAndGlobalStations: "Local + Global Stations",
    globalStationsOnly: "Global Stations Only",
    noInternet: "No internet connection",
    noInternetDescription: "Please check your connection and try again"
  },
  es: {
    title: "Mapa Mundial",
    exploreGlobe: "Explora el globo para descubrir estaciones de radio de diferentes países",
    clickCountry: "Haz clic en un país para ver las estaciones disponibles",
    stationsAvailable: "estaciones disponibles",
    stationAvailable: "estación disponible",
    languages: "Idiomas",
    noDescription: "Sin descripción",
    favorites: "favoritos",
    close: "Cerrar",
    loadingStations: "Cargando estaciones...",
    loadingWithCount: "Cargando estaciones... ({count} cargadas)",
    noStationsFound: "No se encontraron estaciones para este país",
    error: "Error",
    localStation: "Local",
    globalStation: "Global",
    loadingBasicMap: "Cargando mapa básico...",
    loadingAdditionalStations: "Cargando estaciones adicionales...",
    mapFullyLoaded: "¡Mapa completamente cargado!",
    localAndGlobalStations: "Estaciones Locales + Globales",
    globalStationsOnly: "Solo Estaciones Globales",
    noInternet: "No hay internet",
    noInternetDescription: "Por favor, revisa tu conexión e intenta de nuevo"
  },
  de: {
    title: "Weltkarte",
    exploreGlobe: "Erkunden Sie den Globus, um Radiosender aus verschiedenen Ländern zu entdecken",
    clickCountry: "Klicken Sie auf ein Land, um verfügbare Sender zu sehen",
    stationsAvailable: "Sender verfügbar",
    stationAvailable: "Sender verfügbar",
    languages: "Sprachen",
    noDescription: "Keine Beschreibung",
    favorites: "Favoriten",
    close: "Schließen",
    loadingStations: "Lade Sender...",
    loadingWithCount: "Lade Sender... ({count} geladen)",
    noStationsFound: "Keine Sender für dieses Land gefunden",
    error: "Fehler",
    localStation: "Lokal",
    globalStation: "Global",
    loadingBasicMap: "Lade Grundkarte...",
    loadingAdditionalStations: "Lade zusätzliche Sender...",
    mapFullyLoaded: "Karte vollständig geladen!",
    localAndGlobalStations: "Lokale + Globale Sender",
    globalStationsOnly: "Nur Globale Sender",
    noInternet: "Keine Internetverbindung",
    noInternetDescription: "Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut"
  },
  fr: {
    title: "Carte du Monde",
    exploreGlobe: "Explorez le globe pour découvrir des stations de radio de différents pays",
    clickCountry: "Cliquez sur un pays pour voir les stations disponibles",
    stationsAvailable: "stations disponibles",
    stationAvailable: "station disponible",
    languages: "Langues",
    noDescription: "Aucune description",
    favorites: "favoris",
    close: "Fermer",
    loadingStations: "Chargement des stations...",
    loadingWithCount: "Chargement des stations... ({count} chargées)",
    noStationsFound: "Aucune station trouvée pour ce pays",
    error: "Erreur",
    localStation: "Locale",
    globalStation: "Globale",
    loadingBasicMap: "Chargement de la carte de base...",
    loadingAdditionalStations: "Chargement de stations supplémentaires...",
    mapFullyLoaded: "Carte entièrement chargée !",
    localAndGlobalStations: "Stations Locales + Globales",
    globalStationsOnly: "Stations Globales Seulement",
    noInternet: "Pas de connexion internet",
    noInternetDescription: "Veuillez vérifier votre connexion et réessayer"
  },
  ru: {
    title: "Карта Мира",
    exploreGlobe: "Исследуйте глобус, чтобы открыть радиостанции из разных стран",
    clickCountry: "Нажмите на страну, чтобы увидеть доступные станции",
    stationsAvailable: "станций доступно",
    stationAvailable: "станция доступна",
    languages: "Языки",
    noDescription: "Нет описания",
    favorites: "избранное",
    close: "Закрыть",
    loadingStations: "Загрузка станций...",
    loadingWithCount: "Загрузка станций... ({count} загружено)",
    noStationsFound: "Станции для этой страны не найдены",
    error: "Ошибка",
    localStation: "Локальная",
    globalStation: "Глобальная",
    loadingBasicMap: "Загрузка базовой карты...",
    loadingAdditionalStations: "Загрузка дополнительных станций...",
    mapFullyLoaded: "Карта полностью загружена!",
    localAndGlobalStations: "Локальные + Глобальные Станции",
    globalStationsOnly: "Только Глобальные Станции",
    noInternet: "Нет интернет-соединения",
    noInternetDescription: "Пожалуйста, проверьте ваше соединение и попробуйте снова"
  }
}

export function useTranslations() {
  const [currentLocale, setCurrentLocale] = useState(getCurrentLocale())
  
  // Escuchar cambios de idioma
  useEffect(() => {
    const handleLocaleChange = (event: CustomEvent) => {
      const { locale } = event.detail
      setCurrentLocale(locale)
    }

    window.addEventListener('localeChanged', handleLocaleChange as EventListener)
    
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener)
    }
  }, [])
  
  const t = (key: string, params?: Record<string, string | number>): string => {
    const localeTranslations = translations[currentLocale as keyof typeof translations] || translations.en
    const raw = (localeTranslations as any)[key] || key
    if (!params) return raw
    let text = raw as string
    for (const [p, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), String(v))
    }
    return text
  }
  
  return { t, currentLocale }
}
