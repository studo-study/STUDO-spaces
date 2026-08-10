"use client";
import Accessibility from "@/components/ui/app/private/settings/accessibility/Accessibility";
import { Shortcuts } from "@/components/ui/app/private/settings/shortcuts/Shortcuts";
import { useSettings } from "@/hooks/app/settings/useSettings";
import { useUpdateSettings } from "@/hooks/app/settings/useUpdateSettings";

export default function AccessSettingsPage() {
  const settings = useSettings()?.data;
  const { mutate } = useUpdateSettings();
  return (
    <>
      <Accessibility settings={settings} mutate={mutate} />
      <Shortcuts />
    </>
  );
}
