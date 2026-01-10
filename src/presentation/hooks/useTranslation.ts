import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  getCurrentLocale, 
  //setStoredLocale, 
  changeLocale, 
  locales, 
  type Locale 
} from '@/lib/i18n'

// Cache global para las traducciones
const translationCache = new Map<string, any>()

export function useTranslation() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(getCurrentLocale())
  const [messages, setMessages] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const isLoadingRef = useRef(false)

  // Función para cargar mensajes de un idioma específico
  const loadMessages = useCallback(async (locale: Locale) => {
    try {
      isLoadingRef.current = true
      setIsLoading(true)
      
      // Verificar si ya tenemos las traducciones en caché
      if (translationCache.has(locale)) {
        setMessages(translationCache.get(locale))
        return
      }
      
      const module = await import(`@/lib/i18n/locales/${locale}.json`)
      
      // Guardar en caché
      translationCache.set(locale, module.default)
      setMessages(module.default)
    } catch (error) {
      console.error(`Error loading locale ${locale}:`, error)
      
      // Fallback al inglés
      if (!translationCache.has('en')) {
        try {
          const fallbackModule = await import('@/lib/i18n/locales/en.json')
          translationCache.set('en', fallbackModule.default)
        } catch (fallbackError) {
          console.error('Error loading fallback locale:', fallbackError)
        }
      }
      
      if (translationCache.has('en')) {
        setMessages(translationCache.get('en'))
      }
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const locale = getCurrentLocale()
    setCurrentLocale(locale)
    loadMessages(locale)
  }, [loadMessages])

  // Escuchar cambios de idioma
  useEffect(() => {
    const handleLocaleChange = (event: CustomEvent) => {
      const { locale } = event.detail
      if (locale !== currentLocale) {
        setCurrentLocale(locale)
        loadMessages(locale)
      }
    }

    window.addEventListener('localeChanged', handleLocaleChange as EventListener)
    
    return () => {
      window.removeEventListener('localeChanged', handleLocaleChange as EventListener)
    }
  }, [loadMessages, currentLocale])

  const t = useCallback((key: string): string => {
    if (!messages) return key

    const keys = key.split('.')
    let value: any = messages

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Retornar la clave si no se encuentra la traducción
      }
    }

    return typeof value === 'string' ? value : key
  }, [messages])

  const handleChangeLocale = useCallback((locale: Locale) => {
    if (locale === currentLocale) return
    changeLocale(locale)
  }, [currentLocale])

  return {
    t,
    locale: currentLocale,
    changeLocale: handleChangeLocale,
    locales,
    isReady: !!messages && !isLoading,
    isLoading
  }
}

// Hook síncrono para traducciones estáticas (alias del anterior)
export function useStaticTranslation() {
  return useTranslation()
}
