import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, Check } from 'lucide-react'
import { useStaticTranslation } from '@/hooks/useTranslation'
import { type Locale } from '@/lib/i18n'

export function LanguageSelector() {
  const { 
    //t, 
    locale, 
    changeLocale, 
    locales,
    isLoading
  } = useStaticTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale !== locale && !isLoading) {
      changeLocale(newLocale)
      setIsOpen(false)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          disabled={isLoading}
        >
          <Globe className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(locales).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as Locale)}
            className="flex items-center justify-between"
            disabled={isLoading}
          >
            <span>{name}</span>
            {locale === code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Componente de selector de idioma con texto
export function LanguageSelectorWithText() {
  const { 
    //t, 
    locale, 
    changeLocale, 
    locales,
    isLoading
  } = useStaticTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale !== locale && !isLoading) {
      changeLocale(newLocale)
      setIsOpen(false)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Globe className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{locales[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(locales).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as Locale)}
            className="flex items-center justify-between"
            disabled={isLoading}
          >
            <span>{name}</span>
            {locale === code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
