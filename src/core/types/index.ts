// Common API Response interface
export interface ApiResponse<T = any> {
    message: string
    data?: T
}

// Common Error interface
export interface ApiError {
    message: string
    code?: string
    status?: number
}

// Re-export all types for easy importing
export * from './genre.types'
export * from './station.types'
export * from './user.types'
export * from './event.types'
export * from './chat.types'
export * from './product.types'
export * from './country.types'
export * from './history.types'
export * from './feedback.types'
export * from './report.types'

// Re-export external service types
export type { RadioBrowserStation } from '../services/radio-browser'
