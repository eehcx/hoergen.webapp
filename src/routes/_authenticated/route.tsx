import Cookies from 'js-cookie'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
//import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import { AuthGuard } from '@/core/guard'
//import { useAuth } from '@/hooks'

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
  //const { claims } = useAuth()
  //const userRole = claims?.role || 'listener'

  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
    return (
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <div
            id='content'
            className={cn(
              'w-full max-w-full',
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
