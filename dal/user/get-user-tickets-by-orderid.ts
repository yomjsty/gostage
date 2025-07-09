import { notFound } from "next/navigation";
import { requireUser } from "../user/require-user";
import db from "@/lib/db";

export async function getUserTicketsByOrderId(orderId: string) {
    const user = await requireUser()

    if (!user) {
        return notFound()
    }

    const tickets = await db.ticket.findMany({
        where: { ownerId: user.id, reservation: { orderId } },
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            qrCode: true,
            category: {
                select: {
                    name: true,
                    price: true,
                    event: {
                        select: {
                            title: true,
                            featuredImage: true,
                            description: true,
                            startDate: true,
                            location: true,
                            locationLink: true,
                            User: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    }
                }
            },
            reservation: {
                select: {
                    status: true,
                }
            }
        }
    })


    return tickets
}

export type UserTicketByOrderIdType = Awaited<ReturnType<typeof getUserTicketsByOrderId>>[0]