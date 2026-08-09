"use client";
import { useTranslations } from "next-intl";
import CheckBox from "@/components/ui/design_system/input/CheckBox";
import { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";
import {
  useReprocessMode,
  useSettings,
} from "@/hooks/app/settings/useSettings";
import { useUpdateSettings } from "@/hooks/app/settings/useUpdateSettings";

const DevOptions = (props: SettingsSection) => {
  const { isVisible } = props;
  const t = useTranslations("settings");

  const settings = useSettings()?.data;
  const { mutate } = useUpdateSettings();
  const devOptions = [
    {
      label: t("dev_mode"),
      toggle: "switch",
      value: settings?.devMode ?? false,
      onchange: (checked: boolean) => mutate({ devMode: checked }),
    },
    {
      label: t("debug_mode"),
      toggle: "switch",
      value: settings?.debugMode ?? false,
      onchange: (checked: boolean) => mutate({ debugMode: checked }),
    },
    {
      label: t("reprocessing_toggle"),
      toggle: "switch",
      value: useReprocessMode() ?? false,
      onchange: (checked: boolean) => mutate({ showReprocessing: checked }),
    },
  ];

  if (isVisible != "dev") {
    return;
  }

  return (
    <div
      className={
        "w-full h-fit flex flex-col rounded-3xl divide-y divide-studoborder/30 border border-studoborder/30"
      }
    >
      {devOptions.map((option, i) => {
        return (
          <div
            key={option.label + i}
            className={
              "w-full py-5 flex flex-row justify-between items-center px-5"
            }
          >
            <span className={"font-bold"}>{option.label}</span>
            <CheckBox checked={option.value} onChange={option.onchange} />
          </div>
        );
      })}
    </div>
  );
};

DevOptions.displayName = "DevOptions";
export default DevOptions;
