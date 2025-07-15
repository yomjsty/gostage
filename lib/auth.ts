import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";
import { env } from "./env";
import { admin as adminPlugin } from "better-auth/plugins"
import { sendForgotPasswordEmail } from "@/actions/resend";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    appName: "GoStage",
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    user: {
        additionalFields: {
            phoneNumber: {
                type: "string",
                required: false,
            },
            address: {
                type: "string",
                required: false,
            },
        }
    },
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            await sendForgotPasswordEmail({
                email: user.email,
                url: url,
                subject: "Reset your password",
            });
        },
    },
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID as string,
            clientSecret: env.GITHUB_CLIENT_SECRET as string,
        },
    },
    plugins: [
        adminPlugin({
            defaultRole: "user",
            adminRoles: ["admin"],
        }),
        nextCookies()
    ]
});