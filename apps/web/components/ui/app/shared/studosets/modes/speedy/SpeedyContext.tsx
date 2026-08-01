"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import speedyReducer, {
  makeInitialState,
  type Action,
  type State,
} from "./speedyReducer";
import type { Card } from "@/types/types";
import type { SessionCardResponse, StudysessionResponse } from "@studo/types";
import { useUpdateSession } from "@/hooks/app/session/useUpdateSession";

interface SpeedyContextValue {
  state: State;
  dispatch: Dispatch<Action>;
  currentCard: { card: Card; sessionCard: SessionCardResponse | undefined };
  cards: Card[];
  gameStarted: boolean;
  setGameStarted: (v: boolean) => void;
  startGame: () => void;
  resume: () => void;
  restart: () => void;
  elapsedMs: number;
  accuracy: number;
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
  const [state, dispatch] = useReducer(speedyReducer, cards, makeInitialState);
  const [gameStarted, setGameStarted] = useState(false);

  const updateSession = useUpdateSession(session.id, setId);

  // Map card id -> session card so lookups keep working after the deck reorders.
  const sessionCardByCardId = useMemo(() => {
    const map: Record<string, SessionCardResponse> = {};
    sessionCards.forEach((sc) => {
      map[sc.cardId] = sc;
    });
    return map;
  }, [sessionCards]);

  const currentCard = useMemo(() => {
    const card = state.deck[state.deckIndex];
    return {
      card,
      sessionCard: card ? sessionCardByCardId[card.id] : undefined,
    };
  }, [state.deck, state.deckIndex, sessionCardByCardId]);

  const accuracy =
    state.totalAnswers > 0
      ? Math.round((state.correctAnswers / state.totalAnswers) * 100)
      : 0;

  // Timer for the total session duration.
  const startTimeRef = useRef<number>(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const startGame = useCallback(() => {
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    setGameStarted(true);
  }, []);

  const resume = useCallback(() => {
    // Offset the start time so paused time is not counted.
    startTimeRef.current = Date.now() - elapsedMs;
    setGameStarted(true);
  }, [elapsedMs]);

  const restart = useCallback(() => {
    dispatch({ type: "RESET", cards });
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    setGameStarted(true);
  }, [cards]);

  useEffect(() => {
    if (!gameStarted || state.phase === "finished") return;
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStarted, state.phase]);

  // Persist per-card progress on each result.
  useEffect(() => {
    if (state.phase !== "correct" && state.phase !== "incorrect") return;
    const sessionCard = currentCard.sessionCard;
    if (!sessionCard) return;

    const mastered = state.phase === "correct";
    updateSession.mutate({
      userId: session.userId,
      cards: [
        {
          id: sessionCard.id,
          mastered,
          inQueue: !mastered,
        },
      ],
    });
  }, [state.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist the final result once the set is finished.
  useEffect(() => {
    if (state.phase !== "finished") return;
    const finishedAt = Date.now();
    const startedAt = startTimeRef.current || finishedAt;
    setElapsedMs(finishedAt - startedAt);
    updateSession.mutate({
      userId: session.userId,
      accuracy,
      endedAt: new Date(finishedAt).toISOString(),
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
        startGame,
        resume,
        restart,
        elapsedMs,
        accuracy,
      }}
    >
      {children}
    </SpeedyContext.Provider>
  );
}
