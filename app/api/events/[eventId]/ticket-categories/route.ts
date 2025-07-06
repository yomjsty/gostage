import { getTicketCategories } from "@/dal/ticket/get-ticket-categories"
import { requireUser } from "@/dal/user/require-user"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const user = await requireUser()
        if (user.role !== "organizer" && user.role !== "admin") {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        const { eventId } = await params
        const ticketCategories = await getTicketCategories(eventId)
        return NextResponse.json(ticketCategories)
    } catch (error) {
        console.error('[GET_TICKET_CATEGORIES_ERROR]', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}