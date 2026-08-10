"use client";
import Notifications from "@/components/ui/app/private/settings/notifications/Notifications";
import { useSettings } from "@/hooks/app/settings/useSettings";
import { useUpdateSettings } from "@/hooks/app/settings/useUpdateSettings";

export default function NotificationSettingsPage() {
  const settings = useSettings()?.data;
  const { mutate } = useUpdateSettings();
  return <Notifications settings={settings} mutate={mutate} />;
}
