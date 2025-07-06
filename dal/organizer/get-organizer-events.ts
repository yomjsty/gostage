import "server-only"

import db from '@/lib/db'

export async function getOrganizerEvents(userId: string) {
    return await db.event.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            featuredImage: true,
            description: true,
            startDate: true,
            endDate: true,
            location: true,
            mode: true,
        },
    })
}

export type OrganizerEvent = Awaited<ReturnType<typeof getOrganizerEvents>>[0]