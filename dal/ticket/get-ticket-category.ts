import "server-only"
import { requireUser } from "../user/require-user"
import { notFound } from "next/navigation"
import db from "@/lib/db"

export async function getTicketCategory(categoryId: string) {
    const user = await requireUser()

    if (!user) {
        return notFound()
    }

    const category = await db.ticketCategory.findUnique({
        where: {
            id: categoryId,
            event: {
                userId: user.id,
            },
        },
        select: {
            id: true,
            name: true,
            price: true,
            quota: true,
        },
    })

    if (!category) {
        return notFound()
    }

    return category
}
