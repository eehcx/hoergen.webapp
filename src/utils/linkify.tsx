import React from 'react'

// Expresión regular mejorada para detectar URLs
const URL_REGEX =
  /(https?:\/\/(?:[-\w.])+(?:[:\d]+)?(?:\/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)?)/gi

/**
 * Convierte URLs encontradas en texto en enlaces clickeables
 * @param text - El texto que puede contener URLs
 * @param className - Clase CSS opcional para los enlaces
 * @returns JSX.Element con texto y enlaces
 */
export const linkify = (
  text: string,
  className?: string
): React.ReactElement => {
  if (!text) {
    return <>{text}</>
  }

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  // Buscar todas las URLs en el texto
  text.replace(URL_REGEX, (match, url, offset) => {
    // Agregar el texto antes de la URL
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset))
    }

    // Agregar el enlace
    parts.push(
      <a
        key={`${offset}-${url}`}
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        className={
          className ||
          'underline transition-all duration-200 hover:no-underline'
        }
      >
        {url}
      </a>
    )

    lastIndex = offset + match.length
    return match
  })

  // Agregar el texto restante después de la última URL
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}

/**
 * Versión simplificada que detecta URLs básicas incluyendo www.
 */
const SIMPLE_URL_REGEX = /((?:https?:\/\/|www\.)[^\s]+)/gi

/**
 * Versión completa que detecta todos los tipos de URLs comunes
 * Incluye: https://, http://, www., y dominios simples como radio.com
 */
const COMPLETE_URL_REGEX =
  /((?:https?:\/\/[^\s]+)|(?:www\.[^\s]+)|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi

export const linkifySimple = (
  text: string,
  className?: string
): React.ReactElement => {
  if (!text) {
    return <>{text}</>
  }

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  text.replace(SIMPLE_URL_REGEX, (match, url, offset) => {
    // Agregar el texto antes de la URL
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset))
    }

    // Asegurar que tenga protocolo
    const href = url.startsWith('www.') ? `https://${url}` : url

    // Agregar el enlace
    parts.push(
      <a
        key={`${offset}-${url}`}
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={
          className ||
          'underline transition-all duration-200 hover:no-underline'
        }
      >
        {url}
      </a>
    )

    lastIndex = offset + match.length
    return match
  })

  // Agregar el texto restante
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}

/**
 * Versión completa que detecta todos los tipos de URLs: https://, www., y dominios simples
 * @param text - El texto que puede contener URLs
 * @param className - Clase CSS opcional para los enlaces
 * @returns JSX.Element con texto y enlaces
 */
export const linkifyComplete = (
  text: string,
  className?: string
): React.ReactElement => {
  if (!text) {
    return <>{text}</>
  }

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  text.replace(COMPLETE_URL_REGEX, (match, url, offset) => {
    // Agregar el texto antes de la URL
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset))
    }

    // Determinar el href correcto
    let href = url
    if (url.startsWith('www.')) {
      href = `https://${url}`
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Para dominios simples como radio.com, facebook.com/page, etc.
      href = `https://${url}`
    }

    // Agregar el enlace
    parts.push(
      <a
        key={`${offset}-${url}`}
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={
          className ||
          'text-blue-500 underline transition-colors hover:text-blue-700'
        }
      >
        {url}
      </a>
    )

    lastIndex = offset + match.length
    return match
  })

  // Agregar el texto restante
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}

/**
 * Hook personalizado para linkificar texto con opciones avanzadas
 */
export const useLinkify = (options?: {
  className?: string
  maxLength?: number
  showProtocol?: boolean
}) => {
  return React.useCallback(
    (text: string): React.ReactElement => {
      if (!text) {
        return <>{text}</>
      }

      const parts: React.ReactNode[] = []
      let lastIndex = 0

      text.replace(URL_REGEX, (match, url, offset) => {
        // Agregar el texto antes de la URL
        if (offset > lastIndex) {
          parts.push(text.slice(lastIndex, offset))
        }

        // Preparar el texto del enlace
        let displayText = url
        if (options?.maxLength && url.length > options.maxLength) {
          displayText = url.substring(0, options.maxLength) + '...'
        }
        if (!options?.showProtocol) {
          displayText = displayText.replace(/^https?:\/\//, '')
        }

        // Agregar el enlace
        parts.push(
          <a
            key={`${offset}-${url}`}
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className={
              options?.className ||
              'underline transition-all duration-200 hover:no-underline'
            }
            title={url}
          >
            {displayText}
          </a>
        )

        lastIndex = offset + match.length
        return match
      })

      // Agregar el texto restante
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex))
      }

      return <>{parts}</>
    },
    [options]
  )
}
