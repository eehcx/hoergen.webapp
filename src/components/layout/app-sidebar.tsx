import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
// Auth - Reintegrando gradualmente
import { useAuth } from '@/hooks'
// Hooks
import { useSidebarData } from '@/hooks/useSidebarData'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Reintegrando useAuth gradualmente con fallbacks seguros
  const { user, isLoading: authLoading } = useAuth()
  const sidebarData = useSidebarData()

  // Debug logging
  console.log('AppSidebar render:', {
    user: user?.displayName || 'No user',
    authLoading,
    sidebarData: {
      teams: sidebarData.teams?.length || 0,
      navGroups: sidebarData.navGroups?.length || 0
    }
  })
    // Prepare user data with safe fallbacks
  const userData = {
    name: user?.displayName || 'User',
    email: user?.email || 'No email disponible',
    avatar: user?.photoURL || '/avatars/default.jpg',
  }

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>      <SidebarHeader>
        {/* <TeamSwitcher teams={sidebarData.teams} /> */}
        <div className="p-2 text-sm font-semibold font-[Orbitron] tracking-widest">Hörgen Platform</div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups?.map((props) => (
          <NavGroup key={props.title} {...props} />
        )) || <div>No navigation items</div>}
      </SidebarContent>      <SidebarFooter>
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
