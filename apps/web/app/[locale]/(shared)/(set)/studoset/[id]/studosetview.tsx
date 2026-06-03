"use client";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { SessionCardResponse } from "@studo/types";
import CardList from "@/components/ui/public/sets/studosets/CardList";
import { Progress } from "@/components/ui/marketing/progress/progress";
import { IoFolderOpenOutline } from "react-icons/io5";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import SavedPopup from "@/components/ui/public/sets/studosets/savedpopup";
import ClassroomPopup from "@/components/ui/public/sets/studosets/classroompopup";
import SharePopup from "@/components/ui/public/sets/studosets/sharepopup";
import SettingsPopup from "@/components/ui/public/sets/studosets/settingspopup";
import BottomCredits from "@/components/ui/design_system/bottom_credits/BottomCredits";
import Avatar from "@/components/ui/design_system/avatar/Avatar";
import LinkButton from "@/components/ui/design_system/button/LinkButton";
import { useTranslations } from "next-intl";
import { useStudoset } from "@/hooks/app/sets/useStudoset";
import { useUser } from "@/components/providers/auth/UserProvider";
import { useSplash } from "@/components/providers/app/SplashProvider";
import { useLikeStudoset } from "@/hooks/app/sets/useLikeStudoset";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FlashcardMode from "@/components/ui/shared/modes/flashcards/FlashcardMode";
import { TabSwitcher } from "@/components/ui/design_system/tabswitcher/TabSwitcher";
import { useInView } from "react-intersection-observer";
import JumpToBottom from "@/components/ui/app/create-studoset/JumpToBottom";
import EditToggle from "@/components/ui/public/sets/studosets/EditToggle";

interface viewProps {
  id: string;
}

type Tab = "learned" | "reviewed" | "not_learned" | "all";

export default function StudosetView({ id }: viewProps) {
  const t = useTranslations("studoset");
  const userId = useUser().user?.id;
  const { setLoaded } = useSplash();
  const { data, isPlaceholderData } = useStudoset(id);
  const [tab, setTab] = useState<Tab>("all");
  const { ref, inView } = useInView();
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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
  const { like, unlike } = useLikeStudoset(id, userId ?? "");
  const likes = useMemo(() => data?.likes ?? [], [data]);
  const liked = useMemo(
    () => likes.some((l) => l.user_id === userId),
    [likes, userId],
  );
  const toggleLike = () => {
    if (liked) unlike.mutate(data?.id);
    else like.mutate(data?.id);
  };
  if (!data?.cards) return null;
  const totalCards = data.cards.length;
  const sessionCards = isPlaceholderData
    ? null
    : (data?.session?.cards ?? null);

  const not_studied = sessionCards
    ? sessionCards.reduce(
        (sum: number, card: SessionCardResponse) =>
          card.card_viewcount === 0 ? sum + 1 : sum,
        0,
      )
    : totalCards;

  const reviewed = sessionCards
    ? sessionCards.reduce(
        (sum: number, card: SessionCardResponse) =>
          card.card_viewcount === 1 ? sum + 1 : sum,
        0,
      )
    : 0;

  const studied = sessionCards
    ? sessionCards.reduce(
        (sum: number, card: SessionCardResponse) =>
          card.card_viewcount > 1 ? sum + 1 : sum,
        0,
      )
    : 0;

  const isOwner = !!userId && userId === data?.user_id;

  return (
    <div className={"relative w-full h-full px-10"}>
      <div
        ref={topRef}
        className="w-full h-fit flex flex-row items-center mb-3 justify-baseline gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap"
      >
        <span>{t("created")}</span>
        <Link
          href={isOwner ? "/account" : `/profile/` + data?.user_id}
          className="flex flex-row w-fit h-fit rounded-full sm:rounded-4xl
                            gap-1.5 sm:gap-2 px-1 pr-3 py-1 l max-w-fit
                             bg-studogrey/30 border border-studoborder/30 shadow-2x
                            dark:text-white min-w-0"
        >
          <div className="min-h-4 max-h-4 min-w-4 justify-center items-center flex max-w-4 sm:min-h-5 sm:max-h-5 sm:min-w-5 sm:max-w-5 bg-emerald-400 overflow-hidden rounded-full shrink-0">
            <Avatar
              id={data?.user_id}
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
          <EditToggle id={id} />
          <SavedPopup setId={id} />
          <ClassroomPopup />
          <SharePopup />
          <SettingsPopup
            isOwner={isOwner}
            id={id}
            isPrivateSet={data.public_set}
          />
        </div>
      </div>
      <div className={"w-full h-fit flex flex-col gap-2 mb-3"}>
        {data?.folder_id && (
          <div className={"w-full flex flex-row gap-2 opacity-40 items-center"}>
            <IoFolderOpenOutline />
            <span>
              {t("saved_in")}: {data?.folders?.[0]?.name}
            </span>
          </div>
        )}
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
              {t("added_to")}: {data?.classrooms[0]?.name}
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
      <div className="w-full h-fit flex flex-col gap-6 sm:gap-8 md:gap-10 justify-center pt-5 items-center">
        <hr className="w-full border-0.5 border-solid border-studoborder/30" />
        <div className="w-full grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-3">
          <LinkButton
            href={`/learn/` + id}
            icon={
              <Image
                width={20}
                height={20}
                src={"/icons/pencil.svg"}
                alt=""
                className="h-4 sm:h-5 dark:invert dark:brightness-0 shrink-0"
              />
            }
            label={t("learn")}
            type="button"
            variant="outline_link"
          />
          <LinkButton
            href={`/speedy/` + id}
            className="w-full"
            icon={
              <Image
                width={20}
                height={20}
                src={"/icons/clock.svg"}
                alt=""
                className="h-4 sm:h-5 dark:invert dark:brightness-0 shrink-0"
              />
            }
            label={t("speedy")}
            type="button"
            variant="outline_link"
          />
          <LinkButton
            href={`/flashcards/${id}`}
            icon={
              <Image
                width={20}
                height={20}
                src="/icons/cards.svg"
                alt=""
                className="h-4 sm:h-5 dark:invert dark:brightness-0 shrink-0"
              />
            }
            label={t("flashcards")}
            type="button"
            variant="outline_link"
          />
        </div>
        <hr className="w-full border-0.5 border-solid border-studoborder/30" />
        <div ref={ref} className={"w-full max-h-300 min-h-130 h-165 "}>
          <FlashcardMode id={id} isHome />
        </div>

        <hr className="w-full border-0.5 border-solid border-studoborder/30" />
        <span className="w-full h-fit font-bold text-sm sm:text-base">
          {t("progress_title")}:
        </span>
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          <div
            className={
              "w-full h-full p-5 border border-studoborder/30 rounded-3xl bg-studogrey/30 flex flex-col items-center justify-center gap-2"
            }
          >
            <span className={"font-bold"}>{t("not_learned")}</span>
            <Progress length={totalCards} progress={not_studied} />
          </div>
          <div
            className={
              "w-full h-full p-5 border border-studoborder/30 rounded-3xl bg-studogrey/30 flex flex-col items-center justify-center gap-2"
            }
          >
            <span className={"font-bold"}>{t("reviewed")}</span>
            <Progress length={totalCards} progress={reviewed} />
          </div>
          <div
            className={
              "w-full h-full p-5 border border-studoborder/30 rounded-3xl bg-studogrey/30 flex flex-col items-center justify-center gap-2"
            }
          >
            <span className={"font-bold"}>{t("studied")}</span>
            <Progress length={totalCards} progress={studied} />
          </div>
        </div>

        <hr className="w-full border-0.5 border-solid border-studoborder/30" />
        <div className={"w-full flex justify-between items-center"}>
          <span className="w-full h-fit font-bold text-sm sm:text-base">
            {t("cards_title")}:
          </span>
          <div className={"flex flex-row gap-2 items-center justify-center"}>
            <TabSwitcher
              size={"sm"}
              tabs={[
                {
                  key: "all",
                  label: t("all"),
                },
                {
                  key: "not_learned",
                  label: t("ns"),
                },
              ]}
              value={tab}
              onChange={(key) => {
                setTab(key as Tab);
              }}
            />
          </div>
        </div>
        <CardList cards={data?.cards ?? []} isOwner={isOwner} setId={id} />
        <BottomCredits />
        <div ref={bottomRef} />
      </div>
      {!inView && (
        <JumpToBottom jumpToTop={jumpToTop} jumpToBottom={jumpToBottom} />
      )}
    </div>
  );
}
