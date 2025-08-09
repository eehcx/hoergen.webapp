import { useQuery } from '@tanstack/react-query'
import { ProductService } from '@/core/services/products/product.service'
import { ProductWithPriceResponse } from '@/core/types/product.types'

// Re-export los tipos del servicio para compatibilidad
export type { ProductWithPriceResponse, PriceResponseDto } from '@/core/types/product.types'

// Types legacy - mantener para compatibilidad con código existente
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

export interface RealProduct extends ProductWithPriceResponse {
  // Mapping fields for compatibility
  features: string
  subscriptionType: string
}

/**
 * Hook para obtener productos activos usando TanStack Query
 * ✅ Caché automático
 * ✅ Re-fetch en focus
 * ✅ Estados mejorados
 */
export function useProducts() {
  return useQuery({
    queryKey: ['products', 'active', 'withPrices'],
    queryFn: async () => {
      // Usar el nuevo servicio con withPrices=true para incluir los precios
      const products = await ProductService.getInstance().list({ withPrices: true })
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
    // Usar el servicio específico para obtener un producto por ID
    return await ProductService.getInstance().getById(productId, true)
    },
    enabled: !!productId, // Solo ejecutar si tenemos un ID
    staleTime: 5 * 60 * 1000,
  })
}
