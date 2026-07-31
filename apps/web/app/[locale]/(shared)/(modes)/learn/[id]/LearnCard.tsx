"use client";
import "animate.css";
import ProgressBar from "@/components/ui/app/shared/profile/(modes)/learn/progressbar";
import classnames from "@/utils/classnames";
import { useLearnStore } from "@/app/[locale]/(shared)/(modes)/learn/[id]/learnStore";
import { useStudoset } from "@/hooks/app/sets/useStudoset";
import { useCallback, useEffect, useRef, useState } from "react";
import IntermezzoBar from "@/components/ui/app/shared/profile/(modes)/learn/IntermezzoBar";
import InterMezzoScreen from "@/components/ui/app/shared/profile/(modes)/learn/InterMezzoScreen";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { IoArrowBackOutline } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";
import { useUpdateSession } from "@/hooks/app/session/useUpdateSession";
import { useQueryClient } from "@tanstack/react-query";
import type { UpdateStudysession } from "@studo/types";
import { ArrowRight, CircleQuestionMark, Eye } from "lucide-react";

const normalize = (input: string) =>
  input.trim().toLowerCase().replace(/\s+/g, " ");

// intermezzo elke INTERVAL beurten
const INTERVAL = 5;

export type Phase = "input" | "feedback" | "intermezzo" | "done";

const LearnCard = () => {
  //data
  const Router = useRouter();
  const setId = useLearnStore((state) => state.setId);
  const settings = useLearnStore((state) => state.learnSettings);
  const set = useStudoset(setId!).data;
  const cards = set?.cards;
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("learn");
  // checkpoints niet invalideren (zou elke keer de hele set refetchen)
  const updateSession = useUpdateSession(set?.session?.id ?? "", setId ?? "", {
    invalidateOnSettled: false,
  });

  // een kaart is geleerd na `cap` juiste beurten (variabel via settings)
  const cap = Math.max(1, settings.revisionCount);

  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [wasCorrect, setWasCorrect] = useState(false);
  // herhaal-beurt: na een fout antwoord de kaart direct nog eens intypen
  const [retry, setRetry] = useState(false);
  // queue van kaart-indices die nog gemasterd moeten worden; head = huidige kaart
  const [queue, setQueue] = useState<number[]>([]);
  // huidige drill-pass (snapshot van de errorqueue) → stuurt de getoonde kaart
  const [drillQueue, setDrillQueue] = useState<number[]>([]);
  const [errorMode, setErrorMode] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [finishing, setFinishing] = useState(false);
  // aantal beurten bij afronden (snapshot voor done-scherm)
  const [totalAttempts, setTotalAttempts] = useState(0);
  // totaal aantal juiste views (voortgang richting cards.length * cap)
  const [totalViews, setTotalViews] = useState(0);
  const [showImage, setShowImage] = useState<boolean>(true);
  const toggleImage = () => {
    setShowImage((prev) => !prev);
  };
  // laatste beurten voor de terugblik ({woord, juist})
  const [history, setHistory] = useState<{ word: string; correct: boolean }[]>(
    [],
  );

  // juiste-view-teller per cardId (ref → synchroon, geen stale closure)
  const viewsRef = useRef<Record<string, number>>({});
  const attemptsRef = useRef(0);
  // persistente errorqueue: foute kaarten, na elke 5 één keer overlopen
  const errorQueueRef = useRef<number[]>([]);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // sync-boekhouding
  const correctRef = useRef(0); // alle juiste antwoorden (voor accuracy)
  const lastSeenRef = useRef<string | null>(null); // laatst getoonde cardId
  const dirtyRef = useRef(false); // iets te syncen sinds laatste flush?
  const flushRef = useRef<() => void>(() => {});

  // init zodra de kaarten geladen zijn (render-time, geen effect).
  // resume-on-load: seed voortgang uit de bestaande session-cards.
  if (cards && !initialized) {
    setInitialized(true);
    const scById = new Map(
      (set?.session?.cards ?? []).map((sc) => [sc.cardId, sc.cardViewcount]),
    );
    const views: Record<string, number> = {};
    let seededViews = 0;
    cards.forEach((c) => {
      const vc = scById.get(c.id) ?? 0;
      views[c.id] = vc;
      seededViews += Math.min(vc, cap);
    });
    // eenmalige seeding (guarded door `initialized`) → veilig in render
    viewsRef.current = views;
    setTotalViews(seededViews);
    const seededQueue = cards
      .map((_, i) => i)
      .filter((i) => (views[cards[i].id] ?? 0) < cap);
    // resume op de laatst geziene kaart: roteer de queue zodat die vooraan staat
    const lastSeen = set?.session?.lastSeen;
    const startPos = lastSeen
      ? seededQueue.findIndex((i) => cards[i].id === lastSeen)
      : -1;
    const orderedQueue =
      startPos > 0
        ? [...seededQueue.slice(startPos), ...seededQueue.slice(0, startPos)]
        : seededQueue;
    setQueue(orderedQueue);
    // al volledig geleerd → meteen done
    if (seededQueue.length === 0) setPhase("done");
  }

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  // checkpoint: sync bij elk intermezzo en bij done
  useEffect(() => {
    if (phase === "intermezzo" || phase === "done") flushRef.current?.();
    // enkel bij done de set-query verversen (studoset-pagina fris)
    if (phase === "done" && setId) {
      queryClient.invalidateQueries({ queryKey: ["studosets", setId] });
    }
  }, [phase, setId, queryClient]);

  // start een drill-pass: snapshot van de errorqueue, elke kaart één keer
  const startDrill = () => {
    setDrillQueue([...errorQueueRef.current]);
    setErrorMode(true);
    setValue("");
    setWasCorrect(false);
    setRetry(false);
    setPhase("input");
  };

  // in intermezzo: Enter → verder (geen input-veld gefocust)
  useEffect(() => {
    if (phase !== "intermezzo") return;
    const mountedAt = performance.now();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      // negeer de Enter die 't intermezzo opende (fout-antwoord) + keyrepeat
      if (e.repeat || performance.now() - mountedAt < 300) return;
      if (finishing) {
        // na het laatste intermezzo: errorqueue leeglopen, dan done
        if (errorQueueRef.current.length === 0) setPhase("done");
        else startDrill();
      } else {
        setPhase("input");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finishing]);

  // huidige kaart: in drill uit de drillQueue, anders uit de hoofdqueue
  const head = errorMode ? drillQueue[0] : queue[0];
  const currentCard = useCallback(() => {
    const card = cards?.[head];
    return {
      img_url: card?.suggestionImage?.displayUrl,
      displayWord:
        settings.answerWith === "term" ? card?.definition : card?.term,
      corrector: settings.answerWith === "term" ? card?.term : card?.definition,
    };
  }, [head, cards, settings.answerWith]);

  // flush de lokale voortgang naar de backend (idempotent → checkpoints veilig)
  const doFlush = () => {
    const session = set?.session;
    if (!session?.id || !cards || !dirtyRef.current) return;
    const scByCardId = new Map(
      (session.cards ?? []).map((sc) => [sc.cardId, sc.id]),
    );
    const cardUpdates = cards.flatMap((c) => {
      const scId = scByCardId.get(c.id);
      if (!scId) return [];
      const vc = viewsRef.current[c.id] ?? 0;
      return [
        {
          id: scId,
          number: c.number,
          cardViewcount: vc,
          mastered: vc >= cap,
          inQueue: vc < cap,
        },
      ];
    });
    const index = cards.reduce(
      (s, c) => s + Math.min(viewsRef.current[c.id] ?? 0, cap),
      0,
    );
    const attempts = attemptsRef.current;
    const body: UpdateStudysession = {
      userId: session.userId,
      index,
      accuracy:
        attempts > 0 ? Math.round((correctRef.current / attempts) * 100) : 0,
      lastStudied: new Date().toISOString(),
      ...(lastSeenRef.current ? { lastSeen: lastSeenRef.current } : {}),
      cards: cardUpdates,
    };
    dirtyRef.current = false;
    updateSession.mutate(body, {
      onError: () => {
        dirtyRef.current = true; // mislukt → volgende keer opnieuw proberen
      },
    });
  };

  // houd flushRef actueel + flush bij pagina verlaten/unmount
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
      // set-query stale maken → volgende bezoek toont verse voortgang
      if (setId)
        queryClient.invalidateQueries({ queryKey: ["studosets", setId] });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
    const card = cards?.[head];
    const { corrector } = currentCard();
    if (!card || !corrector) return;
    const correct = normalize(value) === normalize(corrector);
    setWasCorrect(correct);
    lastSeenRef.current = card.id;
    dirtyRef.current = true;
    // herhaal-beurt telt niet mee voor scoring — enkel opnieuw intypen
    if (!retry) {
      // accuracy enkel op hoofdbeurten (net als attempts) → geen >100%
      if (correct && !errorMode) correctRef.current += 1;
      // enkel juiste beurten tellen mee voor mastery (cap-guard → geen overshoot)
      if (correct && (viewsRef.current[card.id] ?? 0) < cap) {
        viewsRef.current[card.id] = (viewsRef.current[card.id] ?? 0) + 1;
        setTotalViews((tv) => tv + 1);
      }
      if (!errorMode) {
        attemptsRef.current += 1;
        // fout → toevoegen aan de persistente errorqueue (dedup)
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
    // juist → auto-verder (correctheid expliciet doorgeven i.v.m. stale closure)
    if (correct) advanceTimer.current = setTimeout(() => next(true), 700);
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
    if (!cards) return;

    // --- drill-pass: elke errorqueue-kaart één keer ---
    if (errorMode) {
      // juist → uit de errorqueue; fout → blijft staan (volgend intermezzo terug)
      if (ok) {
        errorQueueRef.current = errorQueueRef.current.filter((i) => i !== head);
      }
      const rest = drillQueue.slice(1);
      setDrillQueue(rest);
      if (rest.length > 0) {
        setPhase("input"); // pass verder
        return;
      }
      // pass klaar
      if (finishing) {
        // einde: errorqueue leeglopen — nog niet leeg? nieuwe pass, anders done
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

    // --- hoofdqueue ---
    const id = cards[head].id;
    const mastered = (viewsRef.current[id] ?? 0) >= cap;
    // gemasterd → uit queue; anders achteraan opnieuw
    const nextQueue = mastered ? queue.slice(1) : [...queue.slice(1), head];
    setQueue(nextQueue);

    // hele set gemasterd → laatste terugblik, dan errorqueue leeglopen
    if (nextQueue.length === 0) {
      setTotalAttempts(attemptsRef.current);
      setFinishing(true);
      setPhase("intermezzo");
      return;
    }

    // batchgrens elke INTERVAL beurten: eerst errorqueue-pass (indien niet leeg),
    // dan het intermezzo
    if (attemptsRef.current % INTERVAL === 0) {
      if (errorQueueRef.current.length > 0) startDrill();
      else setPhase("intermezzo");
      return;
    }
    setPhase("input");
  };

  // Enter in feedback: fout in hoofdmodus → kaart direct nog eens intypen
  // (herhaal-beurt). Al herhaald of juist → door naar volgende.
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

  const restart = () => {
    if (!cards) return;
    viewsRef.current = {};
    attemptsRef.current = 0;
    correctRef.current = 0;
    errorQueueRef.current = [];
    lastSeenRef.current = null;
    dirtyRef.current = true; // reset ook naar de backend syncen
    setQueue(cards.map((_, i) => i));
    setDrillQueue([]);
    setErrorMode(false);
    setTotalViews(0);
    setTotalAttempts(0);
    setHistory([]);
    setFinishing(false);
    setValue("");
    setWasCorrect(false);
    setRetry(false);
    setPhase("input");
  };

  if (!cards || !initialized) {
    return (
      <>
        <div className={"max-w-200 flex flex-row"}>
          <BaseButton
            size="sm"
            variant="icon"
            onClick={() => Router.push("/studoset/" + setId)}
          >
            <IoArrowBackOutline />
          </BaseButton>
        </div>
        <div className="w-200 h-150 flex items-center justify-center text-studogrey">
          ...
        </div>
      </>
    );
  }

  if (phase === "done") {
    return (
      <div className={"flex flex-col gap-10"}>
        <div className={"max-w-200 flex flex-row"}>
          <BaseButton
            size="sm"
            variant="icon"
            onClick={() => Router.push("/studoset/" + setId)}
          >
            <IoArrowBackOutline />
          </BaseButton>
        </div>
        <AnimateOnMount>
          <div className={"w-200 h-150 relative"}>
            <div
              className={
                "side-a animate__fadeInLeft animate__animate backface-hidden top-0 left-0 absolute w-full shadow-2xl h-full flex items-center justify-center rounded-4xl border border-studoborder/30 bg-linear-45 from-studogrey/30 to to-zinc-200/30 dark:to-zinc-400/20"
              }
            >
              <div className={"firework"} />
              <div className={"firework"} />
              <div className={"firework"} />

              <AnimateOnMount
                className={
                  "w-fit flex flex-col gap-5 items-center justify-center"
                }
              >
                <div
                  className={"gap-2 flex-col flex items-center justify-center"}
                >
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
                  <span className={"text-studogrey"}>
                    {cards.length} kaarten in {totalAttempts} beurten
                  </span>
                </div>

                <div className={"w-fit flex flex-row gap-2"}>
                  <BaseButton
                    size={"sm"}
                    type={"button"}
                    variant={"submit"}
                    iconLeft={<IoArrowBackOutline />}
                    label={t("back")}
                    onClick={() => router.push("/studoset/" + setId)}
                  />
                  <BaseButton
                    size={"sm"}
                    type={"button"}
                    variant={"primary"}
                    iconLeft={<GrPowerReset />}
                    label={t("restart")}
                    onClick={restart}
                  />
                </div>
              </AnimateOnMount>
            </div>
          </div>
        </AnimateOnMount>
      </div>
    );
  }

  const { displayWord, corrector } = currentCard();

  // voortgang richting doel = alle kaarten cap× juist
  const goal = cards.length * cap;
  const reviewItems = history.slice(-INTERVAL);
  return (
    <div className={"flex flex-col gap-10"}>
      <div className={"max-w-200 flex flex-row"}>
        <BaseButton
          size="sm"
          variant="icon"
          onClick={() => Router.push("/studoset/" + setId)}
        >
          <IoArrowBackOutline />
        </BaseButton>
      </div>
      <div
        className={
          "w-200 h-150 bg-studogrey/30 border shadow-lg border-studoborder/30 hover:border-studoborder transition-colors duration-300 rounded-4xl flex flex-col justify-between gap-3 p-3"
        }
      >
        <div
          className={"px-5 h-17 flex items-center bg-studogrey/20 rounded-3xl"}
        >
          {phase === "intermezzo" ? (
            <IntermezzoBar completedCards={totalViews} setLength={goal} />
          ) : (
            <ProgressBar
              cardLength={goal}
              cardIndex={totalViews}
              phase={phase}
              errorMode={errorMode}
            />
          )}
        </div>
        {phase === "intermezzo" ? (
          <InterMezzoScreen items={reviewItems} />
        ) : (
          <>
            <div
              className={
                "min-w-0 min-h-0 pt-10 flex-1 flex flex-col items-center justify-center gap-4"
              }
            >
              {(errorMode || retry) && (
                <span className={"text-sm font-bold uppercase text-amber-500"}>
                  {t("revision")}
                </span>
              )}
              {currentCard().img_url ? (
                <div
                  className={
                    "h-full flex justify-center items-center cursor-pointer"
                  }
                  onClick={toggleImage}
                >
                  {showImage && currentCard()?.img_url ? (
                    <div
                      className={"overflow-hidden h-full min-w-fit rounded-3xl"}
                    >
                      <Image
                        src={currentCard()!.img_url!}
                        alt={"image"}
                        width={200}
                        height={200}
                        className={"h-full"}
                      />
                    </div>
                  ) : (
                    <span className={"text-3xl font-semibold font-georgia"}>
                      {displayWord}
                    </span>
                  )}
                </div>
              ) : (
                <span className={"text-3xl font-semibold font-georgia"}>
                  {displayWord}
                </span>
              )}
              {phase === "feedback" && (
                <span
                  className={classnames(
                    "text-xl font-medium",
                    !wasCorrect ? "text-rose-500" : "text-emerald-500",
                  )}
                >
                  {corrector}
                </span>
              )}
            </div>
            <div className={"flex flex-col"}>
              <div
                className={
                  "h-10 pl-5 mb-2 flex flex-row justify-between items-center"
                }
              >
                <div>
                  {phase === "feedback" && !wasCorrect && (
                    <span
                      className={"text-sm dark:text-studogrey text-black/30"}
                    >
                      {t("enter_continue")}
                    </span>
                  )}
                  {}
                </div>
                <div className={"flex flex-row gap-1 w-fit"}>
                  <BaseButton
                    size={"sm"}
                    variant={"outline_link"}
                    className={"truncate"}
                    iconLeft={<CircleQuestionMark size={15} />}
                  >
                    {t("hint")}
                  </BaseButton>
                  <BaseButton
                    size={"sm"}
                    variant={"outline_link"}
                    className={"truncate"}
                    iconLeft={<ArrowRight size={15} />}
                  >
                    {t("next")}
                  </BaseButton>
                </div>
              </div>
              <div
                className={classnames(
                  "w-full focus-within:ring-2 h-15 rounded-3xl bg-studogrey/30 px-5 flex items-center flex-row",
                  phase === "feedback"
                    ? wasCorrect
                      ? "ring-2 ring-emerald-500 bg-emerald-800/30"
                      : "ring-2 ring-rose-500 bg-rose-800/30"
                    : errorMode || retry
                      ? "ring-amber-500"
                      : "ring-studoblue",
                )}
              >
                <input
                  autoFocus
                  className={"outline-none w-full bg-transparent"}
                  placeholder={t("type_answer")}
                  value={value}
                  readOnly={phase === "feedback"}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    if (phase === "input") submit();
                    else advance();
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

LearnCard.displayName = "LearnCard";
export default LearnCard;
