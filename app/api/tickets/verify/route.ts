import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyQRCodeTicket } from "@/dal/organizer/verify-qr-code-ticket";
import { requireUser } from "@/dal/user/require-user";

export async function PATCH(req: Request) {
    const user = await requireUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin" && user.role !== "organizer") {
        return NextResponse.json({ error: "User is not authorized" }, { status: 403 });
    }

    try {
        const { ticketId } = await req.json();

        if (!ticketId) {
            return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });
        }

        const existing = await db.ticket.findUnique({ where: { id: ticketId } });

        if (!existing) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        if (existing.isUsed) {
            return NextResponse.json({ error: "Ticket already verified" }, { status: 400 });
        }

        const updated = await db.ticket.update({
            where: { id: ticketId },
            data: { isUsed: true, usedAt: new Date() }
        });

        return NextResponse.json({ success: true, ticket: updated });
    } catch (error) {
        console.error("PATCH /verify error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const user = await requireUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin" && user.role !== "organizer") {
        return NextResponse.json({ error: "User is not authorized" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const qr = searchParams.get("qr");

        if (!qr) {
            return NextResponse.json({ error: "QR code missing" }, { status: 400 });
        }

        const ticket = await verifyQRCodeTicket(qr, user.id);

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        if (ticket.isUsed) {
            return NextResponse.json({ error: "Ticket has already been used" }, { status: 400 });
        }

        if (ticket.reservation?.status !== "PAID") {
            return NextResponse.json({ error: "Ticket is not valid (unpaid or expired)" }, { status: 400 });
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("GET /verify error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
