"use server"

import { requireUser } from "@/dal/user/require-user";
import db from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { eventSchema, EventSchemaType, ticketCategorySchema, TicketCategorySchemaType } from "@/lib/zodSchema";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

async function generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 0;
    const maxAttempts = 10;

    while (counter < maxAttempts) {
        const existingEvent = await db.event.findUnique({
            where: { slug }
        });

        if (!existingEvent) {
            return slug;
        }

        const randomId = randomUUID().slice(0, 8);
        slug = `${baseSlug}-${randomId}`;
        counter++;
    }

    const timestamp = Date.now().toString(36);
    return `${baseSlug}-${timestamp}`;
}

export async function updateEvent(values: EventSchemaType, eventId: string): Promise<ApiResponse> {
    const user = await requireUser();

    if (user.role !== "admin" && user.role !== "organizer") {
        return {
            status: "error",
            message: "You are not authorized to create an event",
        }
    }

    try {
        const result = eventSchema.safeParse(values)

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid data"
            }
        }

        const existingEvent = await db.event.findUnique({
            where: {
                id: eventId,
                userId: user.id,
            },
        })

        if (!existingEvent) {
            return {
                status: "error",
                message: "Event not found",
            }
        }

        let slug = existingEvent.slug

        if (existingEvent.title !== result.data.title) {
            const baseSlug = slugify(result.data.title, {
                lower: true,
                remove: /[*+~.()'"!:@]/g,
            })
            slug = await generateUniqueSlug(baseSlug)
        }

        await db.event.update({
            where: { id: eventId, userId: user.id },
            data: {
                ...result.data,
                slug,
            },
        })

        return {
            status: "success",
            message: "Event updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to update event"
        }
    }
}

export async function updateEventStatus(eventId: string, status: "PUBLISHED" | "DRAFT"): Promise<ApiResponse> {
    const user = await requireUser();

    if (user.role !== "admin" && user.role !== "organizer") {
        return {
            status: "error",
            message: "You are not authorized to update event status",
        }
    }

    try {
        const existingEvent = await db.event.findUnique({
            where: {
                id: eventId,
                userId: user.id,
            },
        })

        if (!existingEvent) {
            return {
                status: "error",
                message: "Event not found",
            }
        }

        await db.event.update({
            where: { id: eventId, userId: user.id },
            data: {
                status,
            },
        })

        const action = status === "PUBLISHED" ? "published" : "drafted";

        revalidatePath("/dashboard")

        return {
            status: "success",
            message: `Event ${action} successfully`
        }
    } catch {
        const action = status === "PUBLISHED" ? "publish" : "draft";
        return {
            status: "error",
            message: `Failed to ${action} event`
        }
    }
}

export async function createTicketCategory(values: TicketCategorySchemaType, eventId: string): Promise<ApiResponse> {
    const user = await requireUser();

    if (user.role !== "admin" && user.role !== "organizer") {
        return {
            status: "error",
            message: "You are not authorized to create ticket category",
        }
    }

    try {
        const result = ticketCategorySchema.safeParse(values)

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid data"
            }
        }

        await db.ticketCategory.create({
            data: {
                name: result.data.name,
                price: result.data.price,
                quota: result.data.quota,
                eventId,
            }
        })

        return {
            status: "success",
            message: "Ticket category created successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to create ticket category",
        }
    }
}

export async function updateTicketCategory(values: TicketCategorySchemaType, categoryId: string): Promise<ApiResponse> {
    const user = await requireUser();

    if (user.role !== "admin" && user.role !== "organizer") {
        return {
            status: "error",
            message: "You are not authorized to update ticket category",
        }
    }

    try {
        const result = ticketCategorySchema.safeParse(values)

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid data"
            }
        }

        const existingCategory = await db.ticketCategory.findFirst({
            where: {
                id: categoryId,
                event: {
                    userId: user.id,
                },
            },
            include: {
                event: true,
            },
        })

        if (!existingCategory) {
            return {
                status: "error",
                message: "Ticket category not found",
            }
        }

        await db.ticketCategory.update({
            where: { id: categoryId },
            data: {
                name: result.data.name,
                price: result.data.price,
                quota: result.data.quota,
            }
        })

        return {
            status: "success",
            message: "Ticket category updated successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed to update ticket category",
        }
    }
}

export async function deleteTicketCategory(categoryId: string, eventId: string): Promise<ApiResponse> {
    const user = await requireUser();

    if (user.role !== "admin" && user.role !== "organizer") {
        return {
            status: "error",
            message: "You are not authorized to delete an event",
        }
    }

    try {
        await db.ticketCategory.delete({
            where: { id: categoryId, eventId },
        })

        return {
            status: "success",
            message: "Ticket category deleted successfully",
        }
    } catch {
        return {
            status: "error",
            message: "Failed to delete ticket category",
        }
    }
}