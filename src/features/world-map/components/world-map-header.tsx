import { Link } from '@tanstack/react-router'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { useState, useEffect, useRef } from 'react'
import { useStaticTranslation } from '@/hooks/useTranslation'
import { Globe, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function WorldMapHeader() {
    const { locale, changeLocale, locales, isLoading } = useStaticTranslation()
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
    const languageMenuRef = useRef<HTMLDivElement>(null)
    const user = useAuthStore((state) => state.user)

    // Traducciones para el header
    const headerTranslations: Record<string, Record<string, string>> = {
        en: {
            signIn: "Sign In",
            signInTooltip: "Sign in to your account"
        },
        es: {
            signIn: "Iniciar sesión",
            signInTooltip: "Inicia sesión en tu cuenta"
        },
        de: {
            signIn: "Anmelden",
            signInTooltip: "Bei Ihrem Konto anmelden"
        },
        fr: {
            signIn: "Se connecter",
            signInTooltip: "Connectez-vous à votre compte"
        },
        ru: {
            signIn: "Войти",
            signInTooltip: "Войдите в свой аккаунт"
        }
    }

    // Función de traducción para el header
    const t = (key: string): string => {
        const localeTranslations = headerTranslations[locale] || headerTranslations.en
        return localeTranslations[key] || key
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
                setIsLanguageMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLanguageChange = (newLocale: string) => {
        if (newLocale !== locale && !isLoading) {
            changeLocale(newLocale as any)
            setIsLanguageMenuOpen(false)
        }
    }

    return (
        <header className="fixed top-6 right-6 z-40 animate-in slide-in-from-top-2 duration-500">
            <div className="backdrop-blur-[20px] bg-black/30 border border-white/20 shadow-2xl rounded-sm px-6 py-2 transition-all duration-300 hover:bg-black/40 hover:border-white/30">
            <div className="flex items-center gap-6">
                
                {/* Logo y versión */}
                <Link to="/" className="flex items-baseline space-x-2 select-none group">
                    <h1 className="text-xl font-bold tracking-widest font-[Orbitron] text-white group-hover:text-[#26E056] transition-colors duration-200">
                        Hörgen
                    </h1>
                    <span className="text-xs font-[Inter] text-white/60 group-hover:text-white/90 transition-colors duration-200">
                        v0.1.4
                    </span>
                </Link>

                {/* Separador visual */}
                <div className="w-px h-8 bg-white/20"></div>

                {/* Selector de idioma */}
                <div className="relative" ref={languageMenuRef}>
                    <button
                        onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                        className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white transition-all duration-200 rounded-xs hover:bg-white/15 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        disabled={isLoading}
                    >
                        <Globe className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span className="text-sm font-semibold">{locales[locale]}</span>
                    </button>

                    {isLanguageMenuOpen && (
                        <div className="absolute top-full right-0 mt-3 bg-black/90 backdrop-blur-md border border-white/30 rounded-xs shadow-2xl z-50 min-w-36 overflow-hidden">
                            {Object.entries(locales).map(([code, name]) => (
                                <button
                                    key={code}
                                    onClick={() => handleLanguageChange(code)}
                                    className={`w-full text-left px-4 py-3 text-sm hover:bg-white/15 transition-all duration-200 first:rounded-t-sm last:rounded-b-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                                        code === locale 
                                            ? 'text-white bg-white/25 font-semibold' 
                                            : 'text-white/80 hover:text-white'
                                    }`}
                                    disabled={isLoading}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Avatar del usuario o avatar de fallback */}
                {user ? (
                  <ProfileDropdown />
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Avatar de fallback para usuarios no autenticados */}
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200 cursor-pointer group">
                        <User className="h-4 w-4 text-white/80 group-hover:text-white" />
                      </div>
                      {/* Tooltip de fallback */}
                      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/90 backdrop-blur-md border border-white/30 rounded-lg shadow-2xl text-xs text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        {t('signInTooltip')}
                      </div>
                    </div>
                    
                    {/* Botón de inicio de sesión */}
                    <Link 
                      to="/sign-in" 
                      className="px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      {t('signIn')}
                    </Link>
                  </div>
                )}
                </div>
            </div>
        </header>
    )
}
