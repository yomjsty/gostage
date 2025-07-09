"use server";

import { requireUser } from "@/dal/user/require-user";
import db from "@/lib/db";
import { snap } from "@/lib/midtrans";
import { ApiResponse } from "@/lib/types";

export async function createSnapToken(payload: {
    totalAmount: number;
    tickets: { id: string; name: string; price: number; quantity: number }[];
    event: { title: string; startDate: string; location: string } | null;
}): Promise<ApiResponse> {
    const user = await requireUser();

    if (!user) {
        return {
            status: "error",
            message: "You must be logged in to do a checkout",
        }
    }

    const totalAmount = payload.tickets.reduce((acc, ticket) => acc + (ticket.price * ticket.quantity), 0);

    try {
        const orderId = "ORDER-" + Math.random().toString(36).substring(2, 10);

        await Promise.all(payload.tickets.map(async (ticket) =>
            await db.ticketReservation.create({
                data: {
                    userId: user.id,
                    categoryId: ticket.id,
                    quantity: ticket.quantity,
                    status: "PENDING",
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                    orderId
                }
            })
        ))

        const parameter = {
            "transaction_details": {
                "order_id": orderId,
                "gross_amount": totalAmount,
            },
            "credit_card": {
                "secure": true
            },
            "item_details": payload.tickets.map(ticket => ({
                "id": ticket.id,
                "name": ticket.name,
                "price": ticket.price,
                "quantity": ticket.quantity,
            })),
            "customer_details": {
                "first_name": user.name,
                "email": user.email,
                "phone": "+62" + user.phoneNumber,
                "billing_address": {
                    "first_name": user.name,
                    "email": user.email,
                    "phone": "+62" + user.phoneNumber,
                    "address": user.address,
                    "country_code": "IDN"
                },
                "shipping_address": {
                    "first_name": user.name,
                    "email": user.email,
                    "phone": "+62" + user.phoneNumber,
                    "address": user.address,
                    "country_code": "IDN"
                }
            },
            "custom_field1": user.id,
        }

        const token = await snap.createTransactionToken(parameter)

        return {
            status: "success",
            message: "Token created successfully",
            token
        }
    } catch (error) {
        console.error("❌ Failed to create token:", error);
        return {
            status: "error",
            message: "Failed to create token",
        }
    }

}