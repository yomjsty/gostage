import { NextResponse } from "next/server";
import db from "@/lib/db";
import { randomUUID } from "crypto";
import { generateHostedQRCode } from "@/lib/generate-hosted-qr";
import { sendETicketEmail } from "@/actions/resend";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { order_id, transaction_status, payment_type } = body;

        const ticketReservations = await db.ticketReservation.findMany({
            where: { orderId: order_id },
            select: { categoryId: true, quantity: true, id: true }
        });

        if (transaction_status === "pending") {
            await db.$transaction(async (tx) => {
                await Promise.all(
                    ticketReservations.map((reservation) =>
                        tx.ticketCategory.update({
                            where: { id: reservation.categoryId },
                            data: {
                                sold: { increment: reservation.quantity }
                            }
                        })
                    )
                );
            });
        } else if (payment_type === "credit_card" && transaction_status === "capture") {
            await db.$transaction(async (tx) => {
                await tx.ticketReservation.updateMany({
                    where: { orderId: order_id },
                    data: {
                        status: "PAID",
                        expiresAt: null
                    }
                });

                for (const reservation of ticketReservations) {
                    for (let i = 0; i < reservation.quantity; i++) {
                        const qrText = `TICKET-${reservation.id}-${i}-${randomUUID()}`;

                        await db.ticket.create({
                            data: {
                                ownerId: body.custom_field1,
                                categoryId: reservation.categoryId,
                                reservationId: reservation.id,
                                isUsed: false,
                                qrCode: qrText
                            }
                        });
                    }
                }
            })

            const user = await db.user.findUnique({
                where: { id: body.custom_field1 },
                select: { email: true }
            });

            if (!user?.email) {
                console.error("❌ Email not found for user ID:", body.custom_field1);
                return NextResponse.json({ error: "Email not found" }, { status: 400 });
            }

            const createdTickets = await db.ticket.findMany({
                where: {
                    reservation: {
                        orderId: order_id,
                    },
                },
                include: {
                    category: {
                        include: {
                            event: {
                                select: {
                                    title: true,
                                    location: true,
                                    startDate: true,
                                    User: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            const qrCodes = await Promise.all(
                createdTickets.map(async (ticket) => ({
                    ticketId: ticket.id,
                    category: ticket.category.name,
                    qrBase64: generateHostedQRCode(ticket.qrCode),
                }))
            );

            await sendETicketEmail({
                email: user.email,
                eventTitle: createdTickets[0]?.category.event.title,
                eventDate: createdTickets[0]?.category.event.startDate.toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                location: createdTickets[0]?.category.event.location,
                organizer: createdTickets[0]?.category.event.User.name,
                quantity: createdTickets.length,
                orderId: order_id,
                totalAmount: createdTickets.reduce((total, t) => total + t.category.price, 0),
                qrCodes,
            });
        } else if (transaction_status === "settlement") {
            await db.$transaction(async (tx) => {
                await tx.ticketReservation.updateMany({
                    where: { orderId: order_id },
                    data: {
                        status: "PAID",
                        expiresAt: null
                    }
                });

                for (const reservation of ticketReservations) {
                    for (let i = 0; i < reservation.quantity; i++) {
                        const qrText = `TICKET-${reservation.id}-${i}-${randomUUID()}`;

                        await db.ticket.create({
                            data: {
                                ownerId: body.custom_field1,
                                categoryId: reservation.categoryId,
                                reservationId: reservation.id,
                                isUsed: false,
                                qrCode: qrText
                            }
                        });
                    }
                }
            })

            const user = await db.user.findUnique({
                where: { id: body.custom_field1 },
                select: { email: true }
            });

            if (!user?.email) {
                console.error("❌ Email not found for user ID:", body.custom_field1);
                return NextResponse.json({ error: "Email not found" }, { status: 400 });
            }

            const createdTickets = await db.ticket.findMany({
                where: {
                    reservation: {
                        orderId: order_id,
                    },
                },
                include: {
                    category: {
                        include: {
                            event: {
                                select: {
                                    title: true,
                                    location: true,
                                    startDate: true,
                                    User: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            const qrCodes = await Promise.all(
                createdTickets.map(async (ticket) => ({
                    ticketId: ticket.id,
                    category: ticket.category.name,
                    qrBase64: generateHostedQRCode(ticket.qrCode),
                }))
            );

            await sendETicketEmail({
                email: user.email,
                eventTitle: createdTickets[0]?.category.event.title,
                eventDate: createdTickets[0]?.category.event.startDate.toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                location: createdTickets[0]?.category.event.location,
                organizer: createdTickets[0]?.category.event.User.name,
                quantity: createdTickets.length,
                orderId: order_id,
                totalAmount: createdTickets.reduce((total, t) => total + t.category.price, 0),
                qrCodes,
            });
        } else if (transaction_status === "expire") {

            const soldDecrementMap: Record<string, number> = {};

            for (const { categoryId, quantity } of ticketReservations) {
                soldDecrementMap[categoryId] = (soldDecrementMap[categoryId] || 0) + quantity;
            }

            await db.$transaction(async (tx) => {
                await tx.ticketReservation.updateMany({
                    where: { orderId: order_id },
                    data: {
                        status: "EXPIRED",
                    }
                });

                await Promise.all(
                    Object.entries(soldDecrementMap).map(([categoryId, decrementAmount]) =>
                        tx.ticketCategory.update({
                            where: { id: categoryId },
                            data: {
                                sold: { decrement: decrementAmount }
                            }
                        })
                    )
                );
            });
        } else {
            console.log("ℹ️ Unhandled transaction status:", transaction_status);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}