import InputField from "@/components/ui/design_system/input/InputField";
import { useChats } from "@/hooks/app/chat/useChats";
import { ChatResponse } from "@studo/types/dist/chat";
import { Pin } from "lucide-react";
import { useSideMenu } from "@/store/coursecontextmenu/SideMenuStore";

interface ChatItemProps {
  chat: ChatResponse;
}
const ChatItem: React.FC<ChatItemProps> = (props) => {
  const { chat } = props;
  const menuInfo = useSideMenu((state) => state.setMenuInfo);
  const date = new Date(chat.creationDate);
  return (
    <div
      onClick={() =>
        menuInfo({
          origin: "chat",
          isOpen: true,
          chat_id: chat.id,
        })
      }
      className={
        "w-full h-15 rounded-2xl border border-studoborder/30 flex flex-row items-center cursor-pointer hover:border-studogrey transition-all duration-300 gap px-4 bg-studogrey/30"
      }
    >
      <div className={"flex flex-col gap-1 h-fit dark:text-white"}>
        <div className={"flex flex-row items-center gap-1.5"}>
          {chat.pinned && <Pin size={13} />}
          <span>{chat.title}</span>
        </div>
        <span className={"text-xs text-studogrey"}>
          {date.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
const ChatHistory = () => {
  const chats = useChats()?.data?.chats;
  const pinnedChats = chats?.filter((chat) => chat.pinned);
  const notPinnedChats = chats?.filter((chat) => !chat.pinned);

  return (
    <div className={"w-full h-full flex flex-col p-5"}>
      <div className={"h-10 mb-5"}>
        <InputField
          className={"dark:text-white"}
          variant={"cardInput"}
          placeholder={"search"}
          textarea={false}
        />
      </div>
      {pinnedChats && (
        <div className={"mb-3 flex flex-col gap-3"}>
          <span className={"dark:text-white"}>Pinned</span>
          {pinnedChats?.map((chat) => (
            <ChatItem key={chat.id} chat={chat} />
          ))}
        </div>
      )}
      <div className={"flex flex-col gap-3"}>
        <span className={" dark:text-white"}>Chats</span>
        {notPinnedChats?.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </div>
    </div>
  );
};

ChatHistory.displayName = "ChatHistory";
export default ChatHistory;
