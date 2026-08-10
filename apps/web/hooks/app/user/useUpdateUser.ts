import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { StudoUser } from "@/types/types";
import { api, ApiError } from "@/lib/api/api";

// Persoonlijke velden die de gebruiker zelf mag aanpassen in de settings.
export type UpdateUser = Partial<Pick<StudoUser, "displayName" | "email">>;

/**
 * Muteert de persoonlijke data van de ingelogde gebruiker.
 *
 * `useUser` leest uit de next-auth session (geen react-query cache), dus we
 * sync'en de session met `update()`. Dat triggert de jwt/session-callback en
 * laat `useUser` de nieuwe waarde tonen. De session wordt optimistisch
 * bijgewerkt zodat de UI meteen reageert; bij een fout rollen we terug.
 *
 * De backend bewaakt email- én displayName-uniekheid en geeft 409 bij een
 * conflict, met een `code` in de body (`EMAIL_TAKEN` / `DISPLAY_NAME_TAKEN`).
 * `isEmailTaken` en `isDisplayNameTaken` maken dat makkelijk per veld te tonen.
 */
// Leest de conflict-code uit een 409-body ('{"code":"...","message":"..."}').
function conflictCode(error: unknown): string | null {
  if (!(error instanceof ApiError) || error.status !== 409) return null;
  try {
    return (JSON.parse(error.message) as { code?: string }).code ?? null;
  } catch {
    return null;
  }
}

export function useUpdateUser() {
  const { data: session, update } = useSession();

  const mutation = useMutation({
    mutationFn: (patch: UpdateUser) =>
      api<StudoUser>("/api/account", {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),

    onMutate: async (patch) => {
      const prev = session?.user ?? null;
      // Optimistisch de gewijzigde velden mergen zodat useUser meteen klopt.
      if (prev) await update({ user: { ...prev, ...patch } });
      return { prev };
    },

    onError: (_e, _patch, ctx) => {
      // Terug naar de pre-mutatie snapshot (ook bij een 409-conflict).
      if (ctx?.prev) update({ user: ctx.prev });
    },
  });

  const code = conflictCode(mutation.error);

  return {
    ...mutation,
    isEmailTaken: code === "EMAIL_TAKEN",
    isDisplayNameTaken: code === "DISPLAY_NAME_TAKEN",
  };
}
