"use client";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { PaperclipIcon, Send } from "lucide-react";
import { useRef, useState } from "react";
import EntityPickerDropdown from "@/components/ui/app/private/course_context_menu/chat/EntityPickerDropdown";
import PayloadItem from "@/components/ui/app/private/course_context_menu/chat/PayLoadItem";

export type PayploadType = "set" | "course";
export interface Payload {
  id?: string | null;
  courseId?: string | null;
  title?: string | null;
  cardId?: string | null;
  cardTitle?: string | null;
  type: PayploadType;
}
const ChatInput = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ButtonRef = useRef<HTMLButtonElement>(null);
  const [, setMessage] = useState<string>("");
  const [payload, setPayload] = useState<Payload[]>([]);

  const getMessage = () => {
    if (inputRef.current) setMessage(inputRef.current.value);
  };
  const removePayload = (index: number) => {
    setPayload((prev) => prev.filter((_, i) => i !== index));
  };
  const onSubmit = () => {
    if (!inputRef.current) return;
    //send etc
    inputRef.current.value = "";
  };

  return (
    <>
      <div className={"w-full flex-col flex items-center justify-center px-8"}>
        <div
          className={
            "mx-10 rounded-tl-3xl rounded-tr-3xl border border-studoborder/30"
          }
        ></div>
        {payload.length > 0 && (
          <div className={"w-full flex flex-row flex-wrap gap-2 px-2 mb-2"}>
            {payload.map((p, index) => (
              <PayloadItem
                key={p.id}
                payload={p}
                index={index}
                setPayload={setPayload}
                removePayload={removePayload}
              />
            ))}
          </div>
        )}
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            onSubmit();
          }}
          className={
            "relative p-3 gap-2 h-fit flex flex-row w-full bg-studogrey/5 rounded-full border border-studoborder/30 mx-10 mb-10"
          }
        >
          <div
            className={
              "relative w-fit p-0  h-10 flex items-center flex-1 max-w-8"
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
            />
            {isModalOpen && (
              <EntityPickerDropdown
                payLoad={payload}
                setPayload={setPayload}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                containerRef={ButtonRef}
              />
            )}
          </div>

          <input
            placeholder={"Ask Sven anything..."}
            ref={inputRef}
            onChange={getMessage}
            className={"flex flex-1 outline-none dark:text-white"}
          />
          <BaseButton
            size={"xs"}
            type={"submit"}
            variant={"submit"}
            shape={"circle"}
            className={"max-h-9 w-9"}
            icon={<Send size={16} />}
          />
        </form>
      </div>
    </>
  );
};

ChatInput.displayName = "ChatInput";
export default ChatInput;
