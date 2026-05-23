"use client";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import "animate.css";
import { IoShuffleOutline } from "react-icons/io5";
import ProgressBar from "@/components/ui/public/profile/(modes)/learn/progressbar";
import { useKeyboardShortcut } from "@/hooks/overige/useKeyboardShortcut";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import { useTranslations } from "next-intl";
import { GrPowerReset } from "react-icons/gr";
import { useStudoset } from "@/hooks/app/sets/useStudoset";

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
  id: string;
}

const storageKey = (id: string) => `studo-fc-${id}`;

interface PersistedState {
  index: number;
  termMode: boolean;
  shuffleMode: boolean;
  shuffledIds: string[];
}

function loadState(id: string, cards: Card[]): PersistedState {
  if (typeof window === "undefined")
    return { index: 0, termMode: true, shuffleMode: false, shuffledIds: [] };
  try {
    const raw = localStorage.getItem(storageKey(id));
    if (!raw)
      return { index: 0, termMode: true, shuffleMode: false, shuffledIds: [] };
    return JSON.parse(raw) as PersistedState;
  } catch {
    return { index: 0, termMode: true, shuffleMode: false, shuffledIds: [] };
  }
}

export default function FlashcardMode({ id }: FlashcardProps) {
  const cards = useStudoset(id)?.data?.cards || [];
  const t = useTranslations("flashcards");

  const [index, setIndex] = useState(0);
  const [termMode, setTermMode] = useState(true);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [shuffled, setShuffled] = useState<Card[]>([]);

  // Eenmalig initialiseren vanuit localStorage zodra cards geladen zijn
  const initialized = useRef(false);
  useEffect(() => {
    if (cards.length === 0 || initialized.current) return;
    initialized.current = true;

    const saved = loadState(id, cards);
    setTermMode(saved.termMode);
    setShuffleMode(saved.shuffleMode);
    setIndex(saved.index < cards.length ? saved.index : 0);

    if (saved.shuffleMode && saved.shuffledIds.length > 0) {
      const ordered = saved.shuffledIds
        .map((sid) => cards.find((c) => c.id === sid))
        .filter(Boolean) as Card[];
      setShuffled(ordered.length === cards.length ? ordered : cards);
    } else {
      setShuffled(cards);
    }
  }, [id, cards]);

  // Persist naar localStorage — sla over als cards nog niet geladen zijn
  useEffect(() => {
    if (shuffled.length === 0) return;
    const state: PersistedState = {
      index,
      termMode,
      shuffleMode,
      shuffledIds: shuffled.map((c) => c.id),
    };
    localStorage.setItem(storageKey(id), JSON.stringify(state));
  }, [id, index, termMode, shuffleMode, shuffled]);

  const goForward = () => {
    setIndex((i) => (i + 1 > shuffled.length - 1 ? 0 : i + 1));
  };
  const goBack = () => {
    setIndex((i) => (i - 1 < 0 ? shuffled.length - 1 : i - 1));
  };
  const toggleShuffle = () => {
    const newMode = !shuffleMode;
    setShuffleMode(newMode);
    setIndex(0);
    setShuffled(newMode ? shuffle(cards) : cards);
  };

  const toggleReset = () => {
    setIndex(0);
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
          <BaseTooltip content={t("answer_with")}>
            <BaseButton
              variant={"icon"}
              onClick={() => setTermMode((prev) => !prev)}
            >
              <p className={"text-sm"}>
                {termMode ? t("definition") : t("term")}
              </p>
            </BaseButton>
          </BaseTooltip>
          <BaseTooltip content={t("shuffle")}>
            <BaseButton variant={"icon"} onClick={toggleShuffle}>
              <IoShuffleOutline
                size={20}
                className={
                  shuffleMode
                    ? "dark:text-studoblue transition-all duration-300 text-emerald-400"
                    : ""
                }
              />
            </BaseButton>
          </BaseTooltip>
          <BaseTooltip content={t("reset")}>
            <BaseButton variant={"icon"} onClick={toggleReset}>
              <GrPowerReset size={20} />
            </BaseButton>
          </BaseTooltip>
        </div>
        {shuffled[index] ? (
          <Card
            card={shuffled[index]}
            key={shuffled[index].id}
            termMode={termMode}
          />
        ) : null}
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
  termMode: boolean;
}
function Card({ card, termMode }: CardProps) {
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
          {termMode ? (
            <span className={"text-xl text-center select-none font-bold"}>
              {card.term}
            </span>
          ) : (
            <span className="block text-xl text-center text-balance leading-relaxed select-none">
              {card.definition}
            </span>
          )}
        </div>
        <div
          className={
            "side-b backface-hidden top-0 left-0 absolute px-5  w-full cursor-pointer shadow-2xl h-full flex items-center justify-center rounded-3xl border border-studoborder/30 bg-studogrey/30 "
          }
        >
          {termMode ? (
            <span className="block text-xl text-center text-balance leading-relaxed select-none">
              {card.definition}
            </span>
          ) : (
            <span className={"text-xl text-center select-none font-bold"}>
              {card.term}
            </span>
          )}
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
