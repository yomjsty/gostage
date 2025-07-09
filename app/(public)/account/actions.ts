"use server"

import { requireUser } from "@/dal/user/require-user";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { SetPasswordType } from "@/lib/zodSchema";
import { headers } from "next/headers";

export async function isPasswordSet(userId: string) {
    const hasPassword = await db.account.findFirst({
        where: {
            userId,
            password: {
                not: null
            }
        }
    })

    return {
        success: !!hasPassword,
        message: hasPassword ? "Password is set" : "Password is not set"
    }
}

export async function setPassword(values: SetPasswordType) {
    const user = await requireUser();

    if (!user) {
        return {
            success: false,
            message: "Unauthorized"
        }
    }

    await auth.api.setPassword({
        body: { newPassword: values.password },
        headers: await headers()
    });

    return {
        success: true,
        message: "Password set"
    }
}
