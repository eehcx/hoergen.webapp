import { useEffect, useRef, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar'

export function NavigationProgress() {
  const ref = useRef<LoadingBarRef>(null)
  const state = useRouterState()
  const [startTime, setStartTime] = useState<number | null>(null)
  const [showLoading, setShowLoading] = useState(false)

  // Handle start of navigation
  useEffect(() => {
    if (state.status === 'pending' && !startTime) {
      setStartTime(Date.now())
      ref.current?.continuousStart()
      
      // Show loading UI after 150ms to avoid flash for quick navigations
      const showLoadingTimeout = setTimeout(() => {
        setShowLoading(true)
      }, 150)
      
      return () => clearTimeout(showLoadingTimeout)
    }
  }, [state.status, startTime])  // Handle completion of navigation
  useEffect(() => {
    if (state.status === 'idle' && startTime) {
      // Ensure minimum loading time of 300ms for better UX
      const elapsed = Date.now() - startTime
      const minimumLoadingTime = 300
      
      const completeLoading = () => {
        ref.current?.complete()
        setStartTime(null)
        setShowLoading(false)
      }
      
      if (elapsed < minimumLoadingTime) {
        // Wait for the remaining time before completing
        const timeout = setTimeout(completeLoading, minimumLoadingTime - elapsed)
        return () => clearTimeout(timeout)
      } else {
        completeLoading()
      }
    }
  }, [state.status, startTime])

  return (
    <>
      <LoadingBar
        color='var(--progress-bar-color)'
        ref={ref}
        shadow={true}
        height={2}
      />
      
      {/* Loading overlay - solo aparece después de 150ms para navegaciones lentas */}
      {showLoading && (
        <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Loading...</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
