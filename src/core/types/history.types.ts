export interface CreateHistoryDto {
    stationId: string
    userId: string
}

export interface HistoryResponseDto {
    id: string
    stationId: string
    userId: string
    createdAt: string
    updatedAt: string
    // Additional fields that might be included from joins
    station?: {
        id: string
        name: string
        coverImage?: string
        streamUrl: string
    }
    user?: {
        id: string
        displayName: string
        photoURL?: string
    }
}

export interface HistoryQueryParams {
    userId?: string
    stationId?: string
    limit?: number
    offset?: number
    startDate?: string
    endDate?: string
}
