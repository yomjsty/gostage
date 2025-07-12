import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST() {
    try {
        // Get all expired reservations that are still PENDING
        const expiredReservations = await db.ticketReservation.findMany({
            where: {
                status: "PENDING",
                expiresAt: {
                    lt: new Date()
                }
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (expiredReservations.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No expired reservations found",
                cleanedCount: 0
            });
        }

        // Group by category to calculate total decrement amounts
        const soldDecrementMap: Record<string, number> = {};
        const orderIds: string[] = [];

        for (const reservation of expiredReservations) {
            soldDecrementMap[reservation.categoryId] = (soldDecrementMap[reservation.categoryId] || 0) + reservation.quantity;
            orderIds.push(reservation.orderId);
        }

        // Use transaction to ensure atomicity
        await db.$transaction(async (tx) => {
            // Update expired reservations status
            await tx.ticketReservation.updateMany({
                where: {
                    id: {
                        in: expiredReservations.map(r => r.id)
                    }
                },
                data: {
                    status: "EXPIRED"
                }
            });

            // Decrement sold count for each category
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

        console.log(`🧹 Cleaned up ${expiredReservations.length} expired reservations from ${Object.keys(soldDecrementMap).length} categories`);

        return NextResponse.json({
            success: true,
            message: `Cleaned up ${expiredReservations.length} expired reservations`,
            cleanedCount: expiredReservations.length,
            affectedCategories: Object.keys(soldDecrementMap).length,
            orderIds: [...new Set(orderIds)] // Unique order IDs
        });

    } catch (error) {
        console.error("❌ Cleanup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 