"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { AppTheme } from "@studo/types";
import { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";
import {
  SettingsCard,
  SettingsMenuOption,
} from "@/components/ui/app/private/settings/SettingsCard";
import { useSettingSaver } from "@/hooks/app/settings/useSettingSaver";
import { Locale, useChangeLocale } from "@/i18n/switcher";
import EnglishFlag from "@/components/ui/overige/icons/flags/English";
import DutchFlag from "@/components/ui/overige/icons/flags/Dutch";
import FrenchFlag from "@/components/ui/overige/icons/flags/French";
import SpanishFlag from "@/components/ui/overige/icons/flags/Spanish";

export default function Accessibility(props: SettingsSection) {
  const { settings, mutate } = props;
  const t = useTranslations("settings");
  const save = useSettingSaver(mutate);

  const local = useLocale();
  // font_size and language have no backing settings field yet — kept local for now.
  const [fontSize, setFontSize] = useState<string>("auto");
  const [language, setLanguage] = useState<string>(local);
  const { changeLocale: switcher } = useChangeLocale(language);

  const toggleLanguage = (lang: string) => {
    setLanguage(lang);
    switcher(lang as Locale);
  };

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
      onChange: (v) => toggleLanguage(v),
      options: [
        { value: "en", label: "English", icon: <EnglishFlag size={13} /> },
        { value: "nl", label: "Nederlands", icon: <DutchFlag size={13} /> },
        { value: "fr", label: "Français", icon: <FrenchFlag size={13} /> },
        { value: "es", label: "Español", icon: <SpanishFlag size={13} /> },
      ],
    },
  ];

  return <SettingsCard title={t("accessibility")} items={items} />;
}
