"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useQueryClient } from "@tanstack/react-query";
import type { UpdateStudysession } from "@studo/types";
import { useLearnStore } from "@/app/[locale]/(shared)/(modes)/learn/[id]/learnStore";
import { useStudoset } from "@/hooks/app/sets/useStudoset";
import { useUpdateSession } from "@/hooks/app/session/useUpdateSession";
import { CardCorrector } from "@/app/[locale]/(shared)/(modes)/learn/[id]/FuzzyMatch";

const INTERVAL = 5;

const normalize = (input: string) =>
  input.trim().toLowerCase().replace(/\s+/g, " ");

export type Phase = "input" | "feedback" | "intermezzo" | "done";

export interface ReviewItem {
  word: string;
  correct: boolean;
}

export const useLearnCard = () => {
  const router = useRouter();
  const setId = useLearnStore((state) => state.setId);
  const settings = useLearnStore((state) => state.learnSettings);
  const set = useStudoset(setId!).data;
  const cards = set?.cards;
  const queryClient = useQueryClient();
  const updateSession = useUpdateSession(set?.session?.id ?? "", setId ?? "", {
    invalidateOnSettled: false,
  });

  const cap = Math.max(1, settings.revisionCount);
  const flaggedFilter = settings.flaggedMode;
  const flaggedIds = new Set(
    (set?.session?.cards ?? [])
      .filter((sc) => sc.flagged)
      .map((sc) => sc.cardId),
  );
  const passesFlagged = (cardId: string) =>
    !flaggedFilter || flaggedIds.has(cardId);

  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [wasCorrect, setWasCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [retry, setRetry] = useState(false);
  const [queue, setQueue] = useState<number[]>([]);
  const [drillQueue, setDrillQueue] = useState<number[]>([]);
  const [errorMode, setErrorMode] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const [history, setHistory] = useState<ReviewItem[]>([]);

  const toggleImage = () => setShowImage((prev) => !prev);

  const viewsRef = useRef<Record<string, number>>({});
  const masteryRef = useRef<Record<string, number>>({});
  const attemptsRef = useRef(0);
  const errorQueueRef = useRef<number[]>([]);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctRef = useRef(0);
  const lastSeenRef = useRef<string | null>(null);
  const dirtyRef = useRef(false);
  // Only cards touched since the last flush get written, so a flush no longer
  // re-writes every row in the set.
  const dirtyCardsRef = useRef<Set<string>>(new Set());
  const flushRef = useRef<() => void>(() => {});

  const durationBaseRef = useRef(0);
  const sessionStartMsRef = useRef(Date.now());
  const prevAvgRef = useRef(0);
  const prevAttemptsRef = useRef(0);
  const respSumMsRef = useRef(0);
  const cardShownAtRef = useRef(Date.now());
  const focusMaxRef = useRef(0);
  const focusCurRef = useRef(0);

  const cardAttemptsRef = useRef<Record<string, number>>({});
  const cardCorrectRef = useRef<Record<string, number>>({});
  const cardRespSumRef = useRef<Record<string, number>>({});
  const completionsRef = useRef(0);
  const completionCountedRef = useRef(false);

  if (cards && !initialized) {
    setInitialized(true);
    const sesh = set?.session;
    attemptsRef.current = sesh?.totalAttempts ?? 0;
    correctRef.current = sesh?.totalCorrect ?? 0;
    durationBaseRef.current = sesh?.durationMin ?? 0;
    prevAvgRef.current = sesh?.averageResponseTime ?? 0;
    prevAttemptsRef.current = sesh?.totalAttempts ?? 0;
    focusMaxRef.current = sesh?.longestFocusStreak ?? 0;
    completionsRef.current = sesh?.completions ?? 0;
    completionCountedRef.current = false;
    sessionStartMsRef.current = Date.now();
    const scById = new Map(
      (set?.session?.cards ?? []).map((sc) => [
        sc.cardId,
        {
          viewcount: sc.cardViewcount,
          mastery: sc.timesRelearned,
          attempts: sc.totalAttempts,
          correct: sc.totalCorrect,
          respSum: sc.responseSumMs,
        },
      ]),
    );
    const views: Record<string, number> = {};
    const mastery: Record<string, number> = {};
    const cAttempts: Record<string, number> = {};
    const cCorrect: Record<string, number> = {};
    const cRespSum: Record<string, number> = {};
    let seededViews = 0;
    cards.forEach((c) => {
      const sc = scById.get(c.id);
      views[c.id] = sc?.viewcount ?? 0;
      mastery[c.id] = sc?.mastery ?? 0;
      cAttempts[c.id] = sc?.attempts ?? 0;
      cCorrect[c.id] = sc?.correct ?? 0;
      cRespSum[c.id] = sc?.respSum ?? 0;
      if (passesFlagged(c.id)) seededViews += Math.min(mastery[c.id], cap);
    });
    viewsRef.current = views;
    masteryRef.current = mastery;
    cardAttemptsRef.current = cAttempts;
    cardCorrectRef.current = cCorrect;
    cardRespSumRef.current = cRespSum;
    setTotalViews(seededViews);
    const seededQueue = cards
      .map((_, i) => i)
      .filter((i) => (mastery[cards[i].id] ?? 0) < cap)
      .filter((i) => passesFlagged(cards[i].id));

    const lastSeen = set?.session?.lastSeen;
    const startPos = lastSeen
      ? seededQueue.findIndex((i) => cards[i].id === lastSeen)
      : -1;
    const orderedQueue =
      startPos > 0
        ? [...seededQueue.slice(startPos), ...seededQueue.slice(0, startPos)]
        : seededQueue;
    setQueue(orderedQueue);
    if (seededQueue.length === 0) setPhase("done");
  }

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (phase === "done" && finishing && !completionCountedRef.current) {
      completionsRef.current += 1;
      completionCountedRef.current = true;
      dirtyRef.current = true;
    }
  }, [phase, finishing]);

  useEffect(() => {
    if (phase === "intermezzo" || phase === "done") flushRef.current?.();
    if (phase === "done" && setId) {
      queryClient.invalidateQueries({ queryKey: ["studosets", setId] });
    }
  }, [phase, setId, queryClient]);

  const startDrill = () => {
    setDrillQueue([...errorQueueRef.current]);
    setErrorMode(true);
    setValue("");
    setWasCorrect(false);
    setRetry(false);
    setPhase("input");
  };

  useEffect(() => {
    if (phase !== "intermezzo") return;
    const mountedAt = performance.now();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (e.repeat || performance.now() - mountedAt < 300) return;
      if (finishing) {
        if (errorQueueRef.current.length === 0) setPhase("done");
        else startDrill();
      } else {
        setPhase("input");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finishing]);

  const head = errorMode ? drillQueue[0] : queue[0];

  useEffect(() => {
    if (phase === "input") cardShownAtRef.current = Date.now();
  }, [phase, head]);

  const currentCard = useCallback(() => {
    const card = cards?.[head];
    return {
      img_url: card?.suggestionImage?.displayUrl,
      displayWord:
        settings.answerWith === "term" ? card?.definition : (card?.term ?? ""),
      corrector: settings.answerWith === "term" ? card?.term : card?.definition,
    };
  }, [head, cards, settings.answerWith]);

  const doFlush = () => {
    const session = set?.session;
    if (!session?.id || !cards || !dirtyRef.current) return;
    const scByCardId = new Map(
      (session.cards ?? []).map((sc) => [sc.cardId, sc.id]),
    );
    const cardUpdates = cards.flatMap((c) => {
      if (!dirtyCardsRef.current.has(c.id)) return [];
      const scId = scByCardId.get(c.id);
      if (!scId) return [];
      const vc = viewsRef.current[c.id] ?? 0;
      const mastery = masteryRef.current[c.id] ?? 0;
      return [
        {
          id: scId,
          number: c.number,
          cardViewcount: vc,
          timesRelearned: mastery,
          mastered: mastery >= cap,
          inQueue: mastery < cap,
          totalAttempts: cardAttemptsRef.current[c.id] ?? 0,
          totalCorrect: cardCorrectRef.current[c.id] ?? 0,
          responseSumMs: cardRespSumRef.current[c.id] ?? 0,
        },
      ];
    });
    const index = cards.reduce(
      (s, c) => s + Math.min(masteryRef.current[c.id] ?? 0, cap),
      0,
    );
    const attempts = attemptsRef.current;
    const averageResponseTime =
      attempts > 0
        ? Math.round(
            (prevAvgRef.current * prevAttemptsRef.current +
              respSumMsRef.current) /
              attempts,
          )
        : 0;
    const now = new Date();
    const durationMin =
      durationBaseRef.current +
      Math.floor((now.getTime() - sessionStartMsRef.current) / 60000);
    const body: UpdateStudysession = {
      userId: session.userId,
      index,
      accuracy:
        attempts > 0 ? Math.round((correctRef.current / attempts) * 100) : 0,
      totalAttempts: attempts,
      totalCorrect: correctRef.current,
      completions: completionsRef.current,
      averageResponseTime,
      longestFocusStreak: focusMaxRef.current,
      durationMin,
      endedAt: now.toISOString(),
      lastStudied: now.toISOString(),
      ...(lastSeenRef.current ? { lastSeen: lastSeenRef.current } : {}),
      cards: cardUpdates,
    };
    dirtyRef.current = false;
    const flushedCardIds = [...dirtyCardsRef.current];
    dirtyCardsRef.current = new Set();
    updateSession.mutate(body, {
      onError: () => {
        dirtyRef.current = true;
        flushedCardIds.forEach((id) => dirtyCardsRef.current.add(id));
      },
    });
  };

  useEffect(() => {
    flushRef.current = doFlush;
  });

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushRef.current?.();
    };
    const onPagehide = () => flushRef.current?.();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPagehide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPagehide);
      flushRef.current?.();
      if (setId)
        queryClient.invalidateQueries({ queryKey: ["studosets", setId] });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkInput = (corrector: string) => {
    const threshold = settings.strictnessLevel / 10;
    if (threshold >= 1) {
      return normalize(value) === normalize(corrector);
    }
    return CardCorrector(normalize(value), normalize(corrector), threshold);
  };

  const submit = () => {
    const card = cards?.[head];
    const { corrector } = currentCard();
    if (!card || !corrector) return;
    const correct = checkInput(corrector);
    setWasCorrect(correct);
    lastSeenRef.current = card.id;
    dirtyRef.current = true;
    dirtyCardsRef.current.add(card.id);
    if (!retry) {
      if (correct && !errorMode) correctRef.current += 1;
      const inErrorQueue = errorQueueRef.current.includes(head);

      const views = viewsRef.current[card.id] ?? 0;
      if (correct && views < cap && !inErrorQueue) {
        viewsRef.current[card.id] = views + 1;
      } else if (!correct && views === 0) {
        viewsRef.current[card.id] = 1;
      }

      const mastery = masteryRef.current[card.id] ?? 0;
      if (correct && mastery < cap && !inErrorQueue) {
        masteryRef.current[card.id] = mastery + 1;
        setTotalViews((tv) => tv + 1);
      }
      if (!errorMode) {
        attemptsRef.current += 1;
        const rt = Math.max(0, Date.now() - cardShownAtRef.current);
        respSumMsRef.current += rt;
        cardAttemptsRef.current[card.id] =
          (cardAttemptsRef.current[card.id] ?? 0) + 1;
        cardRespSumRef.current[card.id] =
          (cardRespSumRef.current[card.id] ?? 0) + rt;
        if (correct)
          cardCorrectRef.current[card.id] =
            (cardCorrectRef.current[card.id] ?? 0) + 1;
        if (correct) {
          focusCurRef.current += 1;
          if (focusCurRef.current > focusMaxRef.current)
            focusMaxRef.current = focusCurRef.current;
        } else {
          focusCurRef.current = 0;
        }
        if (!correct && !errorQueueRef.current.includes(head)) {
          errorQueueRef.current = [...errorQueueRef.current, head];
        }
        setHistory((h) => [
          ...h,
          {
            word: settings.answerWith === "term" ? card.term : card.definition,
            correct,
          },
        ]);
      }
    }
    setPhase("feedback");
    if (correct) advanceTimer.current = setTimeout(() => next(true), 700);
  };

  const handleHint = () => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 5000);
  };

  const next = (correctArg?: boolean) => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    const ok = correctArg ?? wasCorrect;
    setValue("");
    setWasCorrect(false);
    setRetry(false);
    setShowHint(false);
    if (!cards) return;

    if (errorMode) {
      if (ok) {
        errorQueueRef.current = errorQueueRef.current.filter((i) => i !== head);
      }
      const rest = drillQueue.slice(1);
      setDrillQueue(rest);
      if (rest.length > 0) {
        setPhase("input");
        return;
      }
      if (finishing) {
        if (errorQueueRef.current.length === 0) {
          setErrorMode(false);
          setPhase("done");
        } else {
          startDrill();
        }
      } else {
        setErrorMode(false);
        setPhase("intermezzo");
      }
      return;
    }

    const id = cards[head].id;
    const mastered = (masteryRef.current[id] ?? 0) >= cap;
    const nextQueue = mastered ? queue.slice(1) : [...queue.slice(1), head];
    setQueue(nextQueue);

    if (nextQueue.length === 0) {
      setTotalAttempts(attemptsRef.current);
      setFinishing(true);
      setPhase("intermezzo");
      return;
    }

    if (attemptsRef.current % INTERVAL === 0) {
      if (errorQueueRef.current.length > 0) startDrill();
      else setPhase("intermezzo");
      return;
    }
    setPhase("input");
  };

  const advance = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    if (!wasCorrect && !errorMode && !retry) {
      setRetry(true);
      setValue("");
      setWasCorrect(false);
      setPhase("input");
      return;
    }
    next();
  };

  const advanceRef = useRef(advance);
  useEffect(() => {
    advanceRef.current = advance;
  });
  useEffect(() => {
    if (phase !== "feedback") return;
    const mountedAt = performance.now();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.repeat) return;
      if (performance.now() - mountedAt < 150) return;
      advanceRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  const restart = () => {
    if (!cards) return;
    viewsRef.current = {};
    masteryRef.current = {};
    attemptsRef.current = 0;
    correctRef.current = 0;
    errorQueueRef.current = [];
    lastSeenRef.current = null;
    durationBaseRef.current = 0;
    sessionStartMsRef.current = Date.now();
    prevAvgRef.current = 0;
    prevAttemptsRef.current = 0;
    respSumMsRef.current = 0;
    cardShownAtRef.current = Date.now();
    focusMaxRef.current = 0;
    focusCurRef.current = 0;
    cardAttemptsRef.current = {};
    cardCorrectRef.current = {};
    cardRespSumRef.current = {};
    completionsRef.current = 0;
    completionCountedRef.current = false;
    dirtyRef.current = true;
    // A restart zeroes every card, so all of them must be persisted.
    dirtyCardsRef.current = new Set(cards.map((c) => c.id));
    const resetQueue = cards
      .map((_, i) => i)
      .filter((i) => passesFlagged(cards[i].id));
    setQueue(resetQueue);
    setDrillQueue([]);
    setErrorMode(false);
    setTotalViews(0);
    setTotalAttempts(0);
    setHistory([]);
    setFinishing(false);
    setValue("");
    setWasCorrect(false);
    setRetry(false);
    setPhase(resetQueue.length === 0 ? "done" : "input");
    setShowHint(false);
  };

  const goBack = () => router.push("/studoset/" + setId);

  const { displayWord, corrector, img_url } = currentCard();
  const activeCards = flaggedFilter
    ? (cards ?? []).filter((c) => flaggedIds.has(c.id))
    : (cards ?? []);
  const goal = activeCards.length * cap;
  const reviewItems = history.slice(-INTERVAL);
  const doneCount = flaggedFilter
    ? (cards ?? []).filter((c) => flaggedIds.has(c.id)).length
    : (cards?.length ?? 0);

  return {
    ready: Boolean(cards && initialized),
    phase,
    goBack,
    restart,
    submit,
    handleHint,
    toggleImage,
    totalViews,
    goal,
    errorMode,
    reviewItems,
    doneCount,
    totalAttempts,
    displayWord,
    corrector,
    imgUrl: img_url,
    showImage,
    wasCorrect,
    showRevision: errorMode || retry,
    value,
    setValue,
    showHint,
  };
};
