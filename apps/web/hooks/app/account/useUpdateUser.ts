import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { StudoUser, UpdateUserRequest } from "@/types/types";
import { api } from "@/lib/api/api";

// Persoonlijke velden die de gebruiker zelf mag aanpassen in de settings.
export type UpdateUser = UpdateUserRequest;

/**
 * Muteert de persoonlijke data van de ingelogde gebruiker.
 *
 * `useUser` leest uit de next-auth session (geen react-query cache), dus na een
 * succesvolle PATCH sync'en we de session met `update()`. Dat triggert de
 * jwt/session-callback en laat `useUser` de nieuwe waarde tonen. De session
 * wordt al optimistisch bijgewerkt zodat de UI meteen reageert; bij een fout
 * rollen we terug naar de vorige waarde.
 */
export function useUpdateUser() {
  const { data: session, update } = useSession();

  return useMutation({
    mutationFn: (patch: UpdateUser) =>
      api<StudoUser>("/api/users", {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),

    onMutate: async (patch) => {
      const prev = session?.user ?? null;
      // Optimistisch: laat useUser meteen de nieuwe waarde tonen.
      if (prev) await update({ user: { ...prev, ...patch } });
      return { prev };
    },

    onSuccess: (user) => {
      // Reconcile met de autoritatieve waarde van de server.
      update({ user });
    },

    onError: (_e, _patch, ctx) => {
      // Terug naar de pre-mutatie snapshot.
      if (ctx?.prev) update({ user: ctx.prev });
    },
  });
}
