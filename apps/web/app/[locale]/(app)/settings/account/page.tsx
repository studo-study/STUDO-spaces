"use client";
import PersonalInfo from "@/components/ui/app/private/settings/personal_info/PersonalInfo";
import AccountPrivacy from "@/components/ui/app/private/settings/account_privacy/AccountPrivacy";
import { useSettings } from "@/hooks/app/settings/useSettings";
import { useUpdateSettings } from "@/hooks/app/settings/useUpdateSettings";

export default function AccountSettingsPage() {
  const settings = useSettings()?.data;
  const { mutate } = useUpdateSettings();
  return (
    <>
      <PersonalInfo />
      <AccountPrivacy settings={settings} mutate={mutate} />
    </>
  );
}
