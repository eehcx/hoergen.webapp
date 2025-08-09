import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { EventService } from '@/core/services'
import type { EventResponseDto, CreateEventDto } from '@/core/types/event.types'

export function useStationEvents(stationId: string) {
    const eventService = EventService.getInstance()
    return useQuery<EventResponseDto[]>({
        queryKey: ['events', stationId],
        queryFn: async () => {
            const events = await eventService.getEventsByStation(stationId)
            return events.filter(ev => ev.show === true)
        },
        staleTime: 1000 * 60 * 2,
    })
}

export function useCreateStationEvent(stationId: string, onSuccess?: () => void) {
    const eventService = EventService.getInstance()
    const queryClient = useQueryClient()
    const [form, setForm] = useState<CreateEventDto & { show: boolean }>({
        title: '',
        description: '',
        stationId,
        show: true,
    })

    const mutation = useMutation({
        mutationFn: (data: CreateEventDto & { show: boolean }) => eventService.createEvent(data),
        onSuccess: () => {
            setForm({
                title: '',
                description: '',
                stationId,
                show: true,
            })
            queryClient.invalidateQueries({ queryKey: ['events', stationId] })
            onSuccess && onSuccess()
        }
    })

    return { form, setForm, ...mutation }
}
