"use client";
import { useTranslations } from "next-intl";
import { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";
import {
  SettingsCard,
  SettingsMenuOption,
} from "@/components/ui/app/private/settings/SettingsCard";
import { useSettingSaver } from "@/hooks/app/settings/useSettingSaver";

export default function ClassroomSettings(props: SettingsSection) {
  const { isVisible, settings, mutate } = props;
  const t = useTranslations("settings");
  const save = useSettingSaver(mutate);

  if (isVisible != "app") {
    return;
  }

  const items: SettingsMenuOption[] = [
    {
      label: t("share_progress"),
      type: "checkbox",
      value: settings?.shareGroupProgress ?? true,
      onChange: (v) => save({ shareGroupProgress: v }),
    },
    {
      label: t("classroom_invite"),
      type: "checkbox",
      value: settings?.allowGroupInvites ?? true,
      onChange: (v) => save({ allowGroupInvites: v }),
    },
    {
      label: t("auto_participate"),
      type: "checkbox",
      value: settings?.autoGroupParticipation ?? false,
      onChange: (v) => save({ autoGroupParticipation: v }),
    },
    {
      label: t("experimental"),
      type: "checkbox",
      value: settings?.experimentalGroupFeatures ?? false,
      onChange: (v) => save({ experimentalGroupFeatures: v }),
    },
  ];

  return <SettingsCard title={t("class_settings")} items={items} />;
}
