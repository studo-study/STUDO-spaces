"use client";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { SessionCardResponse } from "@studo/types";
import CardList from "@/components/ui/app/shared/studosets/CardList";
import { Progress } from "@/components/ui/app/shared/studosets/progress/progress";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import SharePopup from "@/components/ui/app/shared/studosets/sharepopup";
import SettingsPopup from "@/components/ui/app/shared/studosets/settingspopup";
import BottomCredits from "@/components/ui/design_system/bottom_credits/BottomCredits";
import Avatar from "@/components/ui/design_system/avatar/Avatar";
import LinkButton from "@/components/ui/design_system/button/LinkButton";
import { useTranslations } from "next-intl";
import { useStudoset } from "@/hooks/app/sets/useStudoset";
import { useStudosetStore } from "@/store/slices/studoset/studosetStore";
import { useUser } from "@/components/providers/auth/UserProvider";
import { useSplash } from "@/components/providers/app/SplashProvider";
import { useToast } from "@/components/providers/app/ToastProvider";
import { useRouter } from "next/navigation";
import { useLikeStudoset } from "@/hooks/app/sets/useLikeStudoset";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FlashcardMode from "@/components/ui/app/shared/studosets/modes/flashcards/FlashcardMode";
import { SegmentedControls } from "@/components/ui/design_system/segmentedcontrols/SegmentedControls";
import { useInView } from "react-intersection-observer";
import JumpToBottom from "@/components/ui/app/private/create-studoset/JumpToBottom";
import EditToggle from "@/components/ui/app/shared/studosets/EditToggle";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import { pomodoroStore } from "@/store/course_context_menu/PomodoroStore";
import { useLearnStore } from "@/app/[locale]/(shared)/(modes)/learn/[id]/learnStore";
import classNames from "@/utils/classnames";
import ProgressPopUpTrigger from "@/components/ui/app/shared/studosets/ProgressPopUp";
import SvenMessage from "@/components/ui/app/shared/studosets/SvenMessage";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";
import { CreditCard, Pencil, Zap } from "lucide-react";

interface viewProps {
  id: string;
}

type Tab = "all" | "flagged";
type Filter = "learned" | "reviewed" | "not_learned" | "all";

const LEARN_OPTIONS = [
  {
    href: "/learn/",
    icon: Pencil,
    color: "bg-emerald-700 text-emerald-300",
    label: "learn",
    desc: "learn_desc",
  },
  {
    href: "/speedy/",
    icon: Zap,
    color: "bg-amber-500 text-amber-50",
    label: "speedy",
    desc: "speedy_desc",
  },
  {
    href: "/flashcards/",
    icon: CreditCard,
    color: "bg-blue-500 text-blue-100",
    label: "flashcards",
    desc: "flashcards_desc",
  },
];
export default function StudosetView({ id }: viewProps) {
  const t = useTranslations("studoset");
  const userId = useUser().user?.id;
  const { setLoaded } = useSplash();
  const toast = useToast();
  const router = useRouter();
  const { data, isPlaceholderData, isError, error } = useStudoset(id);
  const [filter, setFilter] = useState<Filter>("all");
  const { ref, inView } = useInView();
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const learnSettings = useLearnStore((state) => state.learnSettings);
  const StudoSession = useStudosetStore((state) => state.studosetSession);
  const [showMessage] = useState(false);
  // init tab uit de store zodat de tab-visual matcht met de opgeslagen setting
  const [tab, setTab] = useState<Tab>(
    learnSettings.flaggedMode ? "flagged" : "all",
  );

  useCourseNav([
    {
      title: data?.title ?? "",
      href: `/studoset/${id}`,
      isLast: true,
      translate: false,
    },
  ]);

  const jumpToTop = () => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const jumpToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (data?.cards) setLoaded(true);
  }, [data?.cards, setLoaded]);

  // session-level stats naar de store (voor de progress-popup)
  const setStudosetSession = useStudosetStore((s) => s.setStudosetSession);
  useEffect(() => {
    setStudosetSession(data?.session);
  }, [data?.session, setStudosetSession]);

  // Reset the pomodoro when leaving the studoset page.
  useEffect(() => {
    return () => pomodoroStore.getState().reset();
  }, []);

  useEffect(() => {
    if (!isError) return;
    setLoaded(true);
    const is403 = (error as { status?: number })?.status === 403;
    toast.error(is403 ? t("set_private") : t("cant_load"));
    router.push("/home");
  }, [error, isError, router, setLoaded, t, toast]);

  const { like, unlike } = useLikeStudoset(id, userId ?? "");
  const likes = useMemo(() => data?.likes ?? [], [data]);
  const liked = useMemo(
    () => likes.some((l) => l.userId === userId),
    [likes, userId],
  );
  const toggleLike = () => {
    if (liked) unlike.mutate(data?.id);
    else like.mutate(data?.id);
  };

  const totalCards = data?.cards?.length;
  const sessionCards = isPlaceholderData
    ? null
    : (data?.session?.cards ?? null);

  const filteredCards = useMemo(() => {
    const get = (id: string) => sessionCards?.find((s) => s.cardId === id);
    let cards = data?.cards ?? [];

    if (filter === "not_learned")
      cards = cards.filter((c) => (get(c.id)?.cardViewcount ?? 0) === 0);
    else if (filter === "reviewed")
      cards = cards.filter((c) => get(c.id)?.cardViewcount === 1);
    else if (filter === "learned")
      cards = cards.filter((c) => (get(c.id)?.cardViewcount ?? 0) >= 2);

    if (tab === "flagged") cards = cards.filter((c) => get(c.id)?.flagged);

    return cards;
  }, [tab, filter, data?.cards, sessionCards]);

  const { not_studied, reviewed, studied } = useMemo(() => {
    if (!sessionCards) {
      return { not_studied: totalCards ?? 0, reviewed: 0, studied: 0 };
    }
    return sessionCards.reduce(
      (acc, card: SessionCardResponse) => {
        if (card.cardViewcount === 0) acc.not_studied += 1;
        else if (card.cardViewcount === 1) acc.reviewed += 1;
        else acc.studied += 1;
        return acc;
      },
      { not_studied: 0, reviewed: 0, studied: 0 },
    );
  }, [sessionCards, totalCards]);

  const isOwner = !!userId && userId === data?.userId;

  const toggleTab = (input: string) => {
    if (filter === (input as Filter)) {
      setFilter("all");
    } else {
      setFilter(input as Filter);
    }
  };

  if (!data?.cards) return null;

  return (
    <div className={"relative w-full h-full px-10"}>
      <div
        ref={topRef}
        className="w-full h-fit flex flex-row items-center mb-3 justify-baseline gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap"
      >
        <span>{t("created")}</span>
        <Link
          href={isOwner ? "/account" : `/profile/` + data?.userId}
          className="flex flex-row w-fit h-fit rounded-full sm:rounded-4xl
                            gap-1.5 sm:gap-2 px-1 pr-3 py-1 l max-w-fit
                             bg-studogrey/30 border border-studoborder/30 shadow-2x
                            dark:text-white min-w-0"
        >
          <div className="min-h-4 max-h-4 min-w-4 justify-center items-center flex max-w-4 sm:min-h-5 sm:max-h-5 sm:min-w-5 sm:max-w-5 bg-emerald-400 overflow-hidden rounded-full shrink-0">
            <Avatar
              id={data?.userId}
              displayName={data?.displayName}
              size={25}
            />
          </div>
          <span className="opacity-50 text-xs sm:text-sm truncate hover:underline">
            @{data?.displayName}
          </span>
        </Link>
      </div>
      <div className="w-full mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <span className="w-full sm:w-2/3 flex flex-row items-center justify-baseline text-2xl sm:text-3xl md:text-4xl font-semibold truncate">
          {(data && data.title) || t("set_title")}
        </span>
        <div className="w-full sm:w-1/3 flex h-full gap-2 sm:gap-3 flex-row items-center justify-start sm:justify-end flex-wrap">
          {isOwner && (
            <BaseTooltip content={t("edit")}>
              <EditToggle id={id} />
            </BaseTooltip>
          )}
          <BaseTooltip content={t("share")}>
            <SharePopup id={id} />
          </BaseTooltip>

          <BaseTooltip content={t("settings")}>
            <SettingsPopup
              isOwner={isOwner}
              id={id}
              isPrivateSet={data.publicSet}
              sessionId={data.session?.id}
            />
          </BaseTooltip>
        </div>
      </div>
      <div className={"w-full h-fit flex flex-col gap-2 mb-3"}>
        {data?.classrooms?.[0] && (
          <div className={"w-full flex flex-row gap-2 opacity-40 items-center"}>
            <Image
              src={"/icons/classroom.svg"}
              alt={"studeerhoed"}
              width={17}
              height={0}
              className="min-h-4 h-5 sm:min-h-5 dark:invert dark:brightness-0"
            />
            <span>
              {t("added_to")}:{" "}
              <Link
                href={"/classroom/" + data?.classrooms[0].id}
                className={"hover:underline"}
              >
                {data?.classrooms[0]?.name}
              </Link>
            </span>
          </div>
        )}
        <div className={"w-full flex flex-row gap-2 items-center"}>
          <div
            onClick={() => {
              toggleLike();
            }}
            className={`${isOwner ? "pointer-events-none opacity-40" : "cursor-pointer active:scale-95 transition-all duration-300"}`}
          >
            {liked ? <FaHeart className={"text-rose-500"} /> : <FaRegHeart />}
          </div>
          <span>
            {likes?.length} {likes?.length != 1 ? t("likes") : t("like")}
          </span>
        </div>
      </div>
      {showMessage && <SvenMessage />}
      <div className="w-full h-fit flex flex-col gap-5 justify-center pt-5 items-center">
        <hr className="w-full border-0.5 border-solid border-studoborder/30" />
        <div className={"flex flex-col gap-2 w-full h-fit"}>
          <div className="w-full grid gap-3 grid-cols-1 sm:grid-cols-3">
            {LEARN_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <Link
                  href={option.href + id}
                  key={option.label}
                  className={
                    "w-full p-2 flex transition-colors bg-studogrey/30 hover:border-studoborder duration-300 items-center justify-center flex-row gap-2 border border-studogrey/30 rounded-full"
                  }
                >
                  <div
                    className={classNames(
                      "rounded-full shadow-lg h-12 w-12 max-w-12 max-h-12 flex justify-center items-center",
                      option.color,
                    )}
                  >
                    <Icon size={20} />
                  </div>
                  <div className={"flex flex-col min-w-0 flex-1"}>
                    <span
                      className={
                        "dark:text-white capitalize text-lg font-bold text-studodarkblue"
                      }
                    >
                      {t(option.label)}
                    </span>
                    <span className={"text-sm text-studogrey/75"}>
                      {t(option.desc)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <hr className="w-full mb-8  border-0.5 border-solid border-studoborder/30" />
        <div ref={ref} className={"w-full max-h-300 p-0 min-h-130 h-190 "}>
          <FlashcardMode id={id} isHome />
        </div>

        <hr className="w-full border-0.5 border-solid border-studoborder/30" />
        <div className={"flex items-center justify-between w-full"}>
          <span className="w-full h-fit font-bold text-sm sm:text-base">
            {t("progress_title")}
          </span>
          {(StudoSession?.completions ?? 0) >= 1 && (
            <BaseTooltip content={t("progress_visualized")} z={999}>
              <ProgressPopUpTrigger />
            </BaseTooltip>
          )}
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          <div
            onClick={() => toggleTab("not_learned")}
            className={classNames(
              filter !== "all" && filter !== "not_learned"
                ? "opacity-50"
                : null,
              "w-full select-none h-full cursor-pointer p-5 transition-[opacity, colors] duration-300 border border-studoborder/30 hover:border-studoborder rounded-3xl bg-studogrey/30 flex flex-col items-center justify-center gap-2",
            )}
          >
            <span className={"font-bold"}>{t("not_learned")}</span>
            <Progress
              length={totalCards ?? 0}
              progress={not_studied ?? 0}
              reverse
            />
          </div>
          <div
            onClick={() => toggleTab("reviewed")}
            className={classNames(
              filter !== "all" && filter !== "reviewed" ? "opacity-50" : null,
              "w-full select-none h-full cursor-pointer p-5 transition-[colors, opacity] duration-300  border border-studoborder/30 hover:border-studoborder rounded-3xl bg-studogrey/30 flex flex-col items-center justify-center gap-2",
            )}
          >
            <span className={"font-bold"}>{t("reviewed")}</span>
            <Progress length={totalCards ?? 0} progress={reviewed} reverse />
          </div>
          <div
            onClick={() => toggleTab("learned")}
            className={classNames(
              filter !== "all" && filter !== "learned" ? "opacity-50" : null,
              "w-full select-none h-full cursor-pointer p-5 transition-[opacity, colors]  duration-300 border border-studoborder/30 hover:border-studoborder rounded-3xl bg-studogrey/30 flex flex-col items-center justify-center gap-2",
            )}
          >
            <span className={"font-bold"}>{t("studied")}</span>
            <Progress length={totalCards ?? 0} progress={studied} />
          </div>
        </div>

        <hr className="w-full border-0.5 border-solid border-studoborder/30" />
        <div className={"w-full flex justify-between items-center"}>
          <span className="w-full h-fit font-bold text-sm sm:text-base">
            {t("cards_title")}: ({filteredCards?.length})
          </span>
          <div className={"flex flex-row gap-2 items-center justify-center"}>
            <SegmentedControls
              size={"sm"}
              tabs={[
                {
                  key: "all",
                  label: t("all"),
                },
                {
                  key: "flagged",
                  label: t("flag"),
                },
              ]}
              value={tab}
              onChange={(key) => {
                setTab(key as Tab);
                learnSettings.setFlaggedMode(key === "flagged");
              }}
            />
          </div>
        </div>
        <CardList
          cards={filteredCards}
          session={sessionCards ?? []}
          isOwner={isOwner}
          setId={id}
        />
        <BottomCredits />
        <div ref={bottomRef} />
      </div>
      {!inView && (
        <JumpToBottom jumpToTop={jumpToTop} jumpToBottom={jumpToBottom} />
      )}
    </div>
  );
}
