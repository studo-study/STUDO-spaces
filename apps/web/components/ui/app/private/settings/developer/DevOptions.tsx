"use client";
import { useTranslations } from "next-intl";
import CheckBox from "@/components/ui/design_system/input/CheckBox";
import { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";
import { useSettingSaver } from "@/hooks/app/settings/useSettingSaver";

const DevOptions = (props: SettingsSection) => {
  const { isVisible, settings, mutate } = props;
  const t = useTranslations("settings");
  const save = useSettingSaver(mutate);

  if (isVisible != "dev") {
    return;
  }

  const devOptions = [
    {
      label: t("dev_mode"),
      value: settings?.devMode ?? false,
      onChange: (checked: boolean) => save({ devMode: checked }),
    },
    {
      label: t("debug_mode"),
      value: settings?.debugMode ?? false,
      onChange: (checked: boolean) => save({ debugMode: checked }),
    },
    {
      label: t("reprocessing_toggle"),
      value: settings?.showReprocessing ?? false,
      onChange: (checked: boolean) => save({ showReprocessing: checked }),
    },
  ];

  return (
    <div
      className={
        "w-full h-fit flex flex-col rounded-3xl divide-y divide-studoborder/30 border border-studoborder/30"
      }
    >
      {devOptions.map((option, i) => (
        <div
          key={option.label + i}
          className={
            "w-full py-5 flex flex-row justify-between items-center px-5"
          }
        >
          <span className={"font-bold"}>{option.label}</span>
          <CheckBox checked={option.value} onChange={option.onChange} />
        </div>
      ))}
    </div>
  );
};

DevOptions.displayName = "DevOptions";
export default DevOptions;
