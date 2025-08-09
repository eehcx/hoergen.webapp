import { useQuery } from '@tanstack/react-query'
import { customerService } from '@/core/services'

export function useCustomers() {
    return useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            const customers = await customerService.getCustomers()
            return Array.isArray(customers) ? customers.slice(0, 5) : []
        },
        staleTime: 5 * 60 * 1000,
        retry: 2,
    })
}

export function useGeneralCustomers() {
    return useQuery({
        queryKey: ['customers', 'general'],
        queryFn: async () => {
            const customers = await customerService.getGeneralAnalytics()
            return customers
        },
        staleTime: 5 * 60 * 1000,
        retry: 2,
    })
}

export function useSubscriptions() {
    return useQuery({
        queryKey: ['customers', 'subscriptions'],
        queryFn: async () => {
            const subscriptions = await customerService.getSubscriptionAnalytics()
            return subscriptions
        },
        staleTime: 5 * 60 * 1000,
        retry: 2,
    })
}

export function useCheckoutSessions() {
    return useQuery({
        queryKey: ['customers', 'checkout-sessions'],
        queryFn: async () => {
            const checkoutSessions = await customerService.getCheckoutSessionsAnalytics()
            return checkoutSessions
        },
        staleTime: 5 * 60 * 1000,
        retry: 2,
    })
}