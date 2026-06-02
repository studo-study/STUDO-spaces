"use client";
import type { Card } from "@/types/types";
import type { SessionCardResponse, StudysessionResponse } from "@studo/types";
import { useCallback, useEffect, useState } from "react";
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
import { SpeedyProvider, useSpeedyContext } from "./SpeedyContext";
import PauseModal from "@/components/ui/shared/modes/speedy/PauseModal";

interface SpeedyModeInnerProps {
  id: string;
  cards: Card[];
  sessionCards: SessionCardResponse[];
  session: StudysessionResponse;
}

function SpeedyModeContent({ id }: { id: string }) {
  const { state, dispatch, cards, setGameStarted, gameStarted } =
    useSpeedyContext();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleStart = () => {
    setIsOpen(false);
    setGameStarted(true);
  };

  useEffect(() => {
    if (state.phase !== "correct" && state.phase !== "incorrect") return;
    const delay = state.phase === "correct" ? 400 : 600;
    const timeout = setTimeout(() => {
      dispatch({ type: "ADVANCE", cards });
    }, delay);
    return () => clearTimeout(timeout);
  }, [cards, dispatch, state.phase]);
  const t = useTranslations("speedy");
  const Router = useRouter();

  const returnToSet = useCallback(() => {
    Router.push("/studoset/" + id);
  }, [Router, id]);

  return (
    <div className="w-full h-full flex flex-col gap-5 items-center justify-center">
      <div className="w-full flex">
        <BaseButton size="sm" variant="icon" onClick={returnToSet}>
          <IoArrowBackOutline />
        </BaseButton>
      </div>

      <div className="w-2/3 flex flex-col gap-5 items-center justify-center">
        <div className="flex flex-row items-center w-full gap-3">
          <ProgressBar
            cardIndex={state.queueMode ? state.queueIndex : state.index}
            cardLength={cards.length}
            queueMode={state.queueMode}
            queueIndex={state.queueIndex}
            queueLength={state.queue.length}
            subtle
          />
          <BaseTooltip content={t("answer_with")}>
            <BaseButton variant="icon" className="min-h-full">
              <p className="text-xs sm:text-sm">
                {state.termMode ? t("definition") : t("term")}
              </p>
            </BaseButton>
          </BaseTooltip>
          <BaseTooltip content={t("pause")}>
            <BaseButton
              onClick={() => setGameStarted(false)}
              variant="icon"
              icon={<IoIosPause />}
            />
          </BaseTooltip>
        </div>

        <WordTimer />
        <SpeedyInput />
      </div>

      {isOpen && (
        <StartModal
          isOpen={isOpen}
          setIsOpen={handleStart}
          back={returnToSet}
        />
      )}
      {!gameStarted && (
        <PauseModal
          isOpen={!gameStarted}
          setIsOpen={handleStart}
          back={returnToSet}
        />
      )}
    </div>
  );
}

export default function SpeedyModeInner({
  id,
  cards,
  sessionCards,
  session,
}: SpeedyModeInnerProps) {
  return (
    <SpeedyProvider
      cards={cards}
      sessionCards={sessionCards}
      session={session}
      setId={id}
    >
      <SpeedyModeContent id={id} />
    </SpeedyProvider>
  );
}
