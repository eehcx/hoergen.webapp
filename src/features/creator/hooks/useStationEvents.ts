import { useQuery } from '@tanstack/react-query'
import { EventService } from '@/core/services/events/event.service'
import type { EventResponseDto } from '@/core/types/event.types'

export function useStationEvents(stationId: string | undefined) {
    return useQuery<EventResponseDto[]>({
        queryKey: ['station-events', stationId],
        queryFn: async () => {
        if (!stationId) return []
            const events = await EventService.getInstance().getEventsByStation(stationId)
            return events
        },
        enabled: !!stationId,
        staleTime: 1000 * 60 * 5,
    })
}
