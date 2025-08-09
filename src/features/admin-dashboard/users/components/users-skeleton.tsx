import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function UsersTableSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-16" />
                </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {/* Header de la tabla - oculto en móvil */}
                <div className="hidden md:flex items-center space-x-4 border-b pb-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>
                
                {/* Filas de la tabla */}
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 py-3 border-b border-border/50 last:border-b-0">
                    {/* Móvil: Layout vertical */}
                    <div className="flex items-center justify-between md:hidden">
                        <div className="flex items-center space-x-3">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        </div>
                        <div className="flex space-x-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                    
                    {/* Desktop: Layout horizontal */}
                    <div className="hidden md:flex md:items-center md:space-x-4 md:w-full">
                        <Skeleton className="h-4 w-4" />
                        <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-48" />
                        <div className="flex items-center space-x-2">
                        <Skeleton className="h-5 w-12 rounded-full" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-md" />
                        <Skeleton className="h-4 w-24" />
                        <div className="flex space-x-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                    
                    {/* Información adicional en móvil */}
                    <div className="flex items-center justify-between text-sm md:hidden pl-11">
                        <div className="flex items-center space-x-4">
                        <Skeleton className="h-5 w-12 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-md" />
                        </div>
                        <Skeleton className="h-3 w-20" />
                    </div>
                    </div>
                ))}
                </div>
                
                {/* Paginación skeleton */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t gap-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
                </div>
            </CardContent>
        </Card>
    )
}
