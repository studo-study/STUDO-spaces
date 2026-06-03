"use client";
import SimpleMenu from "@/components/ui/design_system/simple_menu/SimpleMenu";
import { IoIosSettings } from "react-icons/io";
import { useTranslations } from "next-intl";
import { useDeleteStudoset } from "@/hooks/app/sets/useDeleteStudoset";
import { useRouter } from "@/i18n/routing";
import CheckboxField from "@/components/ui/design_system/input/CheckBox";
import { useUpdateStudyset } from "@/hooks/app/sets/useUpdateStudoset";
import { useToast } from "@/components/providers/app/ToastProvider";

interface SettingsPopupProps {
  isOwner: boolean;
  id: string;
  isPrivateSet: boolean;
}
export default function SettingsPopup({
  isOwner,
  id,
  isPrivateSet,
}: SettingsPopupProps) {
  const t = useTranslations("popup.settings");
  const { mutate: deleteSet } = useDeleteStudoset();
  const mutation = useUpdateStudyset(id);
  const Router = useRouter();
  const toast = useToast();
  const toggleDelete = () => {
    deleteSet(id);
    Router.push("/home");
  };

  const togglePrivate = async () => {
    const body = {
      public_set: !isPrivateSet,
    };

    try {
      await mutation.mutateAsync(body);
    } catch {
      toast.error(t("submit_error"));
    }
  };

  return (
    <SimpleMenu
      width={"w-60"}
      trigger={
        <div
          className="inline-flex  cursor-pointer active:scale-95 transition-[scale] duration-300 flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
                    font-atrament font-normal text-studodarkblue justify-center text-xl
                    rounded-full bg-studogrey/30 border border-studoborder/30 shadow-2x
                    dark:text-white"
        >
          <IoIosSettings />
        </div>
      }
    >
      <div className={"w-full h-full flex group flex-col gap-1 pt-1"}>
        <span className={"font-bold"}>{t("pop_title")}:</span>
        <div className={"w-full flex flex-col gap-3"}>
          {isOwner && (
            <div className={"flex justify-between items-center"}>
              <span>{t("make_private")}</span>
              <CheckboxField checked={isPrivateSet} onChange={togglePrivate} />
            </div>
          )}
          <button
            type={"button"}
            className={
              "flex-1 w-full min-w-full items-center border-2 font-bold border-rose-600/50 hover:text-rose-600 hover:border-rose-600 text-rose-600/50 cursor-pointer transition-all active:scale-95 duration-300 min-h-10 rounded-lg"
            }
          >
            {t("reset_progress")}
          </button>
          <button
            type={"button"}
            onClick={toggleDelete}
            className={
              "flex-1 w-full min-w-full items-center border-2 font-bold border-rose-500/30 bg-rose-600/20 hover:bg-rose-500/50 cursor-pointer transition-all active:scale-95 duration-300 min-h-10 rounded-lg"
            }
          >
            {t("delete_set")}
          </button>
        </div>
      </div>
    </SimpleMenu>
  );
}
