import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks'

interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
}

export function AuthGuard({
  children,
  redirectTo = '/sign-in',
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [timeoutReached, setTimeoutReached] = useState(false)

  // Detectar si estamos en Electron
  const isElectron =
    typeof window !== 'undefined' && (window as any).electronAPI

  useEffect(() => {
    /*console.log('AuthGuard: State changed', {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      isElectron,
    })*/

    const timeout = isElectron ? 15000 : 8000 // Más tiempo en Electron
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('AuthGuard: Loading timeout reached after', timeout, 'ms')
        setTimeoutReached(true)
      }
    }, timeout)

    return () => clearTimeout(timer)
  }, [isLoading, isAuthenticated, user, isElectron])

  // Log del estado actual
  useEffect(() => {
    /*console.log('AuthGuard: Current state', {
      isAuthenticated,
      isLoading,
      timeoutReached,
      hasUser: !!user,
    })*/
  }, [isAuthenticated, isLoading, timeoutReached, user])

  // ✅ SEGURO - Fallar de forma segura, no bypassing
  if (timeoutReached) {
    //console.log('AuthGuard: Timeout reached, redirecting to sign-in')
    return <Navigate to={redirectTo} />
  }

  if (isLoading) {
    return (
      <div className='bg-background flex h-screen items-center justify-center'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='flex space-x-1'>
            <div className='bg-primary h-3 w-3 animate-bounce rounded-full [animation-delay:-0.3s]'></div>
            <div className='bg-primary h-3 w-3 animate-bounce rounded-full [animation-delay:-0.15s]'></div>
            <div className='bg-primary h-3 w-3 animate-bounce rounded-full'></div>
          </div>
          <p className='text-muted-foreground text-sm'>
            {isElectron ? 'Loading in Electron...' : 'Signing you in…'}
          </p>
          {/*
                    <p className="text-xs text-muted-foreground">
                        {isAuthenticated ? 'Authenticated' : 'Not authenticated'} |
                        {isLoading ? ' Loading' : ' Not loading'} |
                        {user ? ' Has user' : ' No user'}
                    </p>
                    */}
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    //console.log('AuthGuard: Not authenticated, redirecting to sign-in')
    return <Navigate to={redirectTo} />
  }

  //console.log('AuthGuard: Authenticated, rendering children');
  return <>{children}</>
}
