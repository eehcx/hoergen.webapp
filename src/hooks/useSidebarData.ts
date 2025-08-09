import { useAuth } from '@/hooks'
import { type SidebarData } from '../components/layout/types'
import { getNavGroupsByRole } from '../components/layout/data/role-based-sidebar-data'
import { sidebarData as fallbackData } from '../components/layout/data/sidebar-data'


export function useSidebarData(): SidebarData {
    const { claims, isLoading } = useAuth()

    // If loading for too long, use default data but keep trying
    const userRole = (!isLoading && claims?.role) ? claims.role : 'listener'

    const navGroups = getNavGroupsByRole(userRole)

    return {
        // Teams se mantienen estáticos por ahora
        teams: [
        {
            name: 'Hörgen',
            logo: fallbackData.teams[0]?.logo || (() => null),
            plan: 'Audio Platform',
        }
        ],
        // Dynamic NavGroups based on role
        navGroups,
        // User se maneja directamente en el componente
        user: fallbackData.user,
    }
}