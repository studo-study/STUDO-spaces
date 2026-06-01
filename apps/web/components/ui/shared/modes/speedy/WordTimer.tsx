"use client";
import { Card } from "@/types/types";
import type { SessionCardResponse } from "@studo/types";

interface WordTimerProps {
  card: {
    card: Card;
    sessionCard: SessionCardResponse;
  };
}

const WordTimer = ({ card }: WordTimerProps) => {
  return (
    <div className="relative flex items-center justify-center w-full h-fit">
      <span className="absolute text-lg font-bold z-10">{card.card.term}</span>
      <svg viewBox="0 0 200 200" className="w-150 h-150">
        <defs>
          <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#abd7c1" />
            <stop offset="100%" stopColor="#98c0cd" />
          </linearGradient>
        </defs>
        <path
          d="M 100 10 A 90 90 0 0 1 190 100 A 90 90 0 0 1 100 190 A 90 90 0 0 1 10 100 A 90 90 0 0 1 100 10"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />
        <path
          d="M 100 10 A 90 90 0 0 1 190 100 A 90 90 0 0 1 100 190 A 90 90 0 0 1 10 100 A 90 90 0 0 1 100 10"
          fill="none"
          stroke="url(#gradientStroke)"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};

WordTimer.displayName = "WordTimer";
export default WordTimer;
