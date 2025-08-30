//import React from 'react'
import { useStaticTranslation } from '@/hooks/useTranslation'

export function I18nExample() {
  const { t, locale, changeLocale, locales, isReady } = useStaticTranslation()

  console.log('I18nExample render:', { locale, isReady, messages: t('navigation.radio') })

  if (!isReady) {
    return <div>Cargando traducciones...</div>
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Ejemplo de Internacionalización</h2>
      
      <div className="space-y-2">
        <p><strong>Idioma actual:</strong> {locale}</p>
        <p><strong>Traducciones listas:</strong> {isReady ? 'Sí' : 'No'}</p>
        <p><strong>Radio:</strong> {t('navigation.radio')}</p>
        <p><strong>Browse:</strong> {t('navigation.browse')}</p>
        <p><strong>Library:</strong> {t('navigation.library')}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cambiar Idioma:</h3>
        <div className="flex gap-2">
          {Object.entries(locales).map(([code, name]) => (
            <button
              key={code}
              onClick={() => changeLocale(code as any)}
              className={`px-3 py-2 rounded ${
                locale === code 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
