import { BaseService } from '../base.service'
import {
    CreateEventDto,
    UpdateEventDto,
    EventResponseDto,
    EventQueryParams,
    ApiResponse
} from '../../types'

/**
 * Event Service - Manages all event-related API operations
 * Singleton pattern like Angular services
 */
export class EventService extends BaseService {
    private static instance: EventService

    private constructor() {
        super()
    }

    /**
     * Get singleton instance
     */
    static getInstance(): EventService {
        if (!EventService.instance) {
            EventService.instance = new EventService()
        }
        return EventService.instance
    }

    /**
     * Create a new event
     */
    async createEvent(data: CreateEventDto): Promise<ApiResponse> {
        try {
            const response = await this.api.post('/events', data)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Get all events with optional filters
     */
    async getAllEvents(params?: EventQueryParams): Promise<EventResponseDto[]> {
        try {
            const response = await this.api.get('/events', { params })
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Get event by ID
     */
    async getEventById(id: string): Promise<EventResponseDto> {
        try {
            const response = await this.api.get(`/events/${id}`)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Update event by ID
     */
    async updateEvent(id: string, data: UpdateEventDto): Promise<ApiResponse> {
        try {
            const response = await this.api.put(`/events/${id}`, data)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Delete event by ID
     */
    async deleteEvent(id: string): Promise<ApiResponse> {
        try {
            const response = await this.api.delete(`/events/${id}`)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Get events by station
     */
    async getEventsByStation(stationId: string): Promise<EventResponseDto[]> {
        try {
            const response = await this.api.get(`/events/station/${stationId}`)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Get upcoming events
     */
    async getUpcomingEvents(): Promise<EventResponseDto[]> {
        try {
            const response = await this.api.get('/events?upcoming=true')
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Get events by date range
     */
    async getEventsByDateRange(startDate: string, endDate: string): Promise<EventResponseDto[]> {
        try {
            const response = await this.api.get(`/events?startDate=${startDate}&endDate=${endDate}`)
            return response.data
        } catch (error) {
            return this.handleError(error)
        }
    }
}
