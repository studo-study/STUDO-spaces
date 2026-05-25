"use client";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState, useEffect, useMemo } from "react";
import "animate.css";
import { IoArrowBackOutline, IoShuffleOutline } from "react-icons/io5";
import ProgressBar from "@/components/ui/public/profile/(modes)/learn/progressbar";
import { useKeyboardShortcut } from "@/hooks/overige/useKeyboardShortcut";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import { useTranslations } from "next-intl";
import { GrPowerReset } from "react-icons/gr";
import { useStudoset } from "@/hooks/app/sets/useStudoset";
import { useRouter } from "@/i18n/routing";
import { TbClick } from "react-icons/tb";
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
  id: string;
}

const storageKey = (id: string) => `studo-fc-${id}`;

interface PersistedState {
  index: number;
  termMode: boolean;
  shuffleMode: boolean;
  shuffledIds: string[];
}

function loadState(id: string): PersistedState {
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

interface FCState {
  index: number;
  termMode: boolean;
  shuffleMode: boolean;
  shuffled: Card[];
}

// Outer: wacht op cards, geeft ze door aan inner
export default function FlashcardMode({ id }: FlashcardProps) {
  const data = useStudoset(id)?.data;
  const cards = useMemo<Card[]>(() => data?.cards ?? [], [data]);

  if (cards.length === 0) return null;
  return <FlashcardModeInner id={id} cards={cards} />;
}

// Inner: cards zijn gegarandeerd beschikbaar, lazy initialisers werken hier
function FlashcardModeInner({ id, cards }: { id: string; cards: Card[] }) {
  const t = useTranslations("flashcards");

  const [state, setState] = useState<FCState>(() => {
    const saved = loadState(id);
    const restoredShuffled =
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
      termMode: saved.termMode,
      shuffleMode: saved.shuffleMode,
      shuffled: restoredShuffled,
    };
  });

  // Persist naar localStorage — sla over als cards nog niet geladen zijn
  useEffect(() => {
    if (state.shuffled.length === 0) return;
    const persisted: PersistedState = {
      index: state.index,
      termMode: state.termMode,
      shuffleMode: state.shuffleMode,
      shuffledIds: state.shuffled.map((c) => c.id),
    };
    localStorage.setItem(storageKey(id), JSON.stringify(persisted));
  }, [id, state]);

  const goForward = () =>
    setState((s) => ({
      ...s,
      index: s.index + 1 > s.shuffled.length - 1 ? 0 : s.index + 1,
    }));

  const goBack = () =>
    setState((s) => ({
      ...s,
      index: s.index - 1 < 0 ? s.shuffled.length - 1 : s.index - 1,
    }));

  const toggleShuffle = () =>
    setState((s) => {
      const newMode = !s.shuffleMode;
      return {
        ...s,
        shuffleMode: newMode,
        index: 0,
        shuffled: newMode ? shuffle(cards) : cards,
      };
    });

  const toggleReset = () => setState((s) => ({ ...s, index: 0 }));

  const { index, termMode, shuffleMode, shuffled } = state;
  useKeyboardShortcut("ArrowRight", goForward);
  useKeyboardShortcut("ArrowLeft", goBack);

  const Router = useRouter();
  return (
    <div className="w-full h-full flex flex-col gap-3 sm:gap-5  px-10">
      <div className="w-full flex">
        <BaseButton
          size="sm"
          variant="icon"
          onClick={() => Router.push("/studoset/" + id)}
        >
          <IoArrowBackOutline />
        </BaseButton>
      </div>

      {/* Toolbar */}
      <div className="w-full flex flex-row gap-2 sm:gap-5 items-center">
        <ProgressBar
          cardIndex={index}
          cardLength={cards.length}
          queueIndex={0}
          queueLength={0}
          queueMode={false}
        />
        <BaseTooltip content={t("answer_with")}>
          <BaseButton
            variant="icon"
            onClick={() => setState((s) => ({ ...s, termMode: !s.termMode }))}
          >
            <p className="text-xs sm:text-sm">
              {termMode ? t("definition") : t("term")}
            </p>
          </BaseButton>
        </BaseTooltip>
        <BaseTooltip content={t("shuffle")}>
          <BaseButton variant="icon" onClick={toggleShuffle}>
            <IoShuffleOutline
              size={18}
              className={
                shuffleMode
                  ? "dark:text-studoblue transition-all duration-300 text-emerald-400"
                  : ""
              }
            />
          </BaseButton>
        </BaseTooltip>
        <BaseTooltip content={t("reset")}>
          <BaseButton variant="icon" onClick={toggleReset}>
            <GrPowerReset size={16} />
          </BaseButton>
        </BaseTooltip>
      </div>

      <div className="flex-1 pb-10 min-h-0 max-h-130 h-1/6">
        {shuffled[index] ? (
          <Card
            card={shuffled[index]}
            key={shuffled[index].id}
            termMode={termMode}
          />
        ) : null}
      </div>

      {/* Navigatie — altijd onderaan, in de flow */}
      <div className="flex flex-row gap-3 sm:gap-5 items-center justify-center pb-4 sm:pb-6">
        <div
          className={
            "w-fit flex flex-row gap-3 px-2 items-center border border-studoborder/30 rounded-full shadow-xl bg-studogrey/30 "
          }
        >
          <button
            onClick={goBack}
            className="w-12 h-10 sm:w-15 sm:h-12 cursor-pointer rounded-full flex items-center justify-center"
          >
            <IoIosArrowBack />
          </button>
          <span className={"w-1/3 text-center"}>{index + 1}</span>|
          <span className={"w-1/3 text-center"}>{cards.length}</span>
          <button
            onClick={goForward}
            className="w-12 h-10 sm:w-15 sm:h-12 cursor-pointer rounded-full flex items-center justify-center"
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
  termMode: boolean;
}
function Card({ card, termMode }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const t = useTranslations("card");

  useKeyboardShortcut(" ", () => setIsFlipped((f) => !f));
  useKeyboardShortcut("ArrowUp", () => setIsFlipped((f) => !f));
  useKeyboardShortcut("ArrowDown", () => setIsFlipped((f) => !f));

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
            "side-a backface-hidden top-0 left-0 absolute  w-full cursor-pointer shadow-2xl h-full flex items-center justify-center rounded-3xl border border-studoborder/30 bg-linear-45 from-studogrey/30 to to-zinc-200/30 dark:to-zinc-400/20"
          }
        >
          <span
            className={
              "absolute bottom-3 left-1/2 -translate-1/2 flex flex-row gap-1 items-center opacity-30"
            }
          >
            <TbClick />
            {t("click_turn")}
          </span>
          {termMode ? (
            <span className="text-xl select-none font-bold font-georgia">
              {card.term_content_type === "latex" ? (
                <SafeKaTeX value={card.term} fallback={card.term} />
              ) : card.term_content_type === "code" ? (
                <CodeBlock value={card.term} lang={card.code_language} />
              ) : (
                card.term
              )}
            </span>
          ) : (
            <span className="block text-base sm:text-lg md:text-xl text-center text-balance leading-relaxed select-none px-4">
              {card.definition}
            </span>
          )}
        </div>
        <div
          className={
            "side-b backface-hidden top-0 left-0 absolute px-10 w-full cursor-pointer shadow-2xl h-full flex items-center justify-center rounded-3xl border border-studoborder/30 bg-studogrey/30"
          }
        >
          {termMode ? (
            <span className="block text-base sm:text-lg md:text-xl text-center text-balance leading-relaxed select-none px-4">
              {card.definition}
            </span>
          ) : (
            <span className="text-xl select-none font-bold font-georgia">
              {card.term_content_type === "latex" ? (
                <SafeKaTeX value={card.term} fallback={card.term} />
              ) : card.term_content_type === "code" ? (
                <CodeBlock value={card.term} lang={card.code_language} />
              ) : (
                card.term
              )}
            </span>
          )}
          <span
            className={
              "absolute bottom-3 left-1/2 -translate-1/2 flex flex-row gap-1 items-center opacity-30"
            }
          >
            <TbClick />
            {t("click_flip_back")}
          </span>
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
