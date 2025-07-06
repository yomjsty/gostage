import { NextResponse } from 'next/server'
import { requireUser } from '@/dal/user/require-user'
import { getOrganizerEvents } from '@/dal/organizer/get-organizer-events'

export async function GET() {
    try {
        const user = await requireUser()
        if (user.role !== "organizer" && user.role !== "admin") {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        const events = await getOrganizerEvents(user.id)
        return NextResponse.json(events)
    } catch (error) {
        console.error('[GET_EVENTS_ERROR]', error)
        return new NextResponse('Unauthorized', { status: 401 })
    }
}