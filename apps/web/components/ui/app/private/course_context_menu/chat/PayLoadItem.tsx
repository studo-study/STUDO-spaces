"use client";
import { CreditCardIcon, Layers, X } from "lucide-react";
import { Payload } from "@/components/ui/app/private/course_context_menu/chat/ChatInput";
import SimpleMenu from "@studo/ui/design_system/simple_menu/SimpleMenu";
import { useStudoset } from "@/hooks/app/sets/useStudoset";
import { SetStateAction } from "react";
import classNames from "@/utils/classnames";
import BaseTooltip from "@studo/ui/design_system/tooltip/BaseToolTip";

interface SetCardsProps {
  id: string;
  index: number;
  payLoad: Payload;
  setPayload: React.Dispatch<SetStateAction<Payload[]>>;
}
interface Card {
  id: string;
  name: string;
}
const SetCards: React.FC<SetCardsProps> = (props) => {
  const { id, index, payLoad, setPayload } = props;
  const studoset = useStudoset(id).data;
  const addToPayload = (card: Card) => {
    const isSelected = payLoad.cardId === card.id;
    setPayload((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...p,
              cardId: isSelected ? null : card.id,
              cardTitle: isSelected ? null : card.name,
            }
          : p,
      ),
    );
  };

  return (
    <div className={"w-40 h-fit flex flex-col gap-2"}>
      {studoset?.cards.map((card) => (
        <div
          onClick={() =>
            addToPayload({
              id: card.id,
              name: card.term + " " + card.definition,
            })
          }
          key={card.id}
          className={classNames(
            "rounded-full dark:text-white cursor-pointer truncate border bg-studogrey/30 px-2 py-1",
            payLoad.cardId === card.id
              ? "border-studoblue"
              : "border-studoborder/30",
          )}
        >
          {card.term} - {card.definition}
        </div>
      ))}
    </div>
  );
};
interface PayloadItemProps {
  payload: Payload;
  index: number;
  removePayload: (input: number) => void;
  setPayload: React.Dispatch<SetStateAction<Payload[]>>;
}
const PayloadItem: React.FC<PayloadItemProps> = (props) => {
  const { payload, index, removePayload, setPayload } = props;
  const containsCard = payload.cardId;
  return (
    <BaseTooltip
      position="bottom"
      content={containsCard ? "click to remove card" : "click to add card"}
    >
      <SimpleMenu
        side={"top"}
        align={"start"}
        variant={"entity"}
        trigger={
          <div
            className={
              "flex flex-row items-center cursor-pointer gap-1 pl-3 pr-2 py-1 rounded-full border border-studoborder/30 bg-studogrey/30 text-sm dark:text-white"
            }
          >
            <span
              className={
                "truncate max-w-40 text-sm gap-2 flex flex-row items-center"
              }
            >
              {payload.cardTitle ? (
                <CreditCardIcon size={12} />
              ) : (
                <Layers size={12} />
              )}
              {payload.cardTitle
                ? payload.cardTitle
                : (payload.title ?? payload.type)}
            </span>
            <button
              type={"button"}
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                removePayload(index);
              }}
              className={
                "opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              }
            >
              <X size={14} />
            </button>
          </div>
        }
      >
        {payload.type === "set" && (
          <SetCards
            id={payload.id!}
            index={index}
            setPayload={setPayload}
            payLoad={payload}
          />
        )}
      </SimpleMenu>
    </BaseTooltip>
  );
};

PayloadItem.displayName = "PayloadItem";
export default PayloadItem;
