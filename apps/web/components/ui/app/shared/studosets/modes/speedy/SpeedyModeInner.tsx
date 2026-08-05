"use client";
import type { Card } from "@/types/types";
import type { SessionCardResponse, StudysessionResponse } from "@studo/types";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { IoArrowBackOutline } from "react-icons/io5";
import ProgressBar from "@/components/ui/app/shared/profile/(modes)/learn/progressbar";
import WordTimer from "@/components/ui/app/shared/studosets/modes/speedy/WordTimer";
import SpeedyInput from "@/components/ui/app/shared/studosets/modes/speedy/SpeedyInput";
import StartModal from "@/components/ui/app/shared/studosets/modes/speedy/StartModal";
import { IoIosPause } from "react-icons/io";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import { useTranslations } from "next-intl";
import { SpeedyProvider, useSpeedyContext } from "./SpeedyContext";
import PauseModal from "@/components/ui/app/shared/studosets/modes/speedy/PauseModal";
import SpeedyEndScreen from "@/components/ui/app/shared/studosets/modes/speedy/SpeedyEndScreen";

interface SpeedyModeInnerProps {
  id: string;
  cards: Card[];
  sessionCards: SessionCardResponse[];
  session: StudysessionResponse;
}

function SpeedyModeContent({ id }: { id: string }) {
  const { state, dispatch, gameStarted, startGame, pause, resume } =
    useSpeedyContext();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const t = useTranslations("speedy");
  const Router = useRouter();

  const returnToSet = useCallback(() => {
    Router.push("/studoset/" + id);
  }, [Router, id]);

  const handleStart = () => {
    setIsOpen(false);
    startGame();
  };

  useEffect(() => {
    if (state.phase === "correct") {
      dispatch({ type: "ADVANCE" });
    } else if (state.phase === "incorrect") {
      const timeout = setTimeout(() => {
        dispatch({ type: "ADVANCE" });
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [dispatch, state.phase, state.deckIndex]);

  if (state.phase === "finished") {
    return (
      <div className="w-full h-full flex flex-col gap-5 items-center justify-center">
        <SpeedyEndScreen back={returnToSet} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-5 items-center justify-center">
      <div className="w-2/3 flex flex-col gap-5 items-center justify-center">
        <div className="flex flex-row items-center w-full gap-3">
          <span className="text-xs sm:text-sm whitespace-nowrap opacity-75">
            {t("round")} {state.round}
          </span>
          <ProgressBar
            cardIndex={state.deckIndex}
            cardLength={state.deck.length}
            subtle
          />
          <BaseTooltip content={t("answer_with")}>
            <BaseButton
              variant="icon"
              className="min-h-full"
              onClick={() => dispatch({ type: "TOGGLE_TERM_MODE" })}
            >
              <p className="text-xs sm:text-sm">
                {state.termMode ? t("definition") : t("term")}
              </p>
            </BaseButton>
          </BaseTooltip>
          <BaseTooltip content={t("pause")}>
            <BaseButton onClick={pause} variant="icon" icon={<IoIosPause />} />
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
      {!gameStarted && !isOpen && (
        <PauseModal
          isOpen={!gameStarted}
          setIsOpen={resume}
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
