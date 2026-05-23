"use client";
import { useMutation } from "@tanstack/react-query";

export interface InviteBody {
  email: string;
  locale?: "nl" | "fr" | "en";
}

export function useBetaInvite() {
  return useMutation({
    mutationFn: async (body: InviteBody) => {
      const r = await fetch("/api/overige/beta-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const msg = await r.text().catch(() => "");
        throw new Error(msg || "Failed to send invite");
      }
      return r.json();
    },
  });
}
