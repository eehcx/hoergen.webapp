import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from "@dr.pogodin/react-helmet"
import WorldMap from '@/features/world-map'
import { getCurrentLocale } from '@/lib/i18n'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/worldwide/')({
  component: WorldMapPage,
})

function WorldMapPage() {
  // Traducciones para el título y meta descripción
  const translations: Record<string, Record<string, string>> = {
    en: {
      title: "World Radio Stations Globe · Hoergen",
      description: "Explore all radio stations around the world in our interactive 3D globe"
    },
    es: {
      title: "Globo Terrestre de Estaciones · Hoergen",
      description: "Explora todas las estaciones de radio del mundo en nuestro globo terráqueo 3D interactivo"
    },
    de: {
      title: "Weltweiter Radiosender-Globus · Hoergen",
      description: "Entdecken Sie alle Radiosender der Welt in unserem interaktiven 3D-Globus"
    },
    fr: {
      title: "Globe des Stations de Radio Mondiales · Hoergen",
      description: "Explorez toutes les stations de radio du monde dans notre globe 3D interactif"
    },
    ru: {
      title: "Глобус Мировых Радиостанций · Hoergen",
      description: "Исследуйте все радиостанции мира в нашем интерактивном 3D глобусе"
    }
  }

  const [currentLocale, setCurrentLocale] = useState(getCurrentLocale())
  
  // Escuchar cambios de idioma
  useEffect(() => {
    const handleLocaleChange = () => {
      setCurrentLocale(getCurrentLocale())
    }
    
    window.addEventListener('localeChanged', handleLocaleChange)
    return () => window.removeEventListener('localeChanged', handleLocaleChange)
  }, [])

  // Función de traducción
  const t = (key: string): string => {
    const localeTranslations = translations[currentLocale] || translations.en
    return localeTranslations[key] || key
  }

  return (
    <>
      <Helmet>
        <title>{t('title')}</title>
        <meta 
          name="description" 
          content={t('description')}
        />
        <meta 
          property="og:type"        
          content="website" 
        />
        <meta 
          property="og:title"       
          content={t('title')}
        />
        <meta 
          property="og:description" 
          content={t('description')}
        />
        <link rel="canonical" href="/worldwide" />
      </Helmet>
      <WorldMap />
    </>
  )
}
