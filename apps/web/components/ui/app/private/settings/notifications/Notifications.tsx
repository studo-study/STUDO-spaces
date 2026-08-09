"use client";

import { useTranslations } from "next-intl";
import { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";
import {
  SettingsCard,
  SettingsMenuOption,
} from "@/components/ui/app/private/settings/SettingsCard";
import { useSettingSaver } from "@/hooks/app/settings/useSettingSaver";

export default function Notifications(props: SettingsSection) {
  const { isVisible, settings, mutate } = props;
  const t = useTranslations("settings");
  const save = useSettingSaver(mutate);

  if (isVisible != "notifications") {
    return;
  }

  const items: SettingsMenuOption[] = [
    {
      label: t("progress_notifications"),
      type: "checkbox",
      value: settings?.progressNotifications ?? true,
      onChange: (v) => save({ progressNotifications: v }),
    },
    {
      label: t("streak_notifications"),
      type: "checkbox",
      value: settings?.streakReminders ?? true,
      onChange: (v) => save({ streakReminders: v }),
    },
    {
      label: t("classroom_notifications"),
      type: "checkbox",
      value: settings?.groupNotifications ?? true,
      onChange: (v) => save({ groupNotifications: v }),
    },
  ];

  return <SettingsCard title={t("notifications")} items={items} />;
}
