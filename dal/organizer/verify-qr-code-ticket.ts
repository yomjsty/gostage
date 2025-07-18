import db from "@/lib/db"

export async function verifyQRCodeTicket(qrCode: string, userId: string) {
    return await db.ticket.findUnique({
        where: { qrCode, category: { event: { userId } } },
        select: {
            id: true,
            isUsed: true,
            owner: {
                select: {
                    name: true,
                }
            },
            category: {
                select: {
                    name: true,
                    price: true,
                    event: {
                        select: {
                            title: true,
                        }
                    }
                }
            },
            reservation: {
                select: {
                    orderId: true,
                    status: true,
                }
            }
        }
    });
}

export type VerifyQRCodeTicketType = Awaited<ReturnType<typeof verifyQRCodeTicket>>