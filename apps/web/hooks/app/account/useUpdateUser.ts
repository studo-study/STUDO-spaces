import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import type { StudoUser, UpdateUserRequest } from "@/types/types";
import { api, ApiError } from "@/lib/api/api";
import { useToast } from "@/components/providers/app/ToastProvider";

// Persoonlijke velden die de gebruiker zelf mag aanpassen in de settings.
export type UpdateUser = UpdateUserRequest;

// Leest de conflict-code uit een 409-body. De backend-filter zet de code in
// `details` ('{"message":"...","details":{"code":"..."}}').
function conflictCode(error: unknown): string | null {
  if (!(error instanceof ApiError) || error.status !== 409) return null;
  try {
    const body = JSON.parse(error.message) as { details?: { code?: string } };
    return body.details?.code ?? null;
  } catch {
    return null;
  }
}

/**
 * Muteert de persoonlijke data van de ingelogde gebruiker.
 *
 * `useUser` leest uit de next-auth session (geen react-query cache), dus we
 * werken de session optimistisch bij met `update()` zodat de UI meteen
 * reageert; bij een fout rollen we terug. Feedback loopt via een toast — bij
 * een 409 tonen we een veld-specifieke melding (email / naam al in gebruik).
 */
export function useUpdateUser() {
  const { data: session, update } = useSession();
  const t = useTranslations("settings");
  const toast = useToast();

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

    onSuccess: () => {
      toast.success(t("toast_update_success"));
    },

    onError: (error, _patch, ctx) => {
      // Terug naar de pre-mutatie snapshot.
      if (ctx?.prev) update({ user: ctx.prev });

      const code = conflictCode(error);
      const message =
        code === "EMAIL_TAKEN"
          ? t("email_taken")
          : code === "DISPLAY_NAME_TAKEN"
            ? t("name_taken")
            : t("toast_update_error");
      toast.error(message);
    },
  });
}
