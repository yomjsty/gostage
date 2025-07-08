import "server-only"

import db from "@/lib/db"

export async function getTicketCategoriesByEventSlug(eventSlug: string) {
    return await db.ticketCategory.findMany({
        where: {
            event: {
                slug: eventSlug,
            },
        },
        select: {
            id: true,
            name: true,
            price: true,
            quota: true,
            sold: true,
            event: {
                select: {
                    title: true,
                    featuredImage: true,
                    startDate: true,
                    location: true,
                    maxTicketsPerUser: true,
                }
            }
        }
    })
}

export type TicketCategoriesByEventSlug = Awaited<ReturnType<typeof getTicketCategoriesByEventSlug>>[0]
