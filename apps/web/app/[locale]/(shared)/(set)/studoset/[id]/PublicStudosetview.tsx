"use client";
import { Link } from "@/i18n/routing";
import CardList from "@/components/ui/app/shared/studosets/CardList";
import { FaRegHeart } from "react-icons/fa";
import SharePopup from "@/components/ui/app/shared/studosets/sharepopup";
import BottomCredits from "@/components/ui/design_system/bottom_credits/BottomCredits";
import Avatar from "@/components/ui/design_system/avatar/Avatar";
import { useTranslations } from "next-intl";
import { useSplash } from "@/components/providers/app/SplashProvider";
import { useToast } from "@/components/providers/app/ToastProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { usePublicStudoset } from "@/hooks/app/sets/usePublicStudoset";
import PublicFlashcardMode from "@/components/ui/app/shared/studosets/modes/flashcards/PublicFlashcardMode";

interface viewProps {
  id: string;
}

export default function PublicStudosetView({ id }: viewProps) {
  const t = useTranslations("studoset");
  const { setLoaded } = useSplash();
  const toast = useToast();
  const router = useRouter();
  const { data, isError, error } = usePublicStudoset(id);
  const { ref } = useInView();
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.cards) setLoaded(true);
  }, [data?.cards, setLoaded]);

  useEffect(() => {
    if (!isError) return;
    setLoaded(true);
    const is403 = (error as { status?: number })?.status === 403;
    toast.error(is403 ? t("set_private") : t("cant_load"));
    router.push("/home");
  }, [error, isError, router, setLoaded, t, toast]);
  const likes = useMemo(() => data?.likes ?? [], [data]);
  if (!data?.cards) return null;

  return (
    <div className={"relative w-full h-full px-10"}>
      <div
        ref={topRef}
        className="w-full h-fit flex flex-row items-center mb-3 justify-baseline gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap"
      >
        <span>{t("created")}</span>
        <Link
          href={`/profile/` + data?.userId}
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
          <SharePopup id={data.id} />
        </div>
      </div>
      <div className={"w-full h-fit flex flex-col gap-2 mb-3"}>
        <div className={"w-full flex flex-row gap-2 items-center"}>
          <div className={"pointer-events-none opacity-40"}>
            <FaRegHeart />
          </div>
          <span>
            {likes?.length} {likes?.length != 1 ? t("likes") : t("like")}
          </span>
        </div>
      </div>
      <div className="w-full h-fit flex flex-col gap-6 sm:gap-8 md:gap-10 justify-center pt-5 items-center">
        <hr className="w-full border-0.5 border-solid border-studoborder/30" />
        <div ref={ref} className={"relative w-full max-h-300 min-h-150 h-150 "}>
          <PublicFlashcardMode id={id} />
        </div>

        <hr className="w-full border-0.5 border-solid border-studoborder/30" />
        <div className={"w-full flex justify-between items-center"}>
          <span className="w-full h-fit font-bold text-sm sm:text-base">
            {t("cards_title")}:
          </span>
        </div>
        <CardList
          isPublic
          session={[]}
          cards={data?.cards ?? []}
          isOwner={false}
          setId={id}
        />
        <BottomCredits />
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
