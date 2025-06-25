export interface CreateEventDto {
  title: string
  description: string
  stationId: string
  startTime: string // ISO date
  endTime: string // ISO date
}

export interface UpdateEventDto {
  title?: string
  description?: string
  stationId?: string
  startTime?: string
  endTime?: string
}

export interface EventResponseDto {
  id: string
  title: string
  description: string
  stationId: string
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

export interface EventQueryParams {
  stationId?: string
}
