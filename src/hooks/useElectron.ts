import { useState, useEffect } from 'react'

interface ElectronAPI {
  platform: string
  version: string
  [key: string]: any
}

interface UseElectronReturn {
  isElectron: boolean
  electronAPI: ElectronAPI | null
  platform: string | null
  isLoading: boolean
}

/**
 * Hook para detectar si la aplicación está ejecutándose en Electron
 * y proporcionar acceso a la API de Electron
 */
export const useElectron = (): UseElectronReturn => {
  const [isElectron, setIsElectron] = useState(false)
  const [electronAPI, setElectronAPI] = useState<ElectronAPI | null>(null)
  const [platform, setPlatform] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkElectron = () => {
      try {
        // Verificar si existe la API de Electron
        const electronAPI = (window as any).electronAPI
        const isElectronEnv = !!electronAPI

        setIsElectron(isElectronEnv)
        setElectronAPI(electronAPI || null)

        if (isElectronEnv && electronAPI) {
          // Obtener información de la plataforma si está disponible
          setPlatform(electronAPI.platform || 'unknown')
        } else {
          // Fallback para navegador web
          setPlatform(navigator.platform || 'web')
        }
      } catch (error) {
        console.warn('Error checking Electron environment:', error)
        setIsElectron(false)
        setElectronAPI(null)
        setPlatform('web')
      } finally {
        setIsLoading(false)
      }
    }

    // Verificar inmediatamente
    checkElectron()

    // También verificar cuando la ventana se carga completamente
    if (document.readyState === 'loading') {
      window.addEventListener('load', checkElectron)
      return () => window.removeEventListener('load', checkElectron)
    }
  }, [])

  return {
    isElectron,
    electronAPI,
    platform,
    isLoading,
  }
}

/**
 * Hook simplificado que solo retorna si estamos en Electron
 */
export const useIsElectron = (): boolean => {
  const { isElectron } = useElectron()
  return isElectron
}

/**
 * Hook para manejar context menus específicos de Electron
 */
export const useElectronContextMenu = () => {
  const { isElectron, electronAPI } = useElectron()

  const disableNativeContextMenu = () => {
    if (isElectron) {
      // Deshabilitar el menú contextual nativo de Electron
      window.addEventListener('contextmenu', (e) => {
        e.preventDefault()
      })
    }
  }

  const enableNativeContextMenu = () => {
    if (isElectron) {
      // Habilitar el menú contextual nativo de Electron
      window.removeEventListener('contextmenu', (e) => {
        e.preventDefault()
      })
    }
  }

  return {
    isElectron,
    electronAPI,
    disableNativeContextMenu,
    enableNativeContextMenu,
  }
}

export default useElectron
