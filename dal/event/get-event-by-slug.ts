import db from "@/lib/db";

export async function getEventBySlug(slug: string) {
    const event = await db.event.findUnique({
        where: { slug, status: "PUBLISHED" },
        select: {
            id: true,
            title: true,
            slug: true,
            featuredImage: true,
            description: true,
            startDate: true,
            endDate: true,
            location: true,
            locationLink: true,
            mode: true,
            categories: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    quota: true,
                    sold: true,
                }
            },
            User: {
                select: {
                    name: true
                }
            },
        }
    })

    if (!event) {
        return null
    }

    return event
}

export type EventBySlugType = Awaited<ReturnType<typeof getEventBySlug>>