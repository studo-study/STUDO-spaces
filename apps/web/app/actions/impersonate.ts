"use server";

import { auth } from "@/auth";

/**
 * Vraagt de backend om een impersonatie-token voor `userId`. Enkel admins.
 * De admin-token wordt nooit naar de client gestuurd; de backend verifieert
 * de rol nog eens en mint een kortlevende token. Geeft dat token terug zodat
 * de client de sessie kan swappen via `useImpersonation().start`.
 */
export async function startImpersonation(userId: string): Promise<string> {
  const session = await auth();

  if (session?.user?.publicRole === "user") {
    throw new Error("Forbidden");
  }

  const res = await fetch(`${process.env.AUTH_API_URL}/sessions/impersonate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("Impersonation failed", res.status, body);
    throw new Error(`Impersonation request failed (${res.status}): ${body}`);
  }

  const { token } = (await res.json()) as { token: string };
  return token;
}
