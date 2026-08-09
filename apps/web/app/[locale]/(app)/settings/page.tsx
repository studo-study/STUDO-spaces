"use client";
import { useTranslations } from "next-intl";
import CurrentPlan from "@/components/ui/app/private/settings/current_plan/CurrentPlan";
import Accessibility from "@/components/ui/app/private/settings/accessibility/Accessibility";
import PersonalInfo from "@/components/ui/app/private/settings/personal_info/PersonalInfo";
import AccountPrivacy from "@/components/ui/app/private/settings/account_privacy/AccountPrivacy";
import LearnSettings from "@/components/ui/app/private/settings/learn_modes/LearnSettings";
import ClassroomSettings from "@/components/ui/app/private/settings/classroom_settings/ClassroomSettings";
import Notifications from "@/components/ui/app/private/settings/notifications/Notifications";
import { Shortcuts } from "@/components/ui/app/private/settings/shortcuts/Shortcuts";
import BottomCredits from "@/components/ui/design_system/bottom_credits/BottomCredits";
import DevOptions from "@/components/ui/app/private/settings/developer/DevOptions";
import { Tabs } from "@/components/ui/design_system/tabs/Tabs";
import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  Bug,
  PersonStanding,
  SlidersHorizontal,
  UserRoundCog,
} from "lucide-react";
import { useSettings } from "@/hooks/app/settings/useSettings";
import { useUpdateSettings } from "@/hooks/app/settings/useUpdateSettings";
export default function SettingsPage() {
  const t = useTranslations("settings");
  const [tab, setTab] = useState("account");
  const settings = useSettings()?.data;
  const { mutate, isSuccess } = useUpdateSettings();
  return (
    <>
      <span className={"w-full h-fit font-bold text-3xl gap-10"}>
        {t("title")}:
      </span>
      <div className={"w-full flex-row flex mb-5"}>
        <Tabs
          value={tab}
          onChange={(tab) => setTab(tab)}
          tabs={[
            {
              key: "account",
              label: t("account"),
              icon: <UserRoundCog size={15} />,
            },
            {
              key: "app",
              label: t("app"),
              icon: <SlidersHorizontal size={15} />,
            },
            {
              key: "access",
              label: t("access"),
              icon: <PersonStanding size={15} />,
            },
            {
              key: "notifications",
              label: t("notifications"),
              icon: <Bell size={15} />,
            },
            {
              key: "select",
              label: t("select"),
              icon: <BadgeCheck size={15} />,
            },
            {
              key: "dev",
              label: t("developer"),
              icon: <Bug size={15} />,
            },
          ]}
        />
      </div>
      <div className={"flex flex-col gap-20 min-w-0 flex-1 min-h-0 w-full"}>
        <PersonalInfo
          isVisible={tab}
          settings={settings}
          mutate={mutate}
          isSuccess={isSuccess}
        />
        <DevOptions
          isVisible={tab}
          settings={settings}
          mutate={mutate}
          isSuccess={isSuccess}
        />
        <Shortcuts
          isVisible={tab}
          settings={settings}
          mutate={mutate}
          isSuccess={isSuccess}
        />
        <CurrentPlan
          isVisible={tab}
          settings={settings}
          mutate={mutate}
          isSuccess={isSuccess}
        />
        <Accessibility
          isVisible={tab}
          settings={settings}
          mutate={mutate}
          isSuccess={isSuccess}
        />
        <Notifications
          isVisible={tab}
          settings={settings}
          mutate={mutate}
          isSuccess={isSuccess}
        />
        <LearnSettings
          isVisible={tab}
          settings={settings}
          mutate={mutate}
          isSuccess={isSuccess}
        />
        <ClassroomSettings
          isVisible={tab}
          settings={settings}
          mutate={mutate}
          isSuccess={isSuccess}
        />
        <AccountPrivacy
          isVisible={tab}
          settings={settings}
          mutate={mutate}
          isSuccess={isSuccess}
        />
        <BottomCredits />
      </div>
    </>
  );
}
