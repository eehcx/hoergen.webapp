import { useQuery } from '@tanstack/react-query'
import { productService } from '@/core/services'

// Types - puedes moverlos a un archivo de types más tarde
export interface ProductPrice {
    stripePriceId: string
    unit_amount: number
    currency: string
    recurring: {
        interval: string
        interval_count: number
        meter: null
        trial_period_days: null
        usage_type: string
    }
    metadata: {
        access_level: string
        created_from: string
        display_name: string
        features: string
        firebase_product_id: string
        subscription_type: string
        type: string
    }
    createdAt: {
        _seconds: number
        _nanoseconds: number
    }
    active: boolean
}

export interface RealProduct {
    id: string
    name: string
    description: string
    imageUrl?: string
    accessLevel: number
    createdFrom: string
    features: string
    subscriptionType: string
    type: string
    stripeProductId: string
    active: boolean
    prices: ProductPrice[]
    createdAt: {
        _seconds: number
        _nanoseconds: number
    }
    updatedAt: {
        _seconds: number
        _nanoseconds: number
    }
}

/**
 * Hook para obtener productos activos usando TanStack Query
 * ✅ Caché automático
 * ✅ Re-fetch en focus
 * ✅ Estados mejorados
 */
export function useProducts() {
    return useQuery({
        queryKey: ['products', 'active'],
        queryFn: async () => {
        const products = await productService.getActiveProducts() as unknown as RealProduct[]
        // Filtrar solo productos activos
        return products.filter(product => product.active)
        },
        staleTime: 5 * 60 * 1000, // 5 minutos - datos considerados frescos
        gcTime: 10 * 60 * 1000, // 10 minutos - tiempo en caché (garbage collection time)
        refetchOnWindowFocus: true, // Re-fetch cuando vuelves a la pestaña
        refetchOnMount: true, // Re-fetch al montar el componente
        retry: 3, // Reintentar 3 veces si falla
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
    })
    }

    /**
     * Hook para obtener un producto específico por ID
     */
    export function useProduct(productId: string) {
    return useQuery({
        queryKey: ['products', productId],
        queryFn: async () => {
        // Aquí podrías tener un endpoint específico para un producto
        // Por ahora, obtenemos todos y filtramos
        const products = await productService.getActiveProducts() as unknown as RealProduct[]
        return products.find(product => product.id === productId)
        },
        enabled: !!productId, // Solo ejecutar si tenemos un ID
        staleTime: 5 * 60 * 1000,
    })
}
