"use client";
import { useEffect, useRef } from "react";
import { useSpeedyContext } from "./SpeedyContext";
import { useTranslations } from "next-intl";

const SpeedyInput = () => {
  const { state, dispatch, currentCard, gameStarted } = useSpeedyContext();
  const inputRef = useRef<HTMLInputElement>(null!);
  const t = useTranslations("speedy");

  useEffect(() => {
    if (state.phase === "answering" && gameStarted) inputRef.current?.focus();
  }, [gameStarted, state.phase, state.deckIndex]);

  const correct = state.phase === "correct";
  const incorrect = state.phase === "incorrect";
  const disabled = state.phase !== "answering";

  const checkInput = () => {
    const card = currentCard.card;
    if (!card) return;
    const input = inputRef.current?.value ?? "";
    const correctAnswer = state.termMode ? card.definition : card.term;
    dispatch({
      type: "SUBMIT_ANSWER",
      input,
      correctAnswer,
      card,
    });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={`bg-gray-300/20 min-h-12 dark:bg-studogrey/20 px-5 flex items-center w-full rounded-3xl h-fit py-2 border ${
        correct
          ? "border-emerald-400"
          : incorrect
            ? "border-rose-400"
            : "border-transparent focus-within:border-gray-300 focus-within:dark:border-studoborder/30"
      }`}
    >
      <input
        ref={inputRef}
        disabled={disabled}
        autoFocus={true}
        onKeyDown={(e) => e.key === "Enter" && !disabled && checkInput()}
        type="text"
        placeholder={state.termMode ? t("type_definition") : t("type_term")}
        className="w-full group h-full outline-none bg-transparent"
      />
    </div>
  );
};

SpeedyInput.displayName = "SpeedyInput";
export default SpeedyInput;
