export interface CreateEventDto {
  title: string
  description: string
  stationId: string
  show: boolean
}

export interface UpdateEventDto {
  title?: string
  description?: string
  stationId?: string
  show?: boolean
}

export interface EventResponseDto {
  id: string
  title: string
  description: string
  stationId: string
  show: boolean
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  } | string
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  } | string
}

export interface EventQueryParams {
  stationId?: string
}
