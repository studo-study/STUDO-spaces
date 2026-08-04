"use client";
import PopupBackdrop from "@/components/ui/design_system/popup/PopupBackdrop";
import BasePopup from "@/components/ui/design_system/popup/BasePopup";
import { SetStateAction, useRef, useState } from "react";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { SegmentedControls } from "@/components/ui/design_system/segmentedcontrols/SegmentedControls";
import { useStudosetStore } from "@/store/slices/studoset/studosetStore";
import { Card, SessionCard } from "@/types/types";
import classNames from "@/utils/classnames";

interface ListContentProps {
  cards: {
    card: Card;
    session: SessionCard | undefined;
  }[];
}
const ListContent: React.FC<ListContentProps> = (props) => {
  const { cards } = props;
  const t = useTranslations("studoset.stats");
  return (
    <div
      className={
        "flex flex-row gap-5 overflow-hidden dark:text-white text-studodarkblue divide-studoborder/30 divide-x"
      }
    >
      <div className={"w-1/2"}>
        <span className={"text-studogrey text-xs font-medium mb-2"}>
          {t("general_title")}:
        </span>
        <div></div>
      </div>
      <div className={"flex flex-col w-1/2"}>
        <span className={"text-studogrey text-xs font-medium mb-2"}>
          {t("cards_title")}:
        </span>
        <div
          className={
            "flex-1 min-w-0 min-h-0 flex flex-col overflow-scroll scroll-hidden gap-3"
          }
        >
          {cards.map((card, index) => (
            <div
              key={card.card.id}
              className={classNames(
                "w-full py-2 text-sm rounded-2xl border border-studoborder/30 hover:border-studoborder ",
                "bg-studogrey/5 transition-colors duration-300 flex items-center justify-between px-5",
              )}
            >
              <div>
                <span>{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
type Tab = "graph" | "list";
const PopUpContent = () => {
  const Cards = useStudosetStore((state) => state.studosetCards);
  const [tab, setTab] = useState<Tab>("graph");
  const t = useTranslations("studoset.stats");
  return (
    <div className={"flex-1 min-h-0 w-full flex flex-col"}>
      <div className={"w-full flex items-center justify-between mb-6"}>
        <span className={"dark:text-white font-georgia font-bold text-xl"}>
          {t("title")}:
        </span>
        <SegmentedControls
          size={"sm"}
          tabs={[
            {
              key: "graph",
              label: t("graph"),
            },
            {
              key: "list",
              label: t("list"),
            },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>
      {tab === "list" && <ListContent cards={Cards} />}
    </div>
  );
};

interface ProgresssPopupProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}
const ProgressPopUp: React.FC<ProgresssPopupProps> = (props) => {
  const { isOpen, setIsOpen } = props;
  const popupRef = useRef<HTMLDivElement>(null);
  return (
    <PopupBackdrop isOpen={isOpen} setIsOpen={setIsOpen}>
      <BasePopup
        popupRef={popupRef}
        isOpen={isOpen}
        className={"min-w-200 max-w-200 max-h-130 w-full flex p-5"}
      >
        <PopUpContent />
      </BasePopup>
    </PopupBackdrop>
  );
};

ProgressPopUp.displayName = "ProgressPopUp";

const ProgressPopUpTrigger = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <button
        type={"button"}
        onClick={() => setIsOpen((prev) => !prev)}
        className={
          "p-1 rounded-full hover:bg-studogrey/30 transition-colors duration-300 cursor-pointer border-transparent border hover:border-studoborder/30"
        }
      >
        <Info size={20} />
      </button>
      <ProgressPopUp isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

ProgressPopUpTrigger.displayName = "ProgressPopUpTrigger";
export default ProgressPopUpTrigger;
