import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SettingsResponse, UpdateSettings } from "@studo/types";
import { api } from "@/lib/api/api";
import { settingsKeys } from "./settingsKeys";

export function useUpdateSettings() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (patch: UpdateSettings) =>
      api<SettingsResponse>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),

    onMutate: async (patch) => {
      // Stop in-flight refetches so they can't clobber our optimistic value.
      await qc.cancelQueries({ queryKey: settingsKeys.all });

      const prev = qc.getQueryData<SettingsResponse>(settingsKeys.all);

      // Toggles should feel instant: merge the patch into the cache immediately.
      qc.setQueryData<SettingsResponse>(settingsKeys.all, (old) =>
        old ? { ...old, ...patch } : old,
      );

      return { prev };
    },

    onError: (_e, _patch, ctx) => {
      // Roll back to the pre-mutation snapshot on failure.
      if (ctx?.prev) qc.setQueryData(settingsKeys.all, ctx.prev);
    },

    onSettled: () => {
      // Reconcile with the server's authoritative value.
      qc.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}
