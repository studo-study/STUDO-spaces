import SimpleMenu from "@/components/ui/design_system/simple_menu/SimpleMenu";
import { IoIosSettings } from "react-icons/io";
import { useTranslations } from "next-intl";

const SETTINGS_OPTIONS = [
  {
    label: "reset_progress",
    type: "button",
    button_label: "reset_prog",
  },
  {
    label: "make_public",
    type: "toggle",
  },
  {
    label: "delete_set",
    type: "button",
    button_label: "delete_set",
  },
];
export default function SettingsPopup() {
  const t = useTranslations("popup.settings");
  return (
    <SimpleMenu
      trigger={
        <div
          className="inline-flex  cursor-pointer active:scale-95 transition-[scale] duration-300 flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
                    font-atrament font-normal text-[#2a3a42] justify-center text-xl
                    rounded-full bg-studogrey/30 border border-studoborder/30 shadow-2x
                    dark:text-white"
        >
          <IoIosSettings />
        </div>
      }
    >
      <div className={"w-full h-full flex group flex-col gap-1 pt-1"}>
        <span className={"font-bold"}>{t("pop_title")}:</span>
        <div
          className={"border-0.5 rounded h-1 border-studoborder/30 w-full"}
        />
        {SETTINGS_OPTIONS.map((option, key) => (
          <span key={key}>{option.label}</span>
        ))}
      </div>
    </SimpleMenu>
  );
}
