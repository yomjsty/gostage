import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        BETTER_AUTH_SECRET: z.string().min(1),
        BETTER_AUTH_URL: z.string().url(),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
        UPLOADTHING_TOKEN: z.string().min(1),
        MIDTRANS_MERCHANT_ID: z.string().min(1),
        MIDTRANS_SERVER_KEY: z.string().min(1),
        // RESEND_API_KEY: z.string().min(1),
        // STRIPE_SECRET_KEY: z.string().min(1),
        // STRIPE_WEBHOOK_SECRET: z.string().min(1),
    },

    client: {
        NEXT_PUBLIC_UPLOADTHING_APP_ID: z.string().min(1),
        NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: z.string().min(1),
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_UPLOADTHING_APP_ID: process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID,
        NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    }
});