export type Locale = 'en' | 'es' | 'de' | 'fr' | 'ru'

export const locales: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  ru: 'Русский'
}

export const defaultLocale: Locale = 'en'

// Función para obtener el idioma del navegador de manera más inteligente
export function getBrowserLocale(): Locale {
  // Obtener todos los idiomas del navegador
  const browserLanguages = navigator.languages || [navigator.language]
  
  // Mapeo de códigos de idioma del navegador a nuestros locales
  const languageMap: Record<string, Locale> = {
    'en': 'en',
    'en-US': 'en',
    'en-GB': 'en',
    'en-CA': 'en',
    'en-AU': 'en',
    'es': 'es',
    'es-ES': 'es',
    'es-MX': 'es',
    'es-AR': 'es',
    'es-CO': 'es',
    'es-PE': 'es',
    'es-VE': 'es',
    'es-CL': 'es',
    'es-EC': 'es',
    'es-GT': 'es',
    'es-CR': 'es',
    'es-CU': 'es',
    'es-BO': 'es',
    'es-DO': 'es',
    'es-HN': 'es',
    'es-PY': 'es',
    'es-SV': 'es',
    'es-NI': 'es',
    'es-PA': 'es',
    'es-UY': 'es',
    'es-GQ': 'es',
    'de': 'de',
    'de-DE': 'de',
    'de-AT': 'de',
    'de-CH': 'de',
    'de-LU': 'de',
    'de-LI': 'de',
    'fr': 'fr',
    'fr-FR': 'fr',
    'fr-CA': 'fr',
    'fr-BE': 'fr',
    'fr-CH': 'fr',
    'fr-LU': 'fr',
    'fr-MC': 'fr',
    'ru': 'ru',
    'ru-RU': 'ru',
    'ru-UA': 'ru',
    'ru-KZ': 'ru',
    'ru-BY': 'ru',
    'ru-KG': 'ru',
    'ru-MD': 'ru',
    'ru-TJ': 'ru',
    'ru-TM': 'ru',
    'ru-UZ': 'ru'
  }
  
  // Buscar el primer idioma que coincida
  for (const lang of browserLanguages) {
    const code = lang.toLowerCase()
    
    // Buscar coincidencia exacta
    if (languageMap[code]) {
      return languageMap[code]
    }
    
    // Buscar coincidencia parcial (solo el código principal)
    const mainCode = code.split('-')[0]
    if (languageMap[mainCode]) {
      return languageMap[mainCode]
    }
  }
  
  // Fallback al idioma por defecto
  return defaultLocale
}

// Función para obtener el idioma guardado en localStorage
export function getStoredLocale(): Locale | null {
  const stored = localStorage.getItem('hoergen-locale')
  return stored && Object.keys(locales).includes(stored) ? stored as Locale : null
}

// Función para guardar el idioma en localStorage
export function setStoredLocale(locale: Locale): void {
  localStorage.setItem('hoergen-locale', locale)
}

// Función para obtener el idioma actual con detección inteligente
export function getCurrentLocale(): Locale {
  // Primero intentar obtener del localStorage
  const stored = getStoredLocale()
  
  if (stored) {
    return stored
  }
  
  // Si no hay idioma guardado, detectar del navegador
  const browser = getBrowserLocale()
  
  // Guardar automáticamente el idioma detectado
  setStoredLocale(browser)
  
  return browser
}

// Función para cambiar el idioma
export function changeLocale(locale: Locale): void {
  const previousLocale = getCurrentLocale()
  
  // Si el idioma no ha cambiado, no hacer nada
  if (locale === previousLocale) {
    return
  }
  
  setStoredLocale(locale)
  
  // Emitir un evento personalizado para notificar el cambio
  const event = new CustomEvent('localeChanged', { 
    detail: { locale, previousLocale } 
  })
  window.dispatchEvent(event)
  
  // No recargar la página - dejar que React maneje el cambio de estado
  // Esto evita la pantalla en blanco y mejora la experiencia del usuario
}

// Función para cambiar el idioma sin recargar (para uso interno)
export function changeLocaleSoft(locale: Locale): void {
  setStoredLocale(locale)
  
  // Solo emitir el evento, sin recargar
  const event = new CustomEvent('localeChanged', { 
    detail: { locale, previousLocale: getCurrentLocale() } 
  })
  window.dispatchEvent(event)
}

// Función para traducir texto
export function t(key: string, locale: Locale = getCurrentLocale()): string {
  const messages = {
    en: () => import('./locales/en.json'),
    es: () => import('./locales/es.json'),
    de: () => import('./locales/de.json'),
    fr: () => import('./locales/fr.json'),
    ru: () => import('./locales/ru.json')
  }
  
  const message = messages[locale] || messages[defaultLocale]
  const keys = key.split('.')
  let value: any = message
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key // Retornar la clave si no se encuentra la traducción
    }
  }
  
  return typeof value === 'string' ? value : key
}
