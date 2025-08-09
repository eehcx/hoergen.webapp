import { useAuth } from './useAuth'
import { UserRole } from '@/core/types'

export function usePermissions() {
  const { claims } = useAuth()

  // Funciones basadas en ROLES (no permisos complejos)
  const hasRole = (role: UserRole): boolean => {
    return claims?.role === role
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => claims?.role === role)
  }

  // Helpers específicos para tu dominio
  const canModerateChat = hasAnyRole(['moderator', 'admin'])
  const canCreateStation = hasAnyRole(['creator', 'admin'])
  const canDeleteStation = hasRole('admin')
  // Plan access
  const isProUser = hasAnyRole(['pro', 'creator', 'admin'])
  const isCreatorUser = hasAnyRole(['creator', 'admin'])
  const canAccessProFeatures = isProUser
  const canAccessCreatorFeatures = isCreatorUser

  return {
    hasRole,
    hasAnyRole,
    canModerateChat,
    canCreateStation,
    canDeleteStation,
    canAccessProFeatures,
    canAccessCreatorFeatures,
    role: claims?.role,
    plan: claims?.plan
  }
}
