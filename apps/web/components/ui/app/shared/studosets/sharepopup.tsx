"use client";
import SimpleMenu from "@/components/ui/design_system/simple_menu/SimpleMenu";
import { useLocale, useTranslations } from "next-intl";
import { PiExport } from "react-icons/pi";
import { MdCopyAll } from "react-icons/md";
import { useToast } from "@/components/providers/app/ToastProvider";
import { usePathname } from "@/i18n/routing";
import { useStudoset } from "@/hooks/app/sets/useStudoset";

interface SharePopupProps {
  id: string;
}
export default function SharePopup(props: SharePopupProps) {
  const { id } = props;
  const t = useTranslations("popup.share");
  const studoset = useStudoset(id).data;
  const pathname = usePathname();
  const locale = useLocale();
  const buildLink = window.location.origin + "/" + locale + "/" + pathname;
  const toast = useToast();
  const isPrivate = studoset?.publicSet;
  const toggleCopy = () => {
    navigator.clipboard.writeText(buildLink);
    toast.success(t("copy_message"));
  };

  return (
    <SimpleMenu
      trigger={
        <div
          className="inline-flex  cursor-pointer active:scale-95 transition-[scale] duration-300 flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
                    font-atrament font-normal text-studodarkblue justify-center text-xl
                    rounded-full bg-studogrey/30 border border-studoborder/30 shadow-2x
                    dark:text-white"
        >
          <PiExport />
        </div>
      }
    >
      <div className={"w-full h-full flex group flex-col gap-1 pt-1"}>
        <span className={"font-bold"}>{t("pop_title")}:</span>
        {isPrivate && (
          <span className={"text-xs text-studogrey"}>{t("isPrivate")}*</span>
        )}
        <div
          className={"border-0.5 rounded h-1 border-studoborder/30 w-full"}
        />
        <div
          className={
            "w-full h-10 rounded-lg flex p-2 justify-between items-center gap-1 bg-studogrey/20 border border-studoborder/30"
          }
        >
          <input
            type="text"
            className={"w-full h-full flex-1 truncate outline-none"}
            value={buildLink}
            readOnly
          />
          <MdCopyAll
            onClick={toggleCopy}
            className={
              "active:scale-95 transition-all opacity-0 group-hover:opacity-100 duration-300 cursor-pointer"
            }
          />
        </div>
      </div>
    </SimpleMenu>
  );
}
