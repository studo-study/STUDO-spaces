"use client";

import { useTranslations } from "next-intl";
import { Circle } from "lucide-react";
import type { OnlineStatus } from "@studo/types";
import { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";
import {
  SettingsCard,
  SettingsMenuOption,
} from "@/components/ui/app/private/settings/SettingsCard";
import { useSettingSaver } from "@/hooks/app/settings/useSettingSaver";

export default function AccountPrivacy(props: SettingsSection) {
  const { isVisible, settings, mutate } = props;
  const t = useTranslations("settings");
  const save = useSettingSaver(mutate);

  if (isVisible != "account") {
    return;
  }

  const items: SettingsMenuOption[] = [
    {
      label: t("private_allsets"),
      type: "checkbox",
      value: settings?.allSetsPrivate ?? false,
      onChange: (v) => save({ allSetsPrivate: v }),
    },
    {
      label: t("status"),
      type: "select",
      value: settings?.onlineStatus ?? "active",
      onChange: (v) => save({ onlineStatus: v as OnlineStatus }),
      options: [
        {
          value: "active",
          label: t("active"),
          icon: <Circle size={13} className={"text-emerald-500"} />,
        },
        {
          value: "away",
          label: t("away"),
          icon: <Circle size={13} className={"text-amber-500"} />,
        },
        {
          value: "dnd",
          label: t("dnd"),
          icon: <Circle size={13} className={"text-rose-500"} />,
        },
      ],
    },
    {
      label: t("request_verf"),
      description: t("request_subt"),
      type: "button",
      onClick: () => {},
      btnLabel: t("request"),
    },
    {
      label: t("delete_title"),
      description: t("delete_info"),
      type: "button",
      onClick: () => {},
      btnLabel: t("delete"),
      btnVariant: "danger",
    },
  ];

  return <SettingsCard title={t("account_privacy")} items={items} />;
}
