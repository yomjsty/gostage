"use server"

import { requireUser } from "@/dal/user/require-user";
import db from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function toggleFeatured(id: string): Promise<ApiResponse> {
    const user = await requireUser();

    if (user.role !== "admin") {
        return {
            status: "error",
            message: "You are not authorized to toggle featured event status",
        }
    }

    try {
        // First, get the current featured status
        const event = await db.event.findUnique({
            where: { id },
            select: { featured: true }
        });

        if (!event) {
            return {
                status: "error",
                message: "Event not found",
            }
        }

        // Toggle the featured status
        const newFeaturedStatus = !event.featured;

        await db.event.update({
            where: { id },
            data: {
                featured: newFeaturedStatus,
            }
        })

        const action = newFeaturedStatus ? "set as" : "removed from";

        revalidatePath("/dashboard")
        revalidatePath("/")

        return {
            status: "success",
            message: `Event ${action} featured`,
        }
    } catch {
        return {
            status: "error",
            message: "Failed to toggle featured event status",
        }
    }
}