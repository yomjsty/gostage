import { notFound } from "next/navigation";
import { requireUser } from "../user/require-user";
import db from "@/lib/db";

export async function getUserTickets() {
    const user = await requireUser()

    if (!user) {
        return notFound()
    }

    const tickets = await db.ticket.findMany({
        where: { ownerId: user.id },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            reservation: {
                select: {
                    id: true,
                    status: true,
                    orderId: true,
                    quantity: true,
                }
            },
            category: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    event: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            featuredImage: true,
                            startDate: true,
                            endDate: true,
                            location: true,
                            locationLink: true,
                            mode: true,
                        }
                    }
                }
            }
        }
    })


    return tickets
}

export type UserTicketType = Awaited<ReturnType<typeof getUserTickets>>[0]