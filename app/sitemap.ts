export const dynamic = 'force-dynamic';

import db from "@/lib/db";
import { env } from "@/lib/env";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = env.BETTER_AUTH_URL || 'https://gostage.vercel.app';

    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date().toISOString(),
        },
    ];

    const events = await getEvents();
    const eventRoutes = events.map((event) => ({
        url: `${baseUrl}/event/${event.slug}`,
        lastModified: event.updatedAt.toISOString(),
    }));

    return [...staticRoutes, ...eventRoutes];
}

async function getEvents() {
    const events = await db.event.findMany({
        where: {
            status: "PUBLISHED",
        },
        select: {
            slug: true,
            updatedAt: true,
        }
    });
    return events;
}

