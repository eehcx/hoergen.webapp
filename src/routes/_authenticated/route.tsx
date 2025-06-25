import Cookies from 'js-cookie'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import { AuthGuard } from '@/components/auth/authGuard'
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <AuthGuard>
      <AuthenticatedContent />
    </AuthGuard>
  )
}

function AuthenticatedContent() {
  const { claims } = useAuth()
  const userRole = claims?.role || 'listener'
  const showSidebar = userRole === 'creator' || userRole === 'admin'
  
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
    return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        {showSidebar && <AppSidebar />}
        <div
          id='content'
          className={cn(
            'ml-auto w-full max-w-full',
            showSidebar ? [
              'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
              'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
              'sm:transition-[width] sm:duration-200 sm:ease-linear'
            ] : 'w-full',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
