import { useTranslations } from "next-intl";
import { useUser } from "@/components/providers/auth/UserProvider";
import { getSvenWelcomeMsg } from "@/components/ui/app/private/course_context_menu/chat/GetSvenWelcomeMsg";
import SvenIcon from "@/components/ui/overige/icons/SvenLogo";

const ChatCanvas = () => {
  const tTimed = useTranslations("svenchatTimed");
  const t = useTranslations("svenchat");
  const name = useUser().user?.displayName ?? "";
  const welcome = getSvenWelcomeMsg(tTimed, name);

  const hasMessages = false;
  const noMessages = (
    <div className={"flex flex-col w-full h-full items-center justify-center"}>
      <div
        className={
          "flex flex-col dark:text-white gap-1 items-center px-10 text-center"
        }
      >
        <SvenIcon size={50} className={"mb-2"} />
        <p className={"font-georgia font-bold text-xl dark:text-white"}>
          {welcome}
        </p>
        <p className={"text-studogrey text-sm"}>{t("quote")}</p>
      </div>
    </div>
  );
  return (
    <div className={"w-full min-h-0 h-full flex-1"}>
      {hasMessages ? "" : noMessages}
    </div>
  );
};

ChatCanvas.displayName = "ChatCanvas";
export default ChatCanvas;
