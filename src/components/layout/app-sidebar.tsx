import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
// Router
import { Link } from '@tanstack/react-router'
// Auth - Reintegrando gradualmente
import { useAuth } from '@/hooks'
// Hooks
import { useSidebarData } from '@/hooks/useSidebarData'
// Icons
import { Radio } from 'lucide-react'
// Utils
import { cn } from '@/lib/utils'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Reintegrando useAuth gradualmente con fallbacks seguros
  const { user, isLoading: authLoading } = useAuth()
  const sidebarData = useSidebarData()

  // Debug logging
  /*
  console.log('AppSidebar render:', {
    user: user?.displayName || 'No user',
    authLoading,
    sidebarData: {
      teams: sidebarData.teams?.length || 0,
      navGroups: sidebarData.navGroups?.length || 0
    }
  })
  */
  // Prepare user data with safe fallbacks
  const userData = {
    name: user?.displayName || 'User',
    email: user?.email || 'No email disponible',
    avatar: user?.photoURL || '/avatars/default.jpg',
  }

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>      
      <SidebarHeader>
        <Link 
          to='/' 
          className={cn(
            "flex items-center gap-3 p-2.5 rounded-sm transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground",
            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
          )}
        >
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground",
            "flex items-center justify-center transition-all duration-200"
          )}>
            <Radio className="w-4 h-4" />
          </div>
          <div className={cn(
            "flex flex-col transition-all duration-200",
            "group-data-[collapsible=icon]:hidden"
          )}>
            <span className="text-sm font-semibold font-[Orbitron] tracking-wide">
              Hörgen
            </span>
            <span className="mt-0.5 text-xs text-muted-foreground font-medium">
              Platform
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups?.map((props) => (
          <NavGroup key={props.title} {...props}/>
        )) || <div>No navigation items</div>}
      </SidebarContent>      
      <SidebarFooter>
        {authLoading ? (
          <div className="p-2"></div>
        ) : (
          <NavUser user={userData} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
