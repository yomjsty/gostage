import { useQuery } from '@tanstack/react-query'

export function useGetMyEvents() {
    return useQuery({
        queryKey: ['my-events'],
        queryFn: async () => {
            const res = await fetch('/api/events/organizer')
            if (!res.ok) throw new Error('Failed to fetch events')
            return res.json()
        },
    })
}

export function useGetTicketCategories(eventId: string) {
    return useQuery({
        queryKey: ['ticket-categories', eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}/ticket-categories`)
            if (!res.ok) throw new Error('Failed to fetch ticket categories')
            return res.json()
        },
    })
}

export function useGetTicketCategoriesByEventSlug(eventSlug: string) {
    return useQuery({
        queryKey: ['ticket-categories', eventSlug],
        queryFn: async () => {
            const res = await fetch(`/api/event/${eventSlug}/ticket-categories`)
            if (!res.ok) throw new Error('Failed to fetch ticket categories')
            return res.json()
        },
    })
}

export function useGetAllEvents() {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await fetch('/api/events')
            if (!res.ok) throw new Error('Failed to fetch events')
            return res.json()
        },
    })
}

export function useGetEventBySlug(eventSlug: string) {
    return useQuery({
        queryKey: ['event', eventSlug],
        queryFn: async () => {
            const res = await fetch(`/api/event/${eventSlug}`)
            if (!res.ok) throw new Error('Failed to fetch event')
            return res.json()
        },
    })
}