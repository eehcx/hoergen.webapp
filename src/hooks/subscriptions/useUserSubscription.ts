import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks'
import type { UserSubscription } from '@/core/types/subscription.types'

/**
 * Hook to get current user subscription based on user claims
 * Simple and efficient - uses existing claims instead of additional Firebase queries
 */
export function useUserSubscription() {
    const { user, claims, isLoading: isAuthLoading } = useAuth()

    return useQuery({
        queryKey: ['userSubscription', user?.uid, claims?.plan],
        queryFn: async (): Promise<UserSubscription | null> => {
            if (!user || !claims) {
                return null
            }

            // Get subscription info from user claims
            const plan = claims.plan || 'free'

            // Create subscription object based on claims
            const subscription: UserSubscription = {
                plan: plan,
                status: plan !== 'free' ? 'active' : 'expired'
            }

            return subscription
        },
        enabled: !isAuthLoading && !!user && !!claims,
        staleTime: 10 * 60 * 1000, // 10 minutes - claims don't change often
        retry: 1
    })
}
