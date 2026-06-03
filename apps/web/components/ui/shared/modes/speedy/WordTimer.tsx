"use client";
import { useEffect, useRef } from "react";
import { useSpeedyContext } from "./SpeedyContext";

const CIRCUMFERENCE = 2 * Math.PI * 90;

const WordTimer = () => {
  const { state, dispatch, currentCard, cards, gameStarted } =
    useSpeedyContext();
  const progressRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (state.phase !== "answering" || !gameStarted) return;
    if (!progressRef.current) return;

    const length = state.termMode
      ? currentCard.card.term.length
      : currentCard.card.definition.length;
    const duration = length * 1000 + 5000;

    const animation = progressRef.current.animate(
      [{ strokeDashoffset: 0 }, { strokeDashoffset: CIRCUMFERENCE }],
      { duration, fill: "forwards", easing: "linear" },
    );

    animation.onfinish = () => {
      const correctAnswer = state.termMode
        ? currentCard.card.definition
        : currentCard.card.term;
      dispatch({
        type: "SUBMIT_ANSWER",
        input: "",
        correctAnswer,
        card: currentCard.card,
        cards,
      });
    };

    return () => animation.cancel();
  }, [currentCard, state.termMode, state.phase, gameStarted, dispatch, cards]);

  return (
    <div className="relative flex items-center justify-center w-full h-fit">
      <span className="absolute text-lg font-bold z-10">
        {currentCard.card.term}
      </span>
      <svg
        viewBox="0 0 200 200"
        className="w-150 h-150"
        style={{ transform: "rotate(-90deg)" }}
      >
        <defs>
          <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#abd7c1" />
            <stop offset="100%" stopColor="#98c0cd" />
          </linearGradient>
        </defs>
        <path
          d="M 100 10 A 90 90 0 0 1 190 100 A 90 90 0 0 1 100 190 A 90 90 0 0 1 10 100 A 90 90 0 0 1 100 10"
          fill="none"
          className="stroke-studogrey/30"
          strokeWidth="3"
        />
        <path
          ref={progressRef}
          d="M 100 10 A 90 90 0 0 1 190 100 A 90 90 0 0 1 100 190 A 90 90 0 0 1 10 100 A 90 90 0 0 1 100 10"
          fill="none"
          strokeWidth="3"
          className={`${state.wrongAttempt ? "stroke-rose-400" : "stroke-emerald-500"} rounded-3xl`}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={0}
        />
      </svg>
    </div>
  );
};

WordTimer.displayName = "WordTimer";
export default WordTimer;
