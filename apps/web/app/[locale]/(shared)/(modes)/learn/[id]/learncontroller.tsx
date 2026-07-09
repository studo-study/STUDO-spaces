"use client";

import { useReducer, useEffect, useRef, useMemo } from "react";
import ProgressBar from "@/components/ui/app/shared/profile/(modes)/learn/progressbar";
import LearnCard from "@/components/ui/app/shared/profile/(modes)/learn/card";
import ProgressScreen from "@/components/ui/app/shared/profile/(modes)/learn/progressscreen";
import { Card, FullStudyset } from "@/types/types";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "@/i18n/routing";

interface LearnProps {
  data: FullStudyset;
}

type Phase =
  | "answering"
  | "correct"
  | "incorrect"
  | "showAnswer"
  | "showProgress";

interface State {
  index: number;
  queue: Card[];
  queueIndex: number;
  queueMode: boolean;
  phase: Phase;
  termMode: boolean;
  progressMode: boolean;
  correctCounts: Record<string, number>;
}

type Action =
  | {
      type: "SUBMIT_ANSWER";
      input: string;
      correctAnswer: string;
      card: Card;
      cards: Card[];
    }
  | { type: "SHOW_ANSWER" }
  | { type: "ADVANCE"; cards: Card[] }
  | { type: "TOGGLE_TERM_MODE" }
  | { type: "TOGGLE_PROGRESS" };

function learnReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SUBMIT_ANSWER": {
      const isCorrect = action.input === action.correctAnswer;
      const newCounts = { ...state.correctCounts };

      if (isCorrect) {
        newCounts[action.card.id] = (newCounts[action.card.id] || 0) + 1;
      }

      // Check meteen of alles gemasterd is na deze update
      const allMastered =
        isCorrect &&
        action.cards.every((card) => (newCounts[card.id] || 0) >= 2);

      if (allMastered) {
        return {
          ...state,
          correctCounts: newCounts,
          phase: "showProgress",
          progressMode: true,
        };
      }

      return {
        ...state,
        phase: isCorrect ? "correct" : "incorrect",
        queue: isCorrect ? state.queue : [...state.queue, action.card],
        correctCounts: newCounts,
      };
    }

    case "SHOW_ANSWER":
      return { ...state, phase: "showAnswer" };

    case "ADVANCE": {
      console.log("ADVANCE from index:", state.index);
      console.log("cards length:", action.cards.length);
      console.log("correctCounts:", state.correctCounts);

      const allMastered = action.cards.every(
        (card) => (state.correctCounts[card.id] || 0) >= 2,
      );
      console.log("allMastered:", allMastered);

      if (allMastered) {
        return { ...state, phase: "showProgress", progressMode: true };
      }

      let idx = (state.index + 1) % action.cards.length;
      console.log("next idx:", idx, "card:", action.cards[idx]?.id);

      let attempts = 0;
      while ((state.correctCounts[action.cards[idx]?.id] || 0) >= 2) {
        idx = (idx + 1) % action.cards.length;
        attempts++;
        if (attempts >= action.cards.length) {
          return { ...state, phase: "showProgress", progressMode: true };
        }
      }

      console.log("final idx:", idx);
      return { ...state, index: idx, phase: "answering" };
    }

    case "TOGGLE_TERM_MODE":
      return { ...state, termMode: !state.termMode };

    case "TOGGLE_PROGRESS":
      return { ...state, progressMode: !state.progressMode };

    default:
      return state;
  }
}

export default function LearnController({ data }: LearnProps) {
  const cards = data.cards;
  const sessionCards = data.session!.cards;
  const inputRef = useRef<HTMLInputElement>(null!);
  const startIndex = data.session!.index;
  const Router = useRouter();

  // Initialiseer correctCounts vanuit bestaande sessiedata
  const initialCounts: Record<string, number> = {};
  sessionCards.forEach((sc) => {
    if (sc.mastered) initialCounts[sc.cardId] = 2;
  });

  const [state, dispatch] = useReducer(learnReducer, {
    index: startIndex >= cards.length ? 0 : startIndex,
    queue: [],
    queueIndex: 0,
    queueMode: false,
    phase: startIndex >= cards.length ? "showProgress" : "answering",
    termMode: true,
    progressMode: startIndex >= cards.length,
    correctCounts: initialCounts,
  });

  const currentCard = useMemo(() => {
    const safeIndex = state.index < cards.length ? state.index : 0;
    return {
      card: cards[safeIndex],
      sessionCard: sessionCards[safeIndex],
    };
  }, [cards, sessionCards, state.index]);

  const correctAnswer = state.termMode
    ? currentCard.card.definition
    : currentCard.card.term;

  const termTaal =
    data.globalTermLanguage !== data.globalDefinitionLanguage
      ? "term"
      : data.globalTermLanguage;

  const defTaal =
    data.globalTermLanguage !== data.globalDefinitionLanguage
      ? "definitie"
      : data.globalDefinitionLanguage;

  useEffect(() => {
    let timer1: NodeJS.Timeout;

    switch (state.phase) {
      case "correct":
        timer1 = setTimeout(() => {
          dispatch({ type: "ADVANCE", cards });
          inputRef.current.value = "";
          inputRef.current.focus();
        }, 1000);
        break;

      case "incorrect":
        timer1 = setTimeout(() => {
          dispatch({ type: "SHOW_ANSWER" });
          inputRef.current.value = correctAnswer;
        }, 900);
        break;

      case "showAnswer":
        timer1 = setTimeout(() => {
          dispatch({ type: "ADVANCE", cards });
          inputRef.current.value = "";
          inputRef.current.focus();
        }, 1100);
        break;
    }

    return () => {
      clearTimeout(timer1);
    };
  }, [state.phase, correctAnswer, cards]);

  const handleCheck = (input: string) => {
    if (state.phase !== "answering") return;
    console.log("card:", currentCard.card);
    console.log("correctCounts:", state.correctCounts);
    dispatch({
      type: "SUBMIT_ANSWER",
      input,
      correctAnswer,
      card: currentCard.card,
      cards,
    });
  };

  return (
    <section className="w-full max-w-200 h-full py-20 gap-5 flex items-center justify-baseline flex-col">
      <div className="w-full flex">
        <BaseButton
          size="sm"
          variant="icon"
          onClick={() => Router.push("/studoset/" + data.id)}
        >
          <IoArrowBackOutline />
        </BaseButton>
      </div>

      <div className="w-full h-full flex items-center py-20 justify-baseline flex-col">
        <ProgressBar
          cardIndex={state.index}
          queueMode={state.queueMode}
          queueIndex={state.queueIndex}
          queueLength={state.queue.length}
          cardLength={sessionCards.length}
        />

        {state.progressMode ? (
          <ProgressScreen />
        ) : (
          <LearnCard
            inputRef={inputRef}
            correct={state.phase === "correct" || state.phase === "showAnswer"}
            incorrect={state.phase === "incorrect"}
            currentCard={currentCard}
            termMode={state.termMode}
            queueMode={state.queueMode}
            termLang={termTaal}
            defLang={defTaal}
            check={handleCheck}
            disabled={state.phase !== "answering"}
          />
        )}
      </div>
    </section>
  );
}
