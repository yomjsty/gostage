import db from "@/lib/db"
import "server-only"

export async function getAllFeaturedEvents() {
    return await db.event.findMany({
        where: {
            featured: true,
            status: "PUBLISHED"
        },
        orderBy: { createdAt: 'desc' },
        select: {
            slug: true,
            featuredImage: true,
        }
    })
}

export type AllFeaturedEventType = Awaited<ReturnType<typeof getAllFeaturedEvents>>[0]
