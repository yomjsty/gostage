import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";
import { env } from "./env";
import { admin as adminPlugin } from "better-auth/plugins"

export const auth = betterAuth({
    appName: "GoStage",
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
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
        })
    ]
});