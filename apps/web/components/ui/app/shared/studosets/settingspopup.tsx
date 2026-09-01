"use client";
import SimpleMenu from "@studo/ui/design_system/simple_menu/SimpleMenu";
import { useTranslations } from "next-intl";
import { useDeleteStudoset } from "@/hooks/app/sets/useDeleteStudoset";
import { useRouter } from "@/i18n/routing";
import { useUpdateStudyset } from "@/hooks/app/sets/useUpdateStudoset";
import { useResetSession } from "@/hooks/app/session/useResetSession";
import { useToast } from "@/components/providers/app/ToastProvider";
import { Cog } from "lucide-react";
import ToggleField from "@studo/ui/design_system/input/ToggleField";

interface SettingsPopupProps {
  isOwner: boolean;
  id: string;
  isPrivateSet: boolean;
  sessionId?: string;
}
export default function SettingsPopup({
  isOwner,
  id,
  isPrivateSet,
  sessionId,
}: SettingsPopupProps) {
  const t = useTranslations("popup.settings");
  const { mutate: deleteSet } = useDeleteStudoset();
  const mutation = useUpdateStudyset(id);
  const { mutate: resetSession, isPending: isResetting } = useResetSession(
    sessionId ?? "",
    id,
  );
  const Router = useRouter();
  const toast = useToast();
  const toggleDelete = () => {
    deleteSet(id);
    Router.push("/home");
  };

  const toggleResetProgress = () => {
    if (!sessionId) return;
    resetSession(undefined, {
      onSuccess: () => toast.success(t("reset_success")),
      onError: () => toast.error(t("submit_error")),
    });
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
                    rounded-full bg-studogrey/30 border border-neutral-200/30 shadow-2x
                    dark:text-white"
        >
          <Cog size={18} />
        </div>
      }
    >
      <div className={"w-full h-full flex group flex-col gap-1 pt-1"}>
        <span className={"font-bold"}>{t("pop_title")}:</span>
        <div className={"w-full flex flex-col gap-3"}>
          {isOwner && (
            <div className={"flex justify-between items-center"}>
              <span>{t("make_private")}</span>
              <ToggleField checked={isPrivateSet} onChange={togglePrivate} />
            </div>
          )}
          <button
            type={"button"}
            onClick={toggleResetProgress}
            disabled={!sessionId || isResetting}
            className={
              "flex-1 w-full min-w-full items-center border-2 font-bold border-rose-600/50 hover:text-rose-600 hover:border-rose-600 text-rose-600/50 cursor-pointer transition-all active:scale-95 duration-300 min-h-10 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
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
