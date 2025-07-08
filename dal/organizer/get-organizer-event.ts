import "server-only"

import db from "@/lib/db"
import { notFound } from "next/navigation"
import { requireUser } from "../user/require-user"

export async function getOrganizerEvent(eventId: string) {
    const user = await requireUser()

    if (!user) {
        return notFound()
    }

    const event = await db.event.findUnique({
        where: { id: eventId, userId: user.id },
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
            maxTicketsPerUser: true,
            status: true,
        },
    })

    if (!event) {
        return notFound()
    }

    return event
}

export type OrganizerEvent = Awaited<ReturnType<typeof getOrganizerEvent>>
