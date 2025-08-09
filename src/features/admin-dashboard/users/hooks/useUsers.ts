import { useQuery } from '@tanstack/react-query'
import { UserService } from '@/core/services/users/user.service'
import { UserResponseDto, UserRole, PlanType } from '@/core/types/user.types'

// Mapeo de roles visuales (solo los de UserRole)
const validRoles: UserRole[] = ['listener', 'pro', 'creator', 'moderator', 'admin']

// Función para transformar los datos de usuario para mantener compatibilidad con UserResponseDto
function transformUserData(users: UserResponseDto[]): UserResponseDto[] {
    return users.map((u) => {
        const role = validRoles.includes(u.claims.role) ? u.claims.role : 'listener'
        
        // Mantener la estructura original pero asegurar que los datos estén normalizados
        return {
            ...u,
            claims: {
                ...u.claims,
                role,
                plan: u.claims.plan || 'free' as PlanType
            },
            favorites: u.favorites || [],
            displayName: u.displayName || '',
        }
    })
}

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
        const users = await UserService.getInstance().getAllUsers()
            return transformUserData(users)
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 3,
    })
}
