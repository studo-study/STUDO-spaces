import ChatInput from "@/components/ui/app/private/course_context_menu/chat/ChatInput";
import ChatCanvas from "./ChatCanvas";
import { useSideMenu } from "@/components/ui/app/private/course_context_menu/store/CourseStore";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { History, X, Plus, MessagesSquare } from "lucide-react";
import BaseToolTip from "@/components/ui/design_system/tooltip/BaseToolTip";
import { useState } from "react";
import ChatHistory from "@/components/ui/app/private/course_context_menu/chat/ChatHistory";
import { useTranslations } from "next-intl";

type Tab = "chat" | "history" | "options";
const SvenChat = () => {
  const t = useTranslations("svenchat");
  const setMenuInfo = useSideMenu((state) => state.setMenuInfo);
  const [tab, setTab] = useState<Tab>("chat");
  return (
    <div className={"min-h-0 w-full flex flex-col flex-1"}>
      <div
        className={
          "w-full pt-4 px-4 min-w-full relative flex flex-row items-center justify-center"
        }
      >
        <div
          className={"absolute left-4 top-4 flex flex-row gap-1 items-center"}
        >
          <BaseToolTip
            content={tab === "chat" ? "History" : "Chat"}
            position={"bottom"}
          >
            <BaseButton
              size={"xs"}
              variant={"ghost"}
              shape="circle"
              onClick={() =>
                setTab((prev) => (prev === "chat" ? "history" : "chat"))
              }
              icon={
                tab === "history" ? (
                  <MessagesSquare size={15} />
                ) : (
                  <History size={15} />
                )
              }
            />
          </BaseToolTip>
          <BaseToolTip content={"New Chat"} position={"bottom"}>
            <BaseButton
              size={"xs"}
              variant={"ghost"}
              shape="circle"
              icon={<Plus size={15} />}
            />
          </BaseToolTip>
        </div>
        <span
          className={
            "h-8 flex items-center justify-center text-sm font-semibold dark:text-white"
          }
        >
          {tab === "chat" ? t("new-chat") : t("history")}
        </span>
        <div className={"absolute right-4 top-4"}>
          <BaseToolTip content={"Close"} position={"bottom"}>
            <BaseButton
              onClick={() => setMenuInfo({ isOpen: false, origin: null })}
              size={"xs"}
              variant={"ghost"}
              shape="circle"
              icon={<X size={15} />}
            />
          </BaseToolTip>
        </div>
      </div>
      <div
        className={
          "min-h-0 flex-1 w-full flex flex-col items-center justify-end"
        }
      >
        {tab === "chat" && (
          <>
            <ChatCanvas />
            <ChatInput />
          </>
        )}
        {tab === "history" && <ChatHistory />}
      </div>
    </div>
  );
};

SvenChat.displayName = "SvenChat";
export default SvenChat;
