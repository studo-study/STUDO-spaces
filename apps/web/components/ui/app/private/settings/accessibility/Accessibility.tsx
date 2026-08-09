"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { AppTheme } from "@studo/types";
import { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";
import {
  SettingsCard,
  SettingsMenuOption,
} from "@/components/ui/app/private/settings/SettingsCard";
import { useSettingSaver } from "@/hooks/app/settings/useSettingSaver";

export default function Accessibility(props: SettingsSection) {
  const { isVisible, settings, mutate } = props;
  const t = useTranslations("settings");
  const save = useSettingSaver(mutate);

  // font_size and language have no backing settings field yet — kept local for now.
  const [fontSize, setFontSize] = useState<string>("auto");
  const [language, setLanguage] = useState<string>("en");

  if (isVisible != "access") {
    return;
  }

  const items: SettingsMenuOption[] = [
    {
      label: t("page_color"),
      type: "select",
      value: settings?.theme ?? "system",
      onChange: (v) => save({ theme: v as AppTheme }),
      options: [
        { value: "system", label: t("system") },
        { value: "dark", label: t("dark") },
        { value: "light", label: t("light") },
      ],
    },
    {
      label: t("font_size"),
      type: "select",
      value: fontSize,
      onChange: (v) => setFontSize(v),
      options: [
        { value: "auto", label: t("auto") },
        { value: "lg", label: t("lg") },
        { value: "xl", label: t("xl") },
        { value: "xxl", label: t("xxl") },
      ],
    },
    {
      label: t("language"),
      type: "select",
      value: language,
      onChange: (v) => setLanguage(v),
      options: [
        { value: "en", label: "English" },
        { value: "nl", label: "Nederlands" },
        { value: "fr", label: "Français" },
      ],
    },
  ];

  return <SettingsCard title={t("accessibility")} items={items} />;
}
