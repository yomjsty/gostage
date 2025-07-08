import { getTicketCategoriesByEventSlug } from "@/dal/ticket/get-ticket-categories-by-eventSlug"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ eventSlug: string }> }
) {
    try {
        const { eventSlug } = await params
        const ticketCategories = await getTicketCategoriesByEventSlug(eventSlug)
        return NextResponse.json(ticketCategories)
    } catch (error) {
        console.error('[GET_TICKET_CATEGORIES_ERROR]', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}