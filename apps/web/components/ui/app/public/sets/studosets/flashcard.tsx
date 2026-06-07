"use client";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState, useEffect, useMemo } from "react";
import "animate.css";
import { IoShuffleOutline } from "react-icons/io5";
import { RxEnterFullScreen } from "react-icons/rx";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import ProgressBar from "@/components/ui/app/public/profile/(modes)/learn/progressbar";
import { TbClick } from "react-icons/tb";
import { useKeyboardShortcut } from "@/hooks/overige/useKeyboardShortcut";
import katex from "katex";
import "katex/dist/katex.min.css";
import "katex/dist/contrib/mhchem.mjs";
import { codeToHtml } from "shiki";

interface Card {
  id: string;
  term: string;
  definition: string;
  number: number;
  created_at: string;
  updated_at: string;
  set_id: string;
  owner_id: string;
  term_content_type: "text" | "latex" | "code";
  code_language: string;
}

interface FlashcardProps {
  cards: Card[];
  id: string;
}

const storageKey = (id: string) => `studo-fc-${id}`;

interface PersistedState {
  index: number;
  termMode: boolean;
  shuffleMode: boolean;
  shuffledIds: string[];
}

function loadState(
  id: string,
  cards: Card[],
): { index: number; shuffleMode: boolean; shuffled: Card[] } {
  if (typeof window === "undefined")
    return { index: 0, shuffleMode: false, shuffled: cards };
  try {
    const raw = localStorage.getItem(storageKey(id));
    if (!raw) return { index: 0, shuffleMode: false, shuffled: cards };
    const saved = JSON.parse(raw) as PersistedState;
    const shuffled =
      saved.shuffleMode && saved.shuffledIds.length > 0
        ? (() => {
            const ordered = saved.shuffledIds
              .map((sid) => cards.find((c) => c.id === sid))
              .filter(Boolean) as Card[];
            return ordered.length === cards.length ? ordered : cards;
          })()
        : cards;
    return {
      index: saved.index < cards.length ? saved.index : 0,
      shuffleMode: saved.shuffleMode,
      shuffled,
    };
  } catch {
    return { index: 0, shuffleMode: false, shuffled: cards };
  }
}

export default function Flashcard({ cards = [], id }: FlashcardProps) {
  const initial = loadState(id, cards);
  const [index, setIndex] = useState(initial.index);
  const [shuffled, setShuffled] = useState(initial.shuffled);
  const [shuffleMode, setShuffleMode] = useState(initial.shuffleMode);

  useEffect(() => {
    if (!shuffled.length) return;
    const persisted: PersistedState = {
      index,
      termMode: true,
      shuffleMode,
      shuffledIds: shuffled.map((c) => c.id),
    };
    localStorage.setItem(storageKey(id), JSON.stringify(persisted));
  }, [id, index, shuffleMode, shuffled]);

  const goForward = () => {
    setIndex((i) => (i + 1 > cards.length - 1 ? 0 : i + 1));
  };
  const goBack = () => {
    setIndex((i) => (i - 1 < 0 ? cards.length - 1 : i - 1));
  };

  useKeyboardShortcut("ArrowRight", goForward);
  useKeyboardShortcut("ArrowLeft", goBack);

  const toggleShuffle = () => {
    const newMode = !shuffleMode;
    setShuffleMode(newMode);
    setIndex(0);
    if (newMode) {
      setShuffled(shuffle(cards));
    } else {
      setShuffled(cards);
    }
  };

  if (!shuffled.length) return null;

  return (
    <div className={"w-full min-h-110 h-130 xl:h-150 max-h-150 flex flex-col"}>
      <ProgressBar
        cardIndex={index}
        cardLength={cards.length}
        queueIndex={0}
        queueLength={0}
        queueMode={false}
        subtle
      />
      <div className={"z-10 w-full h-full py-5"}>
        <Card
          card={shuffled[index]}
          key={shuffled[index]?.id}
          id={id}
          shuffleMode={shuffleMode}
          toggleShuffle={toggleShuffle}
        />
      </div>
      <div
        className={
          "relative z-30 w-full h-15 gap-5 flex flex-row items-center justify-center "
        }
      >
        <div
          className={
            "border border-studoborder/30 flex flex-row bg-studogrey/30 rounded-full"
          }
        >
          <button
            onClick={goBack}
            className={
              "w-15 h-12 cursor-pointer flex flex-row items-center justify-center"
            }
          >
            <IoIosArrowBack />
          </button>
          <div
            className={
              "w-32 h-12 cursor-pointer  flex flex-row items-center justify-center"
            }
          >
            <span className={"w-1/3 text-center"}>{index + 1}</span>|
            <span className={"w-1/3 text-center"}>{cards.length}</span>
          </div>
          <button
            onClick={goForward}
            className={
              "w-15 h-12 cursor-pointer rounded-full shadow-3xl flex flex-row items-center justify-center"
            }
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  card: Card;
  shuffleMode: boolean;
  toggleShuffle: () => void;
  id: string;
}
function Card({ card, shuffleMode, toggleShuffle, id }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const t = useTranslations("card");

  useKeyboardShortcut("ArrowUp", () => {
    setIsFlipped((prev) => !prev);
  });
  useKeyboardShortcut("ArrowDown", () => {
    setIsFlipped((prev) => !prev);
  });

  return (
    <div
      className={`animate__fadeInLeft animate__animate w-full h-full card--container ${isFlipped ? "flip" : ""}`}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div className="relative transform-3d w-full h-full card--flipper transition-all duration-300">
        {/* term kant */}
        <div className="side-a shadow-lg backface-hidden top-0 left-0 absolute w-full cursor-pointer h-full flex items-center justify-center rounded-3xl border hover:border-studoborder transition-all duration-300 border-studoborder/30 bg-linear-45 from-studogrey/30 to to-zinc-200/30 dark:to-zinc-400/20">
          <span className="absolute top-3 left-3 border-studoborder font-bold rounded-3xl px-3 text-sm opacity-50 py-1 bg-studogrey/30 lowercase">
            {t("Term")}
          </span>
          <span className="text-xl select-none font-bold font-georgia">
            {card.term_content_type === "latex" ? (
              <SafeKaTeX value={card.term} fallback={card.term} />
            ) : card.term_content_type === "code" ? (
              <CodeBlock value={card.term} lang={card.code_language} />
            ) : (
              card.term
            )}
          </span>
          <span
            className={
              "absolute bottom-3 left-1/2 -translate-1/2 flex flex-row gap-1 items-center opacity-30"
            }
          >
            <TbClick />
            {t("click_turn")}
          </span>
        </div>

        {/* definitie kant */}
        <div className="side-b  shadow-lg backface-hidden px-10 top-0 left-0 absolute w-full cursor-pointer h-full flex items-center justify-center rounded-3xl border hover:border-studoborder transition-all duration-300 border-studoborder/30 bg-studogrey/30">
          <span className="absolute top-3 left-3 font-bold border-studoborder rounded-3xl px-3 text-sm opacity-50 py-1 bg-studogrey/30 lowercase">
            {t("Definition")}
          </span>
          <span className="block text-xl text-center text-balance leading-relaxed select-none">
            {card.definition}
          </span>

          <span
            className={
              "absolute bottom-3 left-1/2 -translate-1/2 flex flex-row gap-1 items-center opacity-30"
            }
          >
            <TbClick />
            {t("click_flip_back")}
          </span>
        </div>

        {/* knoppen bovenop alles */}
        <div
          className="side-a backface-hidden absolute right-3 top-3 z-20 flex flex-row gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleShuffle();
            }}
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
          <Link
            href={"/flashcards/" + id}
            onClick={(e) => e.stopPropagation()}
            className="w-12 h-12 cursor-pointer border border-studoborder/30 bg-studogrey/30 rounded-full shadow-3xl flex flex-row items-center justify-center"
          >
            <RxEnterFullScreen />
          </Link>
        </div>
        <div
          className="side-b backface-hidden absolute right-3 bottom-3 z-20 flex flex-row gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleShuffle();
            }}
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
          <Link
            href={"/flashcards/" + id}
            onClick={(e) => e.stopPropagation()}
            className="w-12 h-12 cursor-pointer border border-studoborder/30 bg-studogrey/30 rounded-full shadow-3xl flex flex-row items-center justify-center"
          >
            <RxEnterFullScreen />
          </Link>
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

const SafeKaTeX = ({ value }: { value: string; fallback: string }) => {
  const html = useMemo(
    () =>
      katex.renderToString(value, { throwOnError: false, displayMode: false }),
    [value],
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const CodeBlock = ({ value, lang }: { value: string; lang: string }) => {
  const [html, setHtml] = useState("");
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const theme = isDark ? "github-dark" : "github-light";
    codeToHtml(value, { lang, theme })
      .catch(() => codeToHtml(value, { lang: "text", theme }))
      .then(setHtml);
  }, [value, lang]);
  if (!html) return <span className="font-mono text-sm">{value}</span>;
  return (
    <div
      className="text-xl w-full overflow-auto [&>pre]:!bg-transparent [&>pre]:p-0 [&>pre]:font-mono"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
