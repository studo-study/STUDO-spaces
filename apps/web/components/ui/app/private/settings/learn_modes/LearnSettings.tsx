"use client";
import { useTranslations } from "next-intl";
import { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";
import {
  SettingsCard,
  SettingsMenuOption,
} from "@/components/ui/app/private/settings/SettingsCard";
import { useSettingSaver } from "@/hooks/app/settings/useSettingSaver";

export default function LearnSettings(props: SettingsSection) {
  const { isVisible, settings, mutate } = props;
  const t = useTranslations("settings");
  const save = useSettingSaver(mutate);

  if (isVisible != "app") {
    return;
  }

  const items: SettingsMenuOption[] = [
    {
      label: t("limit_tracking"),
      type: "checkbox",
      value: settings?.limitTracking ?? false,
      onChange: (v) => save({ limitTracking: v }),
    },
    {
      label: t("streak"),
      type: "checkbox",
      value: settings?.showStreak ?? true,
      onChange: (v) => save({ showStreak: v }),
    },
  ];

  return <SettingsCard title={t("learn_settings")} items={items} />;
}
