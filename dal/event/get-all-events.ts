import db from "@/lib/db"
import "server-only"

export async function getAllEvents() {
    return await db.event.findMany({
        where: {
            status: "PUBLISHED"
        },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            featuredImage: true,
            description: true,
            startDate: true,
            location: true,
            mode: true,
            categories: {
                select: {
                    sold: true,
                    quota: true,
                }
            }
        }
    })
}

export type AllEventType = Awaited<ReturnType<typeof getAllEvents>>[0]
