"use server"

import db from "@/lib/db"

export async function getTicketCategories(eventId: string) {
    return await db.ticketCategory.findMany({
        where: {
            eventId,
        },
        select: {
            id: true,
            name: true,
            price: true,
            quota: true,
            sold: true,
        }
    })
}

export type TicketCategories = Awaited<ReturnType<typeof getTicketCategories>>[0]
