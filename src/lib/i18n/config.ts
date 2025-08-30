export const i18nConfig = {
  // Idioma por defecto
  defaultLocale: 'en' as const,
  
  // Idiomas soportados
  supportedLocales: ['en', 'es', 'de', 'fr', 'ru'] as const,
  
  // Nombres de idiomas
  localeNames: {
    en: 'English',
    es: 'Español',
    de: 'Deutsch',
    fr: 'Français',
    ru: 'Русский'
  } as const,
  
  // Configuración de fallback
  fallbackLocale: 'en' as const,
  
  // Configuración de carga
  loadOnDemand: true,
  
  // Configuración de caché
  cache: {
    enabled: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  },
  
  // Configuración de formato
  dateTimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }
    },
    es: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }
    }
  },
  
  // Configuración de números
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD'
      },
      decimal: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    },
    es: {
      currency: {
        style: 'currency',
        currency: 'EUR'
      },
      decimal: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    }
  },
  
  // Configuración de pluralización
  pluralizationRules: {
    en: {
      one: 'one',
      other: 'other'
    },
    es: {
      one: 'one',
      other: 'other'
    }
  },
  
  // Configuración de interpolación
  interpolation: {
    prefix: '{',
    suffix: '}',
    escapePrefix: '\\{',
    escapeSuffix: '\\}'
  },
  
  // Configuración de mensajes
  messages: {
    missing: 'Missing translation: {key}',
    fallback: 'Fallback translation: {key}'
  }
}

// Tipos derivados de la configuración
export type SupportedLocale = typeof i18nConfig.supportedLocales[number]
export type LocaleName = typeof i18nConfig.localeNames[SupportedLocale]

// Función para validar si un idioma es soportado
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return i18nConfig.supportedLocales.includes(locale as SupportedLocale)
}

// Función para obtener el nombre de un idioma
export function getLocaleName(locale: SupportedLocale): string {
  return i18nConfig.localeNames[locale]
}

// Función para obtener todos los idiomas soportados
export function getSupportedLocales(): Array<{ code: SupportedLocale; name: string }> {
  return i18nConfig.supportedLocales.map(code => ({
    code,
    name: i18nConfig.localeNames[code]
  }))
}
