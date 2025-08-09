export interface CreateHistoryDto {
    stationId: string
    userId: string
}

export interface HistoryResponse {
    id: string;
    stationId: string;
    userId: string;
    lastPlayedAt: {
        _seconds: number;
        _nanoseconds: number;
    } | string; 
    playHistory: []
}

export interface HistoryQueryParams {
    userId?: string
    stationId?: string
    limit?: number
    offset?: number
    startDate?: string
    endDate?: string
}
