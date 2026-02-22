import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

const subjects: Record<string, string> = {
    nl: 'Je staat op de STUDO waitinglist! 🎉',
    fr: 'Tu es sur la liste d\'attente STUDO ! 🎉',
    en: 'You\'re on the STUDO waitinglist! 🎉',
};

export async function POST(request: Request) {
    const { email, locale } = await request.json();
    console.log(`${email} - ${locale}`);
    const safeLocale = ['nl', 'fr', 'en'].includes(locale) ? locale : 'en';

    const html = readFileSync(
        join(process.cwd(), `app/api/send-waitinglist-mail/${safeLocale}.html`),
        'utf-8'
    );

    await resend.emails.send({
        from: 'STUDO <noreply@studo.study>',
        to: email,
        subject: subjects[safeLocale],
        html,
    });

    return Response.json({ success: true });
}