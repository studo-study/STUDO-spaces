"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import learnReducer, { type Action, type State } from "./speedyReducer";
import type { Card } from "@/types/types";
import type { SessionCardResponse, StudysessionResponse } from "@studo/types";
import { useUpdateSession } from "@/hooks/app/session/useUpdateSession";

interface SpeedyContextValue {
  state: State;
  dispatch: Dispatch<Action>;
  currentCard: { card: Card; sessionCard: SessionCardResponse };
  cards: Card[];
  gameStarted: boolean;
  setGameStarted: (v: boolean) => void;
}

const SpeedyContext = createContext<SpeedyContextValue>(null!);

export const useSpeedyContext = () => useContext(SpeedyContext);

interface SpeedyProviderProps {
  cards: Card[];
  sessionCards: SessionCardResponse[];
  session: StudysessionResponse;
  setId: string;
  children: ReactNode;
}

export function SpeedyProvider({
  cards,
  sessionCards,
  session,
  setId,
  children,
}: SpeedyProviderProps) {
  const startIndex = session.index;

  const initialCounts: Record<string, number> = {};
  sessionCards.forEach((sc) => {
    if (sc.mastered) initialCounts[sc.card_id] = 2;
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

  const [gameStarted, setGameStarted] = useState(false);
  const updateSession = useUpdateSession(session.id, setId);

  useEffect(() => {
    if (state.phase !== "correct" && state.phase !== "incorrect") return;

    const viewcount = state.correctCounts[currentCard.card.id] ?? 0;
    console.log(
      "[SpeedyContext] saving card",
      currentCard.sessionCard.id,
      "viewcount:",
      viewcount,
      "phase:",
      state.phase,
    );

    updateSession.mutate({
      user_id: session.user_id,
      cards: [
        {
          id: currentCard.sessionCard.id,
          card_viewcount: viewcount,
          mastered: viewcount >= 2,
          inQueue: state.phase === "incorrect",
        },
      ],
    });
  }, [state.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SpeedyContext.Provider
      value={{
        state,
        dispatch,
        currentCard,
        cards,
        gameStarted,
        setGameStarted,
      }}
    >
      {children}
    </SpeedyContext.Provider>
  );
}
