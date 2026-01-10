import { useAuth } from '@/presentation/hooks/index.ts'
import { useStaticTranslation } from '@/presentation/hooks/useTranslation.ts'
import { type SidebarData } from '@/presentation/components/layout/types.ts'
import { getNavGroupsByRole } from '@/presentation/components/layout/data/role-based-sidebar-data.ts'
import { sidebarData as fallbackData } from '@/presentation/components/layout/data/sidebar-data.ts'


export function useSidebarData(): SidebarData {
    const { claims, isLoading } = useAuth()
    const { t } = useStaticTranslation()

    // If loading for too long, use default data but keep trying
    const userRole = (!isLoading && claims?.role) ? claims.role : 'listener'

    const navGroups = getNavGroupsByRole(userRole, t)

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