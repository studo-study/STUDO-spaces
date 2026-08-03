"use client";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState, useEffect, useMemo, useRef } from "react";
import "animate.css";
import { IoArrowBackOutline, IoShuffleOutline } from "react-icons/io5";
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
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import Image from "next/image";
import { AiOutlineRise } from "react-icons/ai";
import { Check, Flag } from "lucide-react";
import { SessionCard } from "@/types/types";

interface SuggestionImage {
  id: string;
  displayUrl: string;
  photographer: string;
  sourcePageUrl: string;
}

interface Card {
  id: string;
  term: string;
  definition: string;
  number: number;
  createdAt: string;
  updatedAt: string;
  setId: string;
  ownerId: string;
  termContentType: "text" | "latex" | "code";
  codeLanguage: string;
  suggestionImage?: SuggestionImage | null;
}

/** Card + bijhorende sessiondata in één object, zodat beide bereikbaar zijn. */
interface FlashcardItem {
  card: Card;
  session: SessionCard | null;
}

interface FlashcardProps {
  id: string;
  isHome?: boolean;
}

const storageKey = (id: string) => `studo-fc-${id}`;

function persistState(id: string, s: FCState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    storageKey(id),
    JSON.stringify({
      index: s.index,
      termMode: s.termMode,
      shuffleMode: s.shuffleMode,
      shuffledIds: s.shuffled.map((i) => i.card.id),
      learntIds: s.learntIds,
    } satisfies PersistedState),
  );
}

interface PersistedState {
  index: number;
  termMode: boolean;
  shuffleMode: boolean;
  shuffledIds: string[];
  learntIds: string[];
}

function loadState(id: string): PersistedState {
  const defaults = {
    index: 0,
    termMode: true,
    shuffleMode: false,
    shuffledIds: [],
    learntIds: [],
  };
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(storageKey(id));
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) } as PersistedState;
  } catch {
    return defaults;
  }
}

interface FCState {
  index: number;
  termMode: boolean;
  shuffleMode: boolean;
  shuffled: FlashcardItem[];
  learntIds: string[];
}

export default function FlashcardMode({ id, isHome }: FlashcardProps) {
  const data = useStudoset(id)?.data;
  const cards = useMemo<Card[]>(() => data?.cards ?? [], [data]);
  const sessionCards = useMemo<SessionCard[]>(
    () => data?.session?.cards ?? [],
    [data],
  );

  // Join card + sessioncard op cardId zodat beide in één object zitten.
  const items = useMemo<FlashcardItem[]>(() => {
    const sessionByCard = new Map(sessionCards.map((s) => [s.cardId, s]));
    return cards.map((card) => ({
      card,
      session: sessionByCard.get(card.id) ?? null,
    }));
  }, [cards, sessionCards]);

  if (items.length === 0) return null;
  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <FlashcardModeInner
        id={id}
        items={items}
        isHome={isHome ? isHome : false}
      />
    </div>
  );
}

// Inner: items zijn gegarandeerd beschikbaar, lazy initialisers werken hier
function FlashcardModeInner({
  id,
  items,
  isHome,
}: {
  id: string;
  items: FlashcardItem[];
  isHome: boolean;
}) {
  const t = useTranslations("flashcards");

  const [state, setState] = useState<FCState>(() => {
    const saved = loadState(id);
    const learntIds = saved.learntIds.filter((lid) =>
      items.some((i) => i.card.id === lid),
    );
    const remaining = items.filter((i) => !learntIds.includes(i.card.id));
    const restoredShuffled =
      saved.shuffledIds.length > 0
        ? (() => {
            const ordered = saved.shuffledIds
              .map((sid) => items.find((i) => i.card.id === sid))
              .filter(Boolean) as FlashcardItem[];
            // valid als alle huidige remaining items erin zitten
            const validIds = new Set(remaining.map((i) => i.card.id));
            const filtered = ordered.filter((i) => validIds.has(i.card.id));
            return filtered.length === remaining.length ? filtered : remaining;
          })()
        : remaining;
    return {
      index: saved.index <= restoredShuffled.length ? saved.index : 0,
      termMode: saved.termMode,
      shuffleMode: saved.shuffleMode,
      shuffled: restoredShuffled,
      learntIds,
    };
  });

  const idRef = useRef(id);
  const stateRef = useRef(state);

  // Keep refs in sync outside of render
  useEffect(() => {
    idRef.current = id;
  });
  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    persistState(idRef.current, stateRef.current);
  }, [state]);

  const update = (next: FCState) => {
    persistState(id, next);
    setState(next);
  };

  const goForward = () => {
    const s = stateRef.current;
    if (s.shuffled.length === 0) return;
    update({ ...s, index: s.index + 1 > s.shuffled.length ? 0 : s.index + 1 });
  };

  const goBack = () => {
    const s = stateRef.current;
    if (s.shuffled.length === 0) return;
    update({
      ...s,
      index: s.index - 1 < 0 ? s.shuffled.length - 1 : s.index - 1,
    });
  };

  const toggleShuffle = () => {
    const s = stateRef.current;
    const newMode = !s.shuffleMode;
    update({
      ...s,
      shuffleMode: newMode,
      index: 0,
      shuffled: newMode ? shuffle(items) : items,
    });
  };

  const toggleResetProgress = () => {
    const s = stateRef.current;
    update({
      ...s,
      shuffled: s.shuffleMode ? shuffle(items) : items,
      learntIds: [],
      index: 0,
    });
  };

  const toggleReset = () => {
    const s = stateRef.current;
    update({ ...s, index: 0 });
  };

  const toggleLearnt = (item: FlashcardItem) => {
    const s = stateRef.current;
    const newShuffled = s.shuffled.filter((i) => i.card.id !== item.card.id);
    const newLearntIds = [...s.learntIds, item.card.id];
    const newIndex =
      s.index >= newShuffled.length ? newShuffled.length : s.index;
    update({
      ...s,
      shuffled: newShuffled,
      learntIds: newLearntIds,
      index: newIndex,
    });
  };

  const { index, termMode, shuffleMode, shuffled, learntIds } = state;

  const isFinished = index >= shuffled.length;
  useKeyboardShortcut("ArrowRight", isFinished ? () => {} : goForward);
  useKeyboardShortcut("ArrowLeft", isFinished ? () => {} : goBack);

  const Router = useRouter();
  return (
    <div className="w-full min-h-170 h-full max-h-190 flex flex-col gap-3 sm:gap-5  px-10">
      {!isHome && (
        <div className="w-full flex">
          <BaseButton
            size="sm"
            variant="icon"
            onClick={() => Router.push("/studoset/" + id)}
          >
            <IoArrowBackOutline />
          </BaseButton>
        </div>
      )}

      {/* Toolbar */}
      <div className="w-full flex flex-row gap-2 sm:gap-5 items-center">
        <div className="w-full bg-studogrey/30 shadow-2xl overflow-hidden flex flex-row h-2 rounded-full border border-gray-300 dark:border-studoborder/30">
          <div
            style={{
              width: `${isFinished ? 100 : (learntIds.length / items.length) * 100}%`,
            }}
            className="h-full bg-linear-90 from-emerald-400 to-emerald-500 transition-all duration-500"
          />
          {!isFinished && (
            <div
              style={{
                width: `${shuffled.length > 0 ? (index / items.length) * 100 : 0}%`,
              }}
              className="h-full bg-linear-90 from-orange-400 to-orange-500 transition-all duration-300"
            />
          )}
        </div>
        <BaseTooltip content={t("answer_with")}>
          <BaseButton
            variant="icon"
            className={"min-h-full"}
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
              size={19}
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
            <GrPowerReset size={19} />
          </BaseButton>
        </BaseTooltip>
        <BaseTooltip content={t("progress")}>
          <BaseButton variant="icon" onClick={toggleResetProgress}>
            <AiOutlineRise size={19} />
          </BaseButton>
        </BaseTooltip>
      </div>

      <div className="flex-1 pb-10 min-h-0 max-h-130">
        {index >= shuffled.length ? (
          <FinishedScreen
            progress={toggleResetProgress}
            reset={toggleReset}
            back={() => Router.push("/studoset/" + id)}
            cardlength={shuffled.length}
            isHome={isHome}
          />
        ) : (
          <Card
            item={shuffled[index]}
            key={shuffled[index].card.id}
            termMode={termMode}
            onLearnt={toggleLearnt}
            isHome={isHome}
          />
        )}
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
          <span className={"w-1/3 text-center"}>
            {index >= shuffled.length ? shuffled.length : index + 1}
          </span>
          |<span className={"w-1/3 text-center"}>{shuffled.length}</span>
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
  item: FlashcardItem;
  termMode: boolean;
  onLearnt: (value: FlashcardItem) => void;
  onFlag?: (value: SessionCard | null) => void;
  isHome?: boolean;
}
function Card({ item, termMode, onLearnt, onFlag, isHome = false }: CardProps) {
  const { card, session } = item;
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
      <div className="relative transform-3d w-full h-full card--flipper transition-all duration-300">
        {/*term*/}
        <div
          className={
            "side-a shadow-lg backface-hidden top-0 left-0 absolute w-full cursor-pointer h-full flex items-center justify-center rounded-3xl border hover:border-studoborder transition-all duration-300 border-studoborder/30 bg-linear-45 from-studogrey/30 to to-zinc-200/30 dark:to-zinc-400/20"
          }
        >
          <div
            className="absolute right-3 top-3 z-20 flex flex-row gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <BaseButton
              iconLeft={<Check size={15} />}
              label={t("learnt")}
              onClick={() => onLearnt(item)}
            />
            {isHome && onFlag && (
              <BaseButton
                icon={<Flag size={15} />}
                onClick={() => onFlag(session)}
              />
            )}
          </div>
          <span
            className={
              "absolute bottom-3 left-1/2 -translate-1/2 flex flex-row gap-3 items-center opacity-30"
            }
          >
            <TbClick />
            {t("click_turn")}
          </span>
          <div
            className={`flex flex-row gap-3 items-center w-full px-5 ${card.suggestionImage ? "justify-between" : "justify-center"}`}
          >
            <div
              className={`flex h-full items-center justify-center ${card.suggestionImage ? "w-1/2" : "w-full"}`}
            >
              {termMode ? (
                <span className="text-xl scroll-hidden max-w-full select-none font-bold font-georgia">
                  {card.termContentType === "latex" ? (
                    <SafeKaTeX value={card.term} fallback={card.term} />
                  ) : card.termContentType === "code" ? (
                    <CodeBlock value={card.term} lang={card.codeLanguage} />
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
            {card.suggestionImage && (
              <div className="max-h-1/3 rounded-lg overflow-hidden">
                <Image
                  src={card.suggestionImage.displayUrl}
                  width={300}
                  height={300}
                  alt={card.suggestionImage.photographer}
                  className=""
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={
            "side-b backface-hidden  top-0 left-0 absolute px-10 w-full cursor-pointer shadow-2xl h-full flex items-center justify-center rounded-3xl border border-studoborder/30 bg-studogrey/30"
          }
        >
          <div>
            {termMode ? (
              <span className="block  text-base sm:text-lg md:text-xl text-center text-balance leading-relaxed select-none px-4">
                {card.definition}
              </span>
            ) : (
              <span className="text-xl select-none font-bold font-georgia scroll-hidden max-w-full overflow-hidden">
                {card.termContentType === "latex" ? (
                  <SafeKaTeX value={card.term} fallback={card.term} />
                ) : card.termContentType === "code" ? (
                  <CodeBlock value={card.term} lang={card.codeLanguage} />
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
    </div>
  );
}

function shuffle(array: FlashcardItem[]): FlashcardItem[] {
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
    <p
      className="text-lg px-5 flex-1 max-w-full scroll-hidden overflow-auto [&>pre]:bg-transparent! [&>pre]:p-0 [&>pre]:font-mono [&>pre]:!whitespace-pre-wrap [&>pre]:wrap-break-word! [&>pre_span]:whitespace-pre-wrap!"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface FinishedScreenProps {
  reset: () => void;
  back: () => void;
  progress: () => void;
  cardlength: number;
  isHome: boolean;
}
const FinishedScreen = ({
  reset,
  back,
  progress,
  cardlength,
  isHome,
}: FinishedScreenProps) => {
  const t = useTranslations("flashcards");

  return (
    <div
      className={`animate__fadeInLeft animate__animate w-full h-full card--container`}
    >
      <div
        className={
          "side-a backface-hidden top-0 left-0 absolute w-full cursor-pointer shadow-2xl h-full flex items-center justify-center rounded-3xl border border-studoborder/30 bg-linear-45 from-studogrey/30 to to-zinc-200/30 dark:to-zinc-400/20"
        }
      >
        {!isHome && (
          <>
            <div className={"firework"} />
            <div className={"firework"} />
            <div className={"firework"} />
          </>
        )}

        <AnimateOnMount
          className={"w-fit flex flex-col gap-5 items-center justify-center"}
        >
          <div className={"gap-2 flex-col flex items-center justify-center"}>
            <Image
              src={"/images/fallbacks/finish.png"}
              width={200}
              height={200}
              alt={"finish"}
              className={"w-auto h-30"}
            />
            <span className={"font-georgia font-bold text-xl"}>
              {t("all_set")}
            </span>
          </div>

          <div className={"w-fit flex flex-row gap-2"}>
            {!isHome && (
              <BaseButton
                size={"sm"}
                type={"button"}
                variant={"submit"}
                iconLeft={<IoArrowBackOutline />}
                label={t("back")}
                onClick={back}
              />
            )}
            {cardlength > 0 && (
              <BaseButton
                size={"sm"}
                type={"button"}
                variant={"primary"}
                iconLeft={<GrPowerReset />}
                label={t("restart")}
                onClick={reset}
              />
            )}
            <BaseButton
              size={"sm"}
              type={"button"}
              variant={"danger"}
              iconLeft={<AiOutlineRise />}
              label={t("progress")}
              onClick={progress}
            />
          </div>
        </AnimateOnMount>
      </div>
    </div>
  );
};
