import { useQuery } from '@tanstack/react-query'
import { UserService } from '@/core/services'
import type {
  UserResponseDto,
  UserRole,
  PlanType,
  UserStatus,
} from '@/core/types'

/**
 * Hook para obtener datos de un usuario por ID
 */
export function useUserData(userId: string | undefined) {
  const userService = UserService.getInstance()

  return useQuery<UserResponseDto>({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')
      const userData = await userService.getUserById(userId)
      return userData
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 1,
  })
}

/**
 * Hook para obtener datos de múltiples usuarios por IDs
 */
export function useMultipleUsersData(userIds: string[]) {
  const userService = UserService.getInstance()

  return useQuery<UserResponseDto[]>({
    queryKey: ['users', userIds],
    queryFn: async () => {
      if (!userIds || userIds.length === 0) return []

      const userPromises = userIds.map((id) =>
        userService.getUserById(id).catch((error) => {
          console.warn(`Failed to fetch user ${id}:`, error)
          return null
        })
      )

      const users = await Promise.all(userPromises)
      return users.filter((user): user is UserResponseDto => user !== null)
    },
    enabled: userIds && userIds.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 1,
  })
}

/**
 * Hook para buscar usuario por email
 * Nota: Este hook requiere que el backend tenga un endpoint para buscar por email
 */
export function useUserByEmail(email: string | undefined) {
  return useQuery<UserResponseDto | null>({
    queryKey: ['userByEmail', email],
    queryFn: async () => {
      if (!email) throw new Error('Email is required')

      try {
        // TODO: Implementar endpoint en backend para buscar por email
        // Por ahora retornamos null y usaremos una implementación mock
        console.log('Searching user by email:', email)

        // Mock implementation - replace with actual API call
        return mockSearchUserByEmail(email)
      } catch (error) {
        console.warn('Failed to search user by email:', error)
        return null
      }
    },
    enabled: !!email && email.includes('@'),
    staleTime: 1000 * 60 * 2, // 2 minutos (menor tiempo para búsquedas)
    retry: 1,
  })
}

// Mock function para simular búsqueda por email
// TODO: Reemplazar con llamada real a la API
async function mockSearchUserByEmail(
  email: string
): Promise<UserResponseDto | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock response
  return {
    id: `user_${Date.now()}`,
    email: email,
    displayName: email.split('@')[0],
    photoURL: undefined,
    claims: {
      role: 'user' as UserRole,
      plan: 'free' as PlanType,
    },
    status: 'active' as UserStatus,
    favorites: [],
    createdAt: new Date().toISOString(),
  }
}
