import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
    const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
        baseURL: request.nextUrl.origin,
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
    });

    const path = request.nextUrl.pathname;

    const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].includes(path);
    const isPublicPage = path === "/" || path.startsWith("/event") || isAuthPage ||
        path === "/about" || path === "/contact" || path === "/faq" ||
        path === "/terms" || path === "/privacy";

    if (!session) {
        // Guest: hanya boleh akses /, /event, /about, /contact, /faq, /terms, /privacy
        if (!isPublicPage) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    } else {
        const role = session.user?.role;

        // Semua role tidak boleh akses halaman auth
        if (isAuthPage) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (role === "user") {
            // User biasa tidak boleh akses /my-events, /scan-qr, /dashboard
            if (
                path.startsWith("/my-events") ||
                path.startsWith("/scan-qr") ||
                path.startsWith("/dashboard")
            ) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }

        if (role === "organizer") {
            // Organizer tidak boleh akses /dashboard
            if (path.startsWith("/dashboard")) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }

        // Admin bisa akses semuanya kecuali halaman auth (sudah dicek di atas)
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api|sitemap.xml|robots.txt).*)"
    ]
};
