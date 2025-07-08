import { getEventBySlug } from "@/dal/event/get-event-by-slug";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ eventSlug: string }> }
) {
    try {
        const { eventSlug } = await params
        const event = await getEventBySlug(eventSlug)

        if (!event) {
            return new NextResponse('Event not found', { status: 404 })
        }

        return NextResponse.json(event)
    } catch (error) {
        console.error('[GET_EVENT_ERROR]', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

