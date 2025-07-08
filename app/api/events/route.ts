import { NextResponse } from 'next/server'
import { getAllEvents } from "@/dal/event/get-all-events"

export async function GET() {
    try {
        const events = await getAllEvents()
        return NextResponse.json(events)
    } catch (error) {
        console.error('[GET_EVENTS_ERROR]', error)
        return new NextResponse('Unauthorized', { status: 401 })
    }
}