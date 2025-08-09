import { useQuery } from '@tanstack/react-query'
import { ProductService } from '@/core/services/products/product.service'

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            // Usar el servicio actualizado para listar productos con precios
            const products = await ProductService.getInstance().list({ withPrices: true })
            return products
        },
        staleTime: 5 * 60 * 1000,
        retry: 3,
    })
}
