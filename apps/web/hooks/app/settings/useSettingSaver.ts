"use client";

import { useTranslations } from "next-intl";
import type { UpdateSettings } from "@studo/types";
import { useToast } from "@/components/providers/app/ToastProvider";
import type { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";

/**
 * Wraps the settings mutation with translated toast feedback.
 *
 * Feedback is driven off the mutation's own onSuccess/onError callbacks — not the
 * `isSuccess` flag, which reflects the *previous* mutation and is stale at the
 * moment a toggle fires.
 */
export function useSettingSaver(mutate: SettingsSection["mutate"]) {
  const t = useTranslations("settings");
  const toast = useToast();

  return (patch: UpdateSettings) =>
    mutate(patch, {
      onSuccess: () => toast.success(t("toast_update_success")),
      onError: () => toast.error(t("toast_update_error")),
    });
}
