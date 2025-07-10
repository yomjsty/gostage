import type { MetadataRoute } from 'next'
import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = env.BETTER_AUTH_URL || 'https://gostage.vercel.app';
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/private/',
                '/api/',
                '/dashboard/',
                '/account/',
                '/login',
                '/register',
                '/forgot-password',
                '/reset-password',
                '/my-events/',
                '/scan-qr/',
                '/_next/',
                '/static/',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}