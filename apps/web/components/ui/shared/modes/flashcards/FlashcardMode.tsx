"use client";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState, useEffect } from "react";
import "animate.css";
import { IoShuffleOutline } from "react-icons/io5";
import ProgressBar from "@/components/ui/public/profile/(modes)/learn/progressbar";
import { useKeyboardShortcut } from "@/hooks/overige/useKeyboardShortcut";

interface Card {
  id: string;
  term: string;
  definition: string;
  number: number;
  created_at: string;
  updated_at: string;
  set_id: string;
  owner_id: string;
}

interface FlashcardProps {
  cards: Card[];
  id: string;
}

const storageKey = (id: string) => `studo-fc-${id}`;

export default function FlashcardMode({ cards, id }: FlashcardProps) {
  const [shuffled, setShuffled] = useState(cards);
  const [shuffleMode, setShuffleMode] = useState(false);

  const [index, setIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem(storageKey(id));
    if (saved === null) return 0;
    const parsed = Number.parseInt(saved, 10);
    if (Number.isNaN(parsed)) return 0;
    return parsed;
  });

  // Persist index to localStorage on change
  useEffect(() => {
    localStorage.setItem(storageKey(id), String(index));
  }, [id, index]);

  const goForward = () => {
    setIndex((i) => (i + 1 > cards.length - 1 ? 0 : i + 1));
  };
  const goBack = () => {
    setIndex((i) => (i - 1 < 0 ? cards.length - 1 : i - 1));
  };
  const toggleShuffle = () => {
    const newMode = !shuffleMode;
    setShuffleMode(newMode);
    setIndex(0);
    setShuffled(newMode ? shuffle(cards) : cards);
  };

  useKeyboardShortcut("ArrowRight", goForward);
  useKeyboardShortcut("ArrowLeft", goBack);

  return (
    <div className={"relative w-full h-full flex flex-col gap-5 items-center"}>
      <div
        className={"z-10 max-h-120 flex flex-col gap-5 max-w-180 w-full h-full"}
      >
        <div className={"w-full flex flex-row gap-5 items-center"}>
          <ProgressBar
            cardIndex={index}
            cardLength={cards.length}
            queueIndex={0}
            queueLength={0}
            queueMode={false}
          />
          <button
            onClick={toggleShuffle}
            className={`min-w-12 h-12 cursor-pointer transition-all duration-300 border ${shuffleMode ? "dark:border-studoblue border-emerald-400" : "border-studoborder/30"}  bg-studogrey/30 rounded-full shadow-3xl flex flex-row items-center justify-center`}
          >
            <IoShuffleOutline
              className={
                shuffleMode
                  ? "dark:text-studoblue transition-all duration-300 text-emerald-400"
                  : ""
              }
            />
          </button>
        </div>
        <Card card={shuffled[index]} key={shuffled[index]?.id} />
      </div>
      <div
        className={
          "absolute bottom-10 flex flex-row gap-5 left-1/2 -translate-1/2"
        }
      >
        <button
          onClick={goBack}
          className={
            "w-15 h-12 cursor-pointer border border-studoborder/30  bg-studogrey/30 rounded-full shadow-3xl flex flex-row items-center justify-center"
          }
        >
          <IoIosArrowBack />
        </button>
        <div
          className={
            "w-32 h-12 cursor-pointer border border-studoborder/30  bg-studogrey/30 rounded-full flex flex-row items-center justify-center"
          }
        >
          <span className={"w-1/3 text-center"}>{index + 1}</span>|
          <span className={"w-1/3 text-center"}>{cards.length}</span>
        </div>
        <button
          onClick={goForward}
          className={
            "w-15 h-12 cursor-pointer border border-studoborder/30  bg-studogrey/30 rounded-full shadow-3xl flex flex-row items-center justify-center"
          }
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
}

interface CardProps {
  card: Card;
}
function Card({ card }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useKeyboardShortcut(" ", () => setIsFlipped((f) => !f));

  return (
    <div
      className={`animate__fadeInLeft animate__animate w-full h-full card--container ${isFlipped ? "flip" : ""}`}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div
        className={
          "relative transform-3d w-full h-full card--flipper transition-all duration-300"
        }
      >
        <div
          className={
            "side-a backface-hidden top-0 left-0 absolute  w-full cursor-pointer shadow-2xl h-full flex items-center justify-center rounded-3xl border border-studoborder/30 bg-studogrey/30 "
          }
        >
          <span className={"text-xl select-none font-bold"}>{card.term}</span>
        </div>
        <div
          className={
            "side-b backface-hidden top-0 left-0 absolute  w-full cursor-pointer shadow-2xl h-full flex items-center justify-center rounded-3xl border border-studoborder/30 bg-studogrey/30 "
          }
        >
          <span className={"text-xl select-none"}>{card.definition}</span>
        </div>
      </div>
    </div>
  );
}

function shuffle(array: Card[]): Card[] {
  const arr = [...array];
  let currentIndex = arr.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }
  return arr;
}
