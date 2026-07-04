"use client";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { PaperclipIcon, Send } from "lucide-react";
import { useRef, useState } from "react";
import EntityPickerDropdown from "@/components/ui/app/private/course_context_menu/chat/EntityPickerDropdown";

const ChatInput = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const ButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <div className={"w-full flex items-center justify-center"}>
        <div
          className={
            "relative p-3 gap-2 h-fit flex flex-row w-full bg-studogrey/5 rounded-full border border-studoborder/30 mx-10 mb-10"
          }
        >
          <BaseButton
            size={"xs"}
            type={"button"}
            variant={"ghost"}
            className={"relative"}
            ref={ButtonRef}
            onClick={() => setIsModalOpen((prev) => !prev)}
            icon={<PaperclipIcon size={16} />}
          >
            {isModalOpen && (
              <EntityPickerDropdown
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                containerRef={ButtonRef}
              />
            )}
          </BaseButton>
          <input
            placeholder={"Ask Sven anything..."}
            className={"flex flex-1 outline-none dark:text-white"}
          />
          <BaseButton
            size={"xs"}
            type={"button"}
            variant={"submit"}
            shape={"circle"}
            className={"max-h-9 w-9"}
            icon={<Send size={16} />}
          />
        </div>
      </div>
    </>
  );
};

ChatInput.displayName = "ChatInput";
export default ChatInput;
