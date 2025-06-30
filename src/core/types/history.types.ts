export interface CreateHistoryDto {
    stationId: string
    userId: string
}

export interface HistoryResponse {
    id: string;
    stationId: string;
    userId: string;
    playedAt: {
        _seconds: number;
        _nanoseconds: number;
    } | string; // Timestamp de Firebase o ISO string
}

export interface HistoryQueryParams {
    userId?: string
    stationId?: string
    limit?: number
    offset?: number
    startDate?: string
    endDate?: string
}
