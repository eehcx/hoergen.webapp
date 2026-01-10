import React from 'react'
import { linkifyComplete } from '@/utils'

interface EventTextProps {
  /** El texto de la descripción del evento que puede contener URLs */
  text: string
  /** Clase CSS opcional para el contenedor */
  className?: string
  /** Clase CSS opcional para los enlaces */
  linkClassName?: string
  /** Si se debe truncar el texto o no */
  truncate?: boolean
  /** Título opcional para el tooltip cuando el texto está truncado */
  title?: string
}

/**
 * Componente que renderiza texto de eventos con detección automática de enlaces.
 * Convierte URLs en enlaces clickeables que se abren en nueva pestaña.
 */
export const EventText: React.FC<EventTextProps> = ({
  text,
  className = '',
  linkClassName,
  truncate = false,
  title,
}) => {
  if (!text) {
    return null
  }

  // Clases por defecto para los enlaces que mantienen el color del texto
  const defaultLinkClassName = 'hover:underline transition-all duration-200'

  const finalLinkClassName = linkClassName || defaultLinkClassName

  // Aplicar truncate si es necesario
  const containerClassName = truncate
    ? `truncate ${className}`.trim()
    : className

  return (
    <div
      className={containerClassName}
      title={truncate ? title || text : undefined}
    >
      {linkifyComplete(text, finalLinkClassName)}
    </div>
  )
}

/**
 * Versión especializada para eventos en el marquee/slider
 */
export const EventMarqueeText: React.FC<{
  text: string
  className?: string
}> = ({ text, className = '' }) => {
  return (
    <EventText
      text={text}
      className={`truncate text-sm text-zinc-700 dark:text-zinc-300 ${className}`.trim()}
      linkClassName='hover:underline transition-all duration-200'
      truncate
      title={text}
    />
  )
}

/**
 * Versión para mostrar en diálogos o tooltips (sin truncar)
 */
export const EventFullText: React.FC<{
  text: string
  className?: string
}> = ({ text, className = '' }) => {
  return (
    <EventText
      text={text}
      className={`text-sm text-zinc-600 dark:text-zinc-400 ${className}`.trim()}
      linkClassName='hover:underline transition-all duration-200'
    />
  )
}

export default EventText
