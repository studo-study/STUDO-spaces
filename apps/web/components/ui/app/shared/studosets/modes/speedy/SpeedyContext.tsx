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
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateSession } from "@/hooks/app/session/useUpdateSession";

interface SpeedyContextValue {
  state: State;
  dispatch: Dispatch<Action>;
  currentCard: { card: Card; sessionCard: SessionCardResponse | undefined };
  cards: Card[];
  gameStarted: boolean;
  setGameStarted: (v: boolean) => void;
  startGame: () => void;
  pause: () => void;
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

  const queryClient = useQueryClient();
  // Per-card writes must not trigger a full studoset refetch each time; we
  // refresh the cache once when the game finishes.
  const updateSession = useUpdateSession(session.id, setId, {
    invalidateOnSettled: false,
  });

  // Card results are batched instead of written per card: keyed by
  // sessioncard id so re-answering the same card just overwrites (latest
  // result wins, no duplicate writes). Flushed every 10 answers plus on
  // finish/pause/tab-hide so a crash loses at most the last few cards.
  const FLUSH_EVERY = 10;
  const pendingRef = useRef<
    Map<string, { id: string; mastered: boolean; inQueue: boolean }>
  >(new Map());
  const answeredSinceFlushRef = useRef(0);
  const flushRef = useRef<() => void>(() => {});

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

  // Timer for the total session duration. elapsedMs is only ever written from
  // event handlers or the interval callback (never synchronously in an effect,
  // and never via Date.now() during render).
  const startTimeRef = useRef<number>(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const startGame = useCallback(() => {
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    setGameStarted(true);
  }, []);

  const pause = useCallback(() => {
    setElapsedMs(Date.now() - startTimeRef.current);
    setGameStarted(false);
    flushRef.current();
  }, []);

  const resume = useCallback(() => {
    // Offset the start time so paused time is not counted.
    startTimeRef.current = Date.now() - elapsedMs;
    setGameStarted(true);
  }, [elapsedMs]);

  const restart = useCallback(() => {
    pendingRef.current.clear();
    answeredSinceFlushRef.current = 0;
    dispatch({ type: "RESET", cards });
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    setGameStarted(true);
  }, [cards]);

  // Send whatever card results have piled up in one PUT, then clear the buffer.
  const flush = useCallback(() => {
    if (pendingRef.current.size === 0) return;
    const cards = [...pendingRef.current.values()];
    pendingRef.current.clear();
    answeredSinceFlushRef.current = 0;
    updateSession.mutate(
      { userId: session.userId, cards },
      {
        onError: () => {
          // Re-queue only cards that weren't answered again meanwhile.
          for (const c of cards) {
            if (!pendingRef.current.has(c.id)) pendingRef.current.set(c.id, c);
          }
        },
      },
    );
  }, [updateSession, session.userId]);

  useEffect(() => {
    flushRef.current = flush;
  });

  // Flush pending writes when the tab is hidden or closed so progress survives.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushRef.current();
    };
    const onPagehide = () => flushRef.current();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPagehide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPagehide);
      flushRef.current();
    };
  }, []);

  // Tick the elapsed time while playing; setState in a callback is allowed.
  useEffect(() => {
    if (!gameStarted || state.phase === "finished") return;
    const interval = setInterval(
      () => setElapsedMs(Date.now() - startTimeRef.current),
      1000,
    );
    return () => clearInterval(interval);
  }, [gameStarted, state.phase]);

  // Buffer per-card progress; flush in batches instead of writing every card.
  useEffect(() => {
    if (state.phase !== "correct" && state.phase !== "incorrect") return;
    const sessionCard = currentCard.sessionCard;
    if (!sessionCard) return;

    const mastered = state.phase === "correct";
    pendingRef.current.set(sessionCard.id, {
      id: sessionCard.id,
      mastered,
      inQueue: !mastered,
    });
    answeredSinceFlushRef.current += 1;
    if (answeredSinceFlushRef.current >= FLUSH_EVERY) flushRef.current();
  }, [state.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist the final result once the set is finished: any buffered cards plus
  // the session-level totals go out in a single PUT.
  useEffect(() => {
    if (state.phase !== "finished") return;
    const cards = [...pendingRef.current.values()];
    pendingRef.current.clear();
    answeredSinceFlushRef.current = 0;
    updateSession.mutate(
      {
        userId: session.userId,
        accuracy,
        endedAt: new Date().toISOString(),
        ...(cards.length > 0 ? { cards } : {}),
      },
      {
        onSettled: () =>
          queryClient.invalidateQueries({ queryKey: ["studosets", setId] }),
      },
    );
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
        pause,
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
