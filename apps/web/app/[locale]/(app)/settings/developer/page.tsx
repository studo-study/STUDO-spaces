"use client";
import DevOptions from "@/components/ui/app/private/settings/developer/DevOptions";
import { useSettings } from "@/hooks/app/settings/useSettings";
import { useUpdateSettings } from "@/hooks/app/settings/useUpdateSettings";

export default function DeveloperSettingsPage() {
  const settings = useSettings()?.data;
  const { mutate } = useUpdateSettings();
  return <DevOptions settings={settings} mutate={mutate} />;
}
