"use client";
import { Card } from "@/types/types";
import type { SessionCardResponse, StudysessionResponse } from "@studo/types";
import { useCallback, useMemo, useReducer, useRef, useState } from "react";
import learnReducer from "@/components/ui/shared/modes/speedy/speedyReducer";
import { useRouter } from "next/navigation";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { IoArrowBackOutline } from "react-icons/io5";
import ProgressBar from "@/components/ui/public/profile/(modes)/learn/progressbar";
import WordTimer from "@/components/ui/shared/modes/speedy/WordTimer";
import SpeedyInput from "@/components/ui/shared/modes/speedy/SpeedyInput";
import StartModal from "@/components/ui/shared/modes/speedy/StartModal";
import { IoIosPause } from "react-icons/io";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import { useTranslations } from "next-intl";

interface SpeedyModeInnerProps {
  id: string;
  cards: Card[];
  sessionCards: SessionCardResponse[];
  session: StudysessionResponse;
}

export default function SpeedyModeInner({
  id,
  cards,
  sessionCards,
  session,
}: SpeedyModeInnerProps) {
  const inputRef = useRef<HTMLInputElement>(null!);
  const startIndex = session.index;
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const t = useTranslations("speedy");

  const initialCounts: Record<string, number> = {};
  sessionCards.forEach((sc) => {
    if (sc.mastered) initialCounts[sc.card_id] = 2;
  });

  const [state] = useReducer(learnReducer, {
    index: startIndex >= cards.length ? 0 : startIndex,
    queue: [],
    queueIndex: 0,
    queueMode: false,
    phase: startIndex >= cards.length ? "showProgress" : "answering",
    termMode: true,
    progressMode: startIndex >= cards.length,
    correctCounts: initialCounts,
  });

  const currentCard = useMemo(() => {
    const safeIndex = state.index < cards.length ? state.index : 0;
    return {
      card: cards[safeIndex],
      sessionCard: sessionCards[safeIndex],
    };
  }, [cards, sessionCards, state.index]);

  const Router = useRouter();
  const returnToSet = useCallback(() => {
    Router.push("/studoset/" + id);
  }, [Router, id]);

  return (
    <div
      className={
        "w-full h-full flex flex-col gap-5 items-center justify-center"
      }
    >
      <div className={"w-full flex"}>
        <BaseButton size="sm" variant="icon" onClick={returnToSet}>
          <IoArrowBackOutline />
        </BaseButton>
      </div>

      <div className={"w-2/3 flex flex-col gap-5 items-center justify-center"}>
        <div className={"flex flex-row items-center w-full gap-3"}>
          <ProgressBar
            cardIndex={state.queueMode ? state.queueIndex : state.index}
            cardLength={cards.length}
            queueMode={state.queueMode}
            queueIndex={state.queueIndex}
            queueLength={state.queue.length}
            subtle
          />
          <BaseTooltip content={t("answer_with")}>
            <BaseButton variant="icon" className={"min-h-full"}>
              <p className="text-xs sm:text-sm">
                {state.termMode ? t("definition") : t("term")}
              </p>
            </BaseButton>
          </BaseTooltip>
          <BaseTooltip content={t("pause")}>
            <BaseButton variant={"icon"} icon={<IoIosPause />} />
          </BaseTooltip>
        </div>
        <WordTimer card={currentCard} />
        <SpeedyInput
          correct={false}
          incorrect={false}
          inputRef={inputRef}
          disabled={false}
          checkInput={function (): void {
            throw new Error("Function not implemented.");
          }}
          termMode={false}
        />
      </div>
      {isOpen && (
        <StartModal isOpen={isOpen} setIsOpen={setIsOpen} back={returnToSet} />
      )}
    </div>
  );
}
