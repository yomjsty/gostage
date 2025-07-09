"use server"

import { requireUser } from "@/dal/user/require-user";
import db from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { eventSchema, EventSchemaType } from "@/lib/zodSchema";
import slugify from "slugify";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

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

export async function createEvent(values: EventSchemaType): Promise<ApiResponse> {
    const user = await requireUser();

    if (user.role !== "admin" && user.role !== "organizer") {
        return {
            status: "error",
            message: "You are not authorized to create an event",
        }
    }

    try {
        const validation = eventSchema.safeParse(values)

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid data"
            }
        }

        const baseSlug = slugify(values.title, {
            lower: true,
            remove: /[*+~.()'"!:@]/g
        });

        const uniqueSlug = await generateUniqueSlug(baseSlug);

        await db.event.create({
            data: {
                title: values.title,
                slug: uniqueSlug,
                description: values.description,
                featuredImage: values.featuredImage,
                startDate: values.startDate,
                endDate: values.endDate,
                location: values.location,
                locationLink: values.locationLink,
                mode: values.mode,
                userId: user.id,
            }
        })

        revalidatePath("/")

        return {
            status: "success",
            message: "Event created successfully",
        }
    } catch {
        return {
            status: "error",
            message: "Failed to create event",
        }
    }
}
