"use server";

import { requireUser } from "@/dal/user/require-user";
import db from "@/lib/db";
import { snap } from "@/lib/midtrans";
import { ApiResponse } from "@/lib/types";

// Simple in-memory rate limiting (in production, use Redis or similar)
// const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// function checkRateLimit(userId: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
//     const now = Date.now();
//     const userLimit = rateLimitMap.get(userId);

//     if (!userLimit || now > userLimit.resetTime) {
//         rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
//         return true;
//     }

//     if (userLimit.count >= maxAttempts) {
//         return false;
//     }

//     userLimit.count++;
//     return true;
// }

// SECURE VERSION: Only accept ticket IDs and quantities from client
export async function createSnapToken(payload: {
    tickets: { id: string; quantity: number }[];
}): Promise<ApiResponse> {
    const user = await requireUser();

    if (!user) {
        return {
            status: "error",
            message: "You must be logged in to do a checkout",
        }
    }

    // Check rate limit (5 attempts per minute)
    // if (!checkRateLimit(user.id, 5, 60000)) {
    //     return {
    //         status: "error",
    //         message: "Too many reservation attempts. Please wait a minute before trying again.",
    //     }
    // }

    try {
        // Validate ticket availability and get server-side data
        const validationErrors: string[] = [];
        const validatedTickets: Array<{
            id: string;
            name: string;
            price: number;
            quantity: number;
            categoryId: string;
        }> = [];

        for (const ticket of payload.tickets) {
            // Get current ticket category with latest data from database
            const category = await db.ticketCategory.findUnique({
                where: { id: ticket.id },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    quota: true,
                    sold: true,
                    event: {
                        select: {
                            maxTicketsPerUser: true,
                            title: true
                        }
                    }
                }
            });

            if (!category) {
                validationErrors.push(`Ticket category not found`);
                continue;
            }

            // Check if category is sold out
            const remainingQuota = category.quota - category.sold;
            if (remainingQuota <= 0) {
                validationErrors.push(`${category.name} is sold out`);
                continue;
            }

            // Check if requested quantity exceeds remaining quota
            if (ticket.quantity > remainingQuota) {
                validationErrors.push(`Only ${remainingQuota} tickets remaining for ${category.name}`);
                continue;
            }

            // Check if user has existing pending reservations for this category
            const existingReservations = await db.ticketReservation.findMany({
                where: {
                    userId: user.id,
                    categoryId: ticket.id,
                    status: "PENDING",
                    expiresAt: {
                        gt: new Date()
                    }
                }
            });

            const existingQuantity = existingReservations.reduce((sum, res) => sum + res.quantity, 0);
            const totalRequested = existingQuantity + ticket.quantity;

            // Check if total requested exceeds max tickets per user
            if (totalRequested > category.event.maxTicketsPerUser) {
                validationErrors.push(`You can only purchase up to ${category.event.maxTicketsPerUser} tickets for ${category.name}`);
                continue;
            }

            // Check if total requested exceeds remaining quota
            if (totalRequested > remainingQuota) {
                validationErrors.push(`Only ${remainingQuota} tickets remaining for ${category.name} (you already have ${existingQuantity} pending)`);
                continue;
            }

            // Add validated ticket with server-side data
            validatedTickets.push({
                id: ticket.id,
                name: category.name,
                price: category.price, // Server-side price
                quantity: ticket.quantity,
                categoryId: category.id
            });
        }

        if (validationErrors.length > 0) {
            return {
                status: "error",
                message: validationErrors.join(". "),
            }
        }

        // Calculate total amount using server-side prices only
        const totalAmount = validatedTickets.reduce((acc, ticket) => acc + (ticket.price * ticket.quantity), 0);

        const orderId = "ORDER-" + Math.random().toString(36).substring(2, 10);

        // Use transaction to ensure atomicity
        await db.$transaction(async (tx) => {
            // Double-check availability within transaction
            for (const ticket of validatedTickets) {
                const category = await tx.ticketCategory.findUnique({
                    where: { id: ticket.id },
                    select: { quota: true, sold: true, price: true }
                });

                if (!category) {
                    throw new Error(`Ticket category not found`);
                }

                // Double-check price within transaction
                if (ticket.price !== category.price) {
                    throw new Error(`Price validation failed for ${ticket.name}`);
                }

                const remainingQuota = category.quota - category.sold;
                if (ticket.quantity > remainingQuota) {
                    throw new Error(`Insufficient tickets available for ${ticket.name}`);
                }
            }

            // Create reservations
            await Promise.all(validatedTickets.map(async (ticket) =>
                await tx.ticketReservation.create({
                    data: {
                        userId: user.id,
                        categoryId: ticket.categoryId,
                        quantity: ticket.quantity,
                        status: "PENDING",
                        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                        orderId
                    }
                })
            ));
        });

        const parameter = {
            "transaction_details": {
                "order_id": orderId,
                "gross_amount": totalAmount, // Server-calculated amount
            },
            "credit_card": {
                "secure": true
            },
            "item_details": validatedTickets.map(ticket => ({
                "id": ticket.id,
                "name": ticket.name,
                "price": ticket.price, // Server-side price
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
            message: error instanceof Error ? error.message : "Failed to create token",
        }
    }

}

// LEGACY VERSION: Keep for backward compatibility but with enhanced security
export async function createSnapTokenLegacy(payload: {
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

    // Check rate limit (5 attempts per minute)
    // if (!checkRateLimit(user.id, 5, 60000)) {
    //     return {
    //         status: "error",
    //         message: "Too many reservation attempts. Please wait a minute before trying again.",
    //     }
    // }

    try {
        // Validate ticket availability and prices before creating reservations
        const validationErrors: string[] = [];
        const validatedTickets: Array<{
            id: string;
            name: string;
            price: number;
            quantity: number;
            serverPrice: number;
        }> = [];

        for (const ticket of payload.tickets) {
            // Get current ticket category with latest sold count and price
            const category = await db.ticketCategory.findUnique({
                where: { id: ticket.id },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    quota: true,
                    sold: true,
                    event: {
                        select: {
                            maxTicketsPerUser: true,
                            title: true
                        }
                    }
                }
            });

            if (!category) {
                validationErrors.push(`Ticket category ${ticket.name} not found`);
                continue;
            }

            // CRITICAL SECURITY FIX: Validate that client price matches server price
            if (ticket.price !== category.price) {
                validationErrors.push(`Price mismatch for ${category.name}. Expected: Rp ${category.price.toLocaleString()}, Received: Rp ${ticket.price.toLocaleString()}`);
                continue;
            }

            // Check if category is sold out
            const remainingQuota = category.quota - category.sold;
            if (remainingQuota <= 0) {
                validationErrors.push(`${category.name} is sold out`);
                continue;
            }

            // Check if requested quantity exceeds remaining quota
            if (ticket.quantity > remainingQuota) {
                validationErrors.push(`Only ${remainingQuota} tickets remaining for ${category.name}`);
                continue;
            }

            // Check if user has existing pending reservations for this category
            const existingReservations = await db.ticketReservation.findMany({
                where: {
                    userId: user.id,
                    categoryId: ticket.id,
                    status: "PENDING",
                    expiresAt: {
                        gt: new Date()
                    }
                }
            });

            const existingQuantity = existingReservations.reduce((sum, res) => sum + res.quantity, 0);
            const totalRequested = existingQuantity + ticket.quantity;

            // Check if total requested exceeds max tickets per user
            if (totalRequested > category.event.maxTicketsPerUser) {
                validationErrors.push(`You can only purchase up to ${category.event.maxTicketsPerUser} tickets for ${category.name}`);
                continue;
            }

            // Check if total requested exceeds remaining quota
            if (totalRequested > remainingQuota) {
                validationErrors.push(`Only ${remainingQuota} tickets remaining for ${category.name} (you already have ${existingQuantity} pending)`);
                continue;
            }

            // Add validated ticket with server price
            validatedTickets.push({
                ...ticket,
                serverPrice: category.price
            });
        }

        if (validationErrors.length > 0) {
            return {
                status: "error",
                message: validationErrors.join(". "),
            }
        }

        // CRITICAL SECURITY FIX: Calculate total amount using server-side prices
        const serverTotalAmount = validatedTickets.reduce((acc, ticket) => acc + (ticket.serverPrice * ticket.quantity), 0);

        // Validate that client total matches server total
        if (payload.totalAmount !== serverTotalAmount) {
            return {
                status: "error",
                message: `Total amount mismatch. Expected: Rp ${serverTotalAmount.toLocaleString()}, Received: Rp ${payload.totalAmount.toLocaleString()}`,
            }
        }

        const orderId = "ORDER-" + Math.random().toString(36).substring(2, 10);

        // Use transaction to ensure atomicity
        await db.$transaction(async (tx) => {
            // Double-check availability within transaction
            for (const ticket of validatedTickets) {
                const category = await tx.ticketCategory.findUnique({
                    where: { id: ticket.id },
                    select: { quota: true, sold: true, price: true }
                });

                if (!category) {
                    throw new Error(`Ticket category not found`);
                }

                // Double-check price within transaction
                if (ticket.serverPrice !== category.price) {
                    throw new Error(`Price validation failed for ${ticket.name}`);
                }

                const remainingQuota = category.quota - category.sold;
                if (ticket.quantity > remainingQuota) {
                    throw new Error(`Insufficient tickets available for ${ticket.name}`);
                }
            }

            // Create reservations
            await Promise.all(validatedTickets.map(async (ticket) =>
                await tx.ticketReservation.create({
                    data: {
                        userId: user.id,
                        categoryId: ticket.id,
                        quantity: ticket.quantity,
                        status: "PENDING",
                        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                        orderId
                    }
                })
            ));
        });

        const parameter = {
            "transaction_details": {
                "order_id": orderId,
                "gross_amount": serverTotalAmount, // Use server-calculated amount
            },
            "credit_card": {
                "secure": true
            },
            "item_details": validatedTickets.map(ticket => ({
                "id": ticket.id,
                "name": ticket.name,
                "price": ticket.serverPrice, // Use server-side price
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
            message: error instanceof Error ? error.message : "Failed to create token",
        }
    }

}