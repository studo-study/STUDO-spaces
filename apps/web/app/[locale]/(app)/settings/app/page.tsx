"use client";
import LearnSettings from "@/components/ui/app/private/settings/learn_modes/LearnSettings";
import ClassroomSettings from "@/components/ui/app/private/settings/classroom_settings/ClassroomSettings";
import { useSettings } from "@/hooks/app/settings/useSettings";
import { useUpdateSettings } from "@/hooks/app/settings/useUpdateSettings";

export default function AppSettingsPage() {
  const settings = useSettings()?.data;
  const { mutate } = useUpdateSettings();
  return (
    <>
      <LearnSettings settings={settings} mutate={mutate} />
      <ClassroomSettings settings={settings} mutate={mutate} />
    </>
  );
}
