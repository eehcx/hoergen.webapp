// Utilidad para los estilos de status de usuario
import type { UserResponseDto } from '@/core/types/user.types'

export const callTypes = new Map<
    UserResponseDto['status'],
    string
>([
    ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
    ['inactive', 'bg-neutral-300/40 border-neutral-300'],
    ['banned', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'],
])
