import db from "@/lib/db";
import { env } from "@/lib/env";
import { MetadataRoute } from "next";

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = env.BETTER_AUTH_URL || 'https://gostage.vercel.app';

    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
    ];

    const events = await getEvents();
    const eventRoutes = events.map((event) => ({
        url: `${baseUrl}/event/${event.slug}`,
        lastModified: event.updatedAt.toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        images: [`https://${env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/${event.featuredImage}`],
    }));

    return [...staticRoutes, ...eventRoutes];
}

async function getEvents() {
    const events = await db.event.findMany({
        where: {
            status: "PUBLISHED",
        },
        select: {
            featuredImage: true,
            slug: true,
            updatedAt: true,
        }
    });
    return events;
}

