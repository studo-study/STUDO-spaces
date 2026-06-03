"use client";
import { useEffect, useRef } from "react";
import { useSpeedyContext } from "./SpeedyContext";

const SpeedyInput = () => {
  const { state, dispatch, currentCard, cards, gameStarted } =
    useSpeedyContext();
  const inputRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (state.phase === "answering" || gameStarted) inputRef.current?.focus();
  }, [gameStarted, state.phase]);

  useEffect(() => {
    if (!state.wrongAttempt) return;
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.focus();
    const t = setTimeout(() => dispatch({ type: "RESET_WRONG_ATTEMPT" }), 300);
    return () => clearTimeout(t);
  }, [state.wrongAttempt, dispatch]);

  const correct = state.phase === "correct";
  const incorrect = state.phase === "incorrect";
  const disabled = state.phase !== "answering";

  const checkInput = () => {
    const input = inputRef.current?.value ?? "";
    const correctAnswer = state.termMode
      ? currentCard.card.definition
      : currentCard.card.term;
    dispatch({
      type: "SUBMIT_ANSWER",
      input,
      correctAnswer,
      card: currentCard.card,
      cards,
    });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={`bg-gray-300/20 min-h-12 dark:bg-studogrey/20 px-5 flex items-center w-full rounded-3xl h-fit py-2 border ${
        correct
          ? "border-emerald-400"
          : incorrect || state.wrongAttempt
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
        placeholder={state.termMode ? "typ definitie" : "typ term"}
        className="w-full group h-full outline-none"
      />
    </div>
  );
};

SpeedyInput.displayName = "SpeedyInput";
export default SpeedyInput;
