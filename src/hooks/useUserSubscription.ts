import { useQuery } from '@tanstack/react-query'
import { useAuth } from './useAuth'

export interface UserSubscription {
    plan: string // 'free' | 'pro' | 'creator'
    status: 'active' | 'cancelled' | 'expired' | 'pending'
    startDate?: string
    endDate?: string
}

/**
 * Hook para obtener la suscripción actual del usuario
 * Basado en los claims del usuario autenticado
 */
export function useUserSubscription() {
    const { claims, isLoading: isAuthLoading } = useAuth()

    return useQuery({
        queryKey: ['user-subscription', claims?.plan],
        queryFn: async (): Promise<UserSubscription | null> => {
        if (!claims) {
            return null
        }

        // Simular delay de API (puedes remover esto)
        await new Promise(resolve => setTimeout(resolve, 100))

        // Extraer información de suscripción de los claims
        const userSubscription: UserSubscription = {
            plan: claims.plan || 'free',
            status: claims.plan && claims.plan !== 'free' ? 'active' : 'expired',
            // Agregar fechas si están disponibles en tu estructura de claims
            // startDate: claims.subscriptionStartDate,
            // endDate: claims.subscriptionEndDate
        }

        return userSubscription
        },
        enabled: !isAuthLoading && !!claims, // Solo ejecutar cuando auth esté listo y tengamos claims
        staleTime: 2 * 60 * 1000, // 2 minutos - suscripciones cambian menos frecuentemente
        gcTime: 5 * 60 * 1000, // 5 minutos en caché
        refetchOnWindowFocus: true,
    })
}
