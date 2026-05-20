"use client";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState, useEffect } from "react";
import "animate.css";
import { IoShuffleOutline } from "react-icons/io5";
import ProgressBar from "@/components/ui/public/profile/(modes)/learn/progressbar";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useFlashcardStore } from "@/store/slices/flashcard/flashcardStore";

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

export default function FlashcardMode({ cards, id }: FlashcardProps) {
  const {
    init,
    goForward,
    goBack,
    setShuffle,
    resetShuffle,
    index,
    shuffledCards,
    front,
  } = useFlashcardStore();
  const [shuffleMode, setShuffleMode] = useState(false);

  // Sync server cards into store (resets only when switching sets)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    init(id, cards);
  }, [id]);

  const toggleShuffle = () => {
    const newMode = !shuffleMode;
    setShuffleMode(newMode);
    if (newMode) setShuffle(shuffle(cards));
    else resetShuffle(cards);
  };

  useKeyboardShortcut("ArrowRight", goForward);
  useKeyboardShortcut("ArrowLeft", goBack);

  return (
    <div className={"relative w-full h-full flex flex-col gap-5 items-center"}>
      <div
        className={"z-10 max-h-120 flex flex-col gap-5 max-w-180 w-full h-full"}
      >
        <ProgressBar
          cardIndex={index}
          cardLength={cards.length}
          queueIndex={0}
          queueLength={0}
          queueMode={false}
        />
        <Card
          card={shuffledCards[index]}
          key={shuffledCards[index]?.id}
          front={front}
        />
      </div>
      <div className={"absolute right-0 flex flex-row gap-3"}>
        <button
          onClick={toggleShuffle}
          className={`w-12 h-12 cursor-pointer transition-all duration-300 border ${shuffleMode ? "dark:border-studoblue border-emerald-400" : "border-studoborder/30"} bg-studogrey/30 rounded-full shadow-3xl flex flex-row items-center justify-center`}
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
      <div
        className={
          "absolute bottom-10 flex flex-row gap-5 left-1/2 -translate-1/2"
        }
      >
        <button
          onClick={goBack}
          className={
            "w-15 h-12 cursor-pointer border border-studoborder/30 bg-studogrey/30 rounded-full shadow-3xl flex flex-row items-center justify-center"
          }
        >
          <IoIosArrowBack />
        </button>
        <div
          className={
            "w-32 h-12 cursor-pointer border border-studoborder/30 bg-studogrey/30 rounded-full flex flex-row items-center justify-center"
          }
        >
          <span className={"w-1/3 text-center"}>{index + 1}</span>|
          <span className={"w-1/3 text-center"}>{cards.length}</span>
        </div>
        <button
          onClick={goForward}
          className={
            "w-15 h-12 cursor-pointer border border-studoborder/30 bg-studogrey/30 rounded-full shadow-3xl flex flex-row items-center justify-center"
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
  front: "term" | "definition";
}

function Card({ card, front }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  useKeyboardShortcut(" ", () => setIsFlipped((f) => !f));

  const frontText = front === "term" ? card?.term : card?.definition;
  const backText = front === "term" ? card?.definition : card?.term;

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
            "side-a backface-hidden top-0 left-0 absolute w-full cursor-pointer shadow-2xl h-full flex items-center justify-center rounded-3xl border border-studoborder/30 bg-studogrey/30"
          }
        >
          <span className={"text-xl select-none font-bold"}>{frontText}</span>
        </div>
        <div
          className={
            "side-b backface-hidden top-0 left-0 absolute w-full cursor-pointer shadow-2xl h-full flex items-center justify-center rounded-3xl border border-studoborder/30 bg-studogrey/30"
          }
        >
          <span className={"text-xl select-none"}>{backText}</span>
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
