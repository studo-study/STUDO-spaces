import { useTranslations } from "next-intl";
import CurrentPlan from "@/components/ui/app/private/settings/current_plan/CurrentPlan";
import Accessibility from "@/components/ui/app/private/settings/accessibility/Accessibility";
import PersonalInfo from "@/components/ui/app/private/settings/personal_info/PersonalInfo";
import AccountPrivacy from "@/components/ui/app/private/settings/account_privacy/AccountPrivacy";
import { Metadata } from "next";
import LearnSettings from "@/components/ui/app/private/settings/learn_modes/LearnSettings";
import ClassroomSettings from "@/components/ui/app/private/settings/classroom_settings/ClassroomSettings";
import Notifications from "@/components/ui/app/private/settings/notifications/Notifications";
import { Shortcuts } from "@/components/ui/app/private/settings/shortcuts/Shortcuts";
import BottomCredits from "@/components/ui/design_system/bottom_credits/BottomCredits";

export const metadata: Metadata = {
  title: "Settings | Studo",
};

export default function SettingsPage() {
  const t = useTranslations("settings");
  return (
    <>
      <span className={"w-full h-10 font-bold text-3xl"}>{t("title")}:</span>
      <PersonalInfo />
      <Shortcuts />
      <CurrentPlan />
      <Accessibility />
      <Notifications />
      <LearnSettings />
      <ClassroomSettings />
      <AccountPrivacy />
      <BottomCredits />
    </>
  );
}
