"use client";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState, useEffect, useMemo, useRef } from "react";
import "animate.css";
import { useKeyboardShortcut } from "@/hooks/overige/useKeyboardShortcut";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { useTranslations } from "next-intl";
import { GrPowerReset } from "react-icons/gr";
import { usePublicStudoset } from "@/hooks/app/sets/usePublicStudoset";
import { useRouter } from "@/i18n/routing";
import { TbClick } from "react-icons/tb";
import katex from "katex";
import "katex/dist/katex.min.css";
import "katex/dist/contrib/mhchem.mjs";
import { codeToHtml } from "shiki";
import AnimateOnMount from "@/components/ui/overige/ui/AnimateOnMount";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import { AiOutlineRise } from "react-icons/ai";

const FREE_LIMIT = 5;

interface SuggestionImage {
  id: string;
  display_url: string;
  photographer: string;
  source_page_url: string;
}

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
  suggestion_image?: SuggestionImage | null;
}

interface FCState {
  index: number;
  termMode: boolean;
  shuffleMode: boolean;
  shuffled: Card[];
  learntIds: string[];
}

interface FlashcardProps {
  id: string;
}

export default function PublicFlashcardMode({ id }: FlashcardProps) {
  const { data } = usePublicStudoset(id);
  const cards = useMemo<Card[]>(() => data?.cards ?? [], [data]);

  if (cards.length === 0) return null;
  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <FlashcardModeInner id={id} cards={cards} />
    </div>
  );
}

function FlashcardModeInner({ id, cards }: { id: string; cards: Card[] }) {
  const router = useRouter();
  const freeLimit = Math.min(FREE_LIMIT, cards.length);

  const [state, setState] = useState<FCState>(() => ({
    index: 0,
    termMode: true,
    shuffleMode: false,
    shuffled: cards,
    learntIds: [],
  }));

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const update = (next: FCState) => setState(next);

  const { index, termMode, shuffleMode, shuffled, learntIds } = state;

  const hitLimit = index >= freeLimit;
  const isFinished = index >= shuffled.length;

  const goForward = () => {
    const s = stateRef.current;
    if (s.shuffled.length === 0) return;
    update({ ...s, index: s.index + 1 > s.shuffled.length ? 0 : s.index + 1 });
  };

  const goBack = () => {
    const s = stateRef.current;
    if (s.shuffled.length === 0 || hitLimit) return;
    update({
      ...s,
      index: s.index - 1 < 0 ? s.shuffled.length - 1 : s.index - 1,
    });
  };

  const toggleResetProgress = () => {
    const s = stateRef.current;
    update({
      ...s,
      shuffled: s.shuffleMode ? shuffle(cards) : cards,
      learntIds: [],
      index: 0,
    });
  };

  const toggleReset = () => {
    const s = stateRef.current;
    update({ ...s, index: 0 });
  };

  const toggleLearnt = (card: Card) => {
    const s = stateRef.current;
    const newShuffled = s.shuffled.filter((c) => c.id !== card.id);
    const newLearntIds = [...s.learntIds, card.id];
    const newIndex =
      s.index >= newShuffled.length ? newShuffled.length : s.index;
    update({
      ...s,
      shuffled: newShuffled,
      learntIds: newLearntIds,
      index: newIndex,
    });
  };

  useKeyboardShortcut(
    "ArrowRight",
    hitLimit || isFinished ? () => {} : goForward,
  );
  useKeyboardShortcut("ArrowLeft", hitLimit || isFinished ? () => {} : goBack);

  return (
    <div className="relative w-full min-h-150 h-full  flex flex-col gap-3 sm:gap-5">
      {/* Toolbar */}
      <div className="w-full h-fit flex flex-row gap-2 sm:gap-5 items-center">
        <div className="w-full bg-studogrey/30 shadow-2xl overflow-hidden flex flex-row h-2 rounded-full border border-gray-300 dark:border-studoborder/30">
          <div
            style={{
              width: `${isFinished ? 100 : (learntIds.length / cards.length) * 100}%`,
            }}
            className="h-full bg-linear-90 from-emerald-400 to-emerald-500 transition-all duration-500"
          />
          {!isFinished && (
            <div
              style={{
                width: `${shuffled.length > 0 ? (index / cards.length) * 100 : 0}%`,
              }}
              className="h-full bg-linear-90 from-orange-400 to-orange-500 transition-all duration-300"
            />
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 max-h-130">
        {hitLimit ? (
          <LoginWall
            onLogin={() => router.push("/login?callbackUrl=studoset/" + id)}
            onRegsiter={() =>
              router.push("/register?callbackUrl=studoset/" + id)
            }
          />
        ) : isFinished ? (
          <FinishedScreen
            progress={toggleResetProgress}
            reset={toggleReset}
            cardlength={shuffled.length}
          />
        ) : (
          <CardView
            card={shuffled[index]}
            key={shuffled[index].id}
            termMode={termMode}
            onLearnt={toggleLearnt}
          />
        )}
      </div>

      {/* Navigatie */}
      <div className="flex flex-row gap-3 sm:gap-5 items-center justify-center pb-4 sm:pb-6">
        <div className="w-fit flex flex-row gap-3 px-2 items-center border border-studoborder/30 rounded-full shadow-xl bg-studogrey/30">
          <button
            onClick={goBack}
            disabled={hitLimit}
            className="w-12 h-10 sm:w-15 sm:h-12 cursor-pointer rounded-full flex items-center justify-center disabled:opacity-30"
          >
            <IoIosArrowBack />
          </button>
          <span className={"w-1/3 text-center"}>
            {hitLimit
              ? freeLimit
              : index >= shuffled.length
                ? shuffled.length
                : index + 1}
          </span>
          |<span className={"w-1/3 text-center"}>{shuffled.length}</span>
          <button
            onClick={goForward}
            disabled={hitLimit}
            className="w-12 h-10 sm:w-15 sm:h-12 cursor-pointer rounded-full flex items-center justify-center disabled:opacity-30"
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginWall({
  onLogin,
  onRegsiter,
}: {
  onLogin: () => void;
  onRegsiter: () => void;
}) {
  const t = useTranslations("flashcards");

  return (
    <div className="animate__fadeInLeft animate__animate w-full h-full card--container">
      <div className="side-a backface-hidden top-0 left-0 absolute w-full shadow-2xl h-full flex items-center justify-center rounded-3xl border border-studoborder/30 bg-linear-45 from-studogrey/30 to to-zinc-200/30 dark:to-zinc-400/20">
        <AnimateOnMount className="w-fit flex flex-col gap-5 items-center justify-center">
          <div className="gap-2 flex-col flex items-center justify-center text-center">
            <span className="font-georgia font-bold text-2xl">
              {t("login_wall_title")}
            </span>
            <p className="text-sm opacity-60 max-w-xs">
              {t("login_wall_subtitle")}
            </p>
          </div>
          <div className={"flex flex-row gap-3 items-center justify-center"}>
            <BaseButton
              type="button"
              variant="primary"
              label={t("register_wall_cta")}
              onClick={onRegsiter}
            />
            <BaseButton
              type="button"
              variant="submit"
              label={t("login_wall_cta")}
              onClick={onLogin}
            />
          </div>
        </AnimateOnMount>
      </div>
    </div>
  );
}

interface CardProps {
  card: Card;
  termMode: boolean;
  onLearnt: (value: Card) => void;
}
function CardView({ card, termMode, onLearnt }: CardProps) {
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
        {/* term / definitie voorzijde */}
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
              iconLeft={<FaCheck />}
              label={t("learnt")}
              onClick={() => onLearnt(card)}
            />
          </div>
          <span className="absolute bottom-3 left-1/2 -translate-1/2 flex flex-row gap-3 items-center opacity-30">
            <TbClick />
            {t("click_turn")}
          </span>
          <div
            className={`flex flex-row gap-3 items-center w-full px-5 ${card.suggestion_image ? "justify-between" : "justify-center"}`}
          >
            <div
              className={`flex h-full items-center justify-center ${card.suggestion_image ? "w-1/2" : "w-full"}`}
            >
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
            {card.suggestion_image && (
              <div className="max-h-1/3 rounded-lg overflow-hidden">
                <Image
                  src={card.suggestion_image.display_url}
                  width={300}
                  height={300}
                  alt={card.suggestion_image.photographer}
                />
              </div>
            )}
          </div>
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
          <span className="absolute bottom-3 left-1/2 -translate-1/2 flex flex-row gap-1 items-center opacity-30">
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

interface FinishedScreenProps {
  reset: () => void;
  progress: () => void;
  cardlength: number;
}
const FinishedScreen = ({
  reset,
  progress,
  cardlength,
}: FinishedScreenProps) => {
  const t = useTranslations("flashcards");

  return (
    <div className="animate__fadeInLeft animate__animate w-full h-full card--container">
      <div className="side-a backface-hidden top-0 left-0 absolute w-full cursor-pointer shadow-2xl h-full flex items-center justify-center rounded-3xl border border-studoborder/30 bg-linear-45 from-studogrey/30 to to-zinc-200/30 dark:to-zinc-400/20">
        <AnimateOnMount className="w-fit flex flex-col gap-5 items-center justify-center">
          <div className="gap-2 flex-col flex items-center justify-center">
            <Image
              src="/images/fallbacks/finish.png"
              width={200}
              height={200}
              alt="finish"
              className="w-auto h-30"
            />
            <span className="font-georgia font-bold text-xl">
              {t("all_set")}
            </span>
          </div>
          <div className="w-fit flex flex-row gap-2">
            {cardlength > 0 && (
              <BaseButton
                size="sm"
                type="button"
                variant="primary"
                iconLeft={<GrPowerReset />}
                label={t("restart")}
                onClick={reset}
              />
            )}
            <BaseButton
              size="sm"
              type="button"
              variant="danger"
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
