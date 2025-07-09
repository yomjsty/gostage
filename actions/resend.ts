import { Resend } from 'resend';
import { env } from "@/lib/env";
import { RequestPasswordResetEmail } from "@/components/email-template/RequestPasswordReset";

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