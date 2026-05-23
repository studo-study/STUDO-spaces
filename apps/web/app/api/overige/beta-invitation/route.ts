import { Resend } from "resend";
import { readFile } from "fs/promises";
import { join } from "path";

const subjects = {
  nl: "Je bent uitgenodigd voor de publieke beta! 🎉",
  fr: "Tu es sur la liste d'attente STUDO ! 🎉",
  en: "You're on the STUDO waitinglist! 🎉",
} as const;

type Locale = keyof typeof subjects;

const resend = new Resend(process.env.RESEND_API_KEY);
const templateCache = new Map<Locale, string>();

async function getTemplate(locale: Locale) {
  const cached = templateCache.get(locale);
  if (cached) return cached;
  const html = await readFile(
    join(process.cwd(), "app/api/overige/beta-invitation", `${locale}.html`),
    "utf-8",
  );
  templateCache.set(locale, html);
  return html;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email, locale = "nl" } = await request.json();

    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!(locale in subjects)) {
      return Response.json({ error: "Invalid locale" }, { status: 400 });
    }

    const html = await getTemplate(locale as Locale);

    const { data, error } = await resend.emails.send({
      from: "STUDO <noreply@studo.study>",
      to: email,
      subject: subjects[locale as Locale],
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "Failed to send" }, { status: 502 });
    }

    return Response.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Invite route error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
