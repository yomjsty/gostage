import { Resend } from 'resend';
import { env } from "@/lib/env";
import { RequestPasswordResetEmail } from "@/components/email-template/RequestPasswordReset";
import { ETicketEmail } from "@/components/email-template/ETicket";

export const resend = new Resend(env.RESEND_API_KEY);

export async function sendForgotPasswordEmail({ email, url, subject }: { email: string, url: string, subject: string }) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'GoStage <do-not-reply@email.captomatic.pro>',
            to: [email],
            subject: subject,
            react: RequestPasswordResetEmail({ email, url }),
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}

export async function sendETicketEmail(
    {
        email, eventTitle, eventDate, location, organizer, quantity, orderId, totalAmount, qrCodes
    }:
        {
            email: string, eventTitle: string, eventDate: string, location: string, organizer: string, quantity: number, orderId: string, totalAmount: number, qrCodes: { ticketId: string; category: string; qrBase64: string }[]
        }
) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'GoStage <do-not-reply@email.captomatic.pro>',
            to: [email],
            subject: `Your e-ticket is ready for ${eventTitle}! Event details and QR code inside.`,
            react: ETicketEmail({ eventTitle, eventDate, location, organizer, quantity, orderId, totalAmount, qrCodes })
        })

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}