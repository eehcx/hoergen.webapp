import { useEffect } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, useLocation } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { MiniPlayer } from '@/components/mini-player'
import { useMiniPlayer } from '@/context/mini-player-context'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    const { player, pause } = useMiniPlayer()
    const location = useLocation()

    // Excluded routes 
    const hiddenRoutes = [
      '/forgot-password',
      '/otp',
      '/sign-in-2',
      '/sign-in',
      '/sign-up', 
      '/401',
      '/403',
      '/404',
      '/500',
      '/503',
      '/s/new',
      '/subscriptions/cancel',
      '/subscriptions/success',
    ]

    const shouldHideMiniPlayer = hiddenRoutes.some(route => 
      location.pathname.startsWith(route)
    )

    useEffect(() => {
      if (shouldHideMiniPlayer && player?.isPlaying) {
        pause()
      }
    }, [shouldHideMiniPlayer, player?.isPlaying, pause])
    
    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={50000} />
        {player && !shouldHideMiniPlayer && <MiniPlayer />}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
