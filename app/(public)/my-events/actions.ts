"use server"

import { requireUser } from "@/dal/user/require-user";
import db from "@/lib/db";
import { ApiResponse } from "@/lib/types";

export async function deleteEvent(eventId: string): Promise<ApiResponse> {
    const user = await requireUser();

    if (user.role !== "admin" && user.role !== "organizer") {
        return {
            status: "error",
            message: "You are not authorized to delete an event",
        }
    }

    try {
        await db.event.delete({
            where: { id: eventId, userId: user.id },
        })

        return {
            status: "success",
            message: "Event deleted successfully",
        }
    } catch {
        return {
            status: "error",
            message: "Failed to delete event",
        }
    }
}
