export type AppPlatform = 'web' | 'android' | 'ios'

export interface CreateFeedbackDto {
    appPlatform: AppPlatform
    userId?: string
    email?: string
    message: string
}

export interface ResponseFeedbackDto {
    id: string
    appPlatform: AppPlatform
    userId?: string
    email?: string
    message: string
    createdAt: { 
        _seconds: number; 
        _nanoseconds: number 
    } | Date
}