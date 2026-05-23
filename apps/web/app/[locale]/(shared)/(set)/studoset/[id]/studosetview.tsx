"use client";
import Flashcard from "@/components/ui/public/sets/studosets/flashcard";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { SessionCardResponse } from "@studo/types";
import CardList from "@/components/ui/public/sets/studosets/CardList";
import { Progress } from "@/components/ui/marketing/progress/progress";
import { IoFilter, IoFolderOpenOutline } from "react-icons/io5";
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
import { useEffect, useMemo } from "react";

interface viewProps {
  id: string;
}
export default function StudosetView({ id }: viewProps) {
  const t = useTranslations("studoset");
  const userId = useUser().user?.id;
  const speedy = false;
  const learn = false;
  const { setLoaded } = useSplash();
  const { data } = useStudoset(id);
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
  const not_studied =
    data?.session?.cards?.reduce((sum: number, card: SessionCardResponse) => {
      return card.card_viewcount === 0 ? sum + 1 : sum;
    }, 0) ?? 0;

  const reviewed =
    data?.session?.cards?.reduce((sum: number, card: SessionCardResponse) => {
      return card.card_viewcount === 1 ? sum + 1 : sum;
    }, 0) ?? 0;

  const studied =
    data?.session?.cards?.reduce((sum: number, card: SessionCardResponse) => {
      return card.card_viewcount > 1 ? sum + 1 : sum;
    }, 0) ?? 0;

  const isOwner = !!userId && userId === data?.user_id;

  return (
    <div className={"w-full h-full px-10"}>
      <div className="w-full h-fit flex flex-row items-center mb-3 justify-baseline gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
        <span>{t("created")}</span>
        <Link
          href={isOwner ? "/account" : `/profile/` + data?.user_id}
          className="flex flex-row w-fit h-fit rounded-full sm:rounded-4xl
                            gap-1.5 sm:gap-2 px-1 pr-3 py-1 l max-w-fit
                             bg-studogrey/30 border border-studoborder/30 shadow-2x
                            dark:text-white min-w-0"
        >
          <div className="min-h-4 max-h-4 min-w-4 justify-center items-center flex max-w-4 sm:min-h-5 sm:max-h-5 sm:min-w-5 sm:max-w-5 bg-emerald-400 overflow-hidden rounded-full flex-shrink-0">
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
          <SavedPopup />
          <ClassroomPopup />
          <SharePopup />
          <SettingsPopup />
        </div>
      </div>
      <div className={"w-full h-fit flex flex-col gap-2 mb-3"}>
        <div className={"w-full flex flex-row gap-2 opacity-40 items-center"}>
          <IoFolderOpenOutline />
          <span>
            {t("saved_in")}: {data?.folders?.[0]?.name}
          </span>
        </div>
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
      <div className="w-full h-fit flex flex-col gap-6 sm:gap-8 md:gap-10 justify-center items-center">
        <div className="w-full grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-3">
          {learn && (
            <LinkButton
              href={`/learn/` + id}
              icon={
                <Image
                  width={20}
                  height={20}
                  src={"/icons/pencil.svg"}
                  alt=""
                  className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0"
                />
              }
              label="learn"
              type="button"
              variant="outline_link"
            />
          )}
          {speedy && (
            <LinkButton
              href={`/speedy/` + id}
              className="w-full"
              icon={
                <Image
                  width={20}
                  height={20}
                  src={"/icons/clock.svg"}
                  alt=""
                  className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0"
                />
              }
              label="speedy"
              type="button"
              variant="outline_link"
            />
          )}
          <LinkButton
            href={`/flashcards/${id}`}
            icon={
              <Image
                width={20}
                height={20}
                src="/icons/cards.svg"
                alt=""
                className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0"
              />
            }
            label="flashcards"
            type="button"
            variant="outline_link"
          />
        </div>

        <Flashcard id={id} cards={data?.cards} />

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
            <Progress length={data?.cards?.length} progress={not_studied} />
          </div>
          <div
            className={
              "w-full h-full p-5 border border-studoborder/30 rounded-3xl bg-studogrey/30 flex flex-col items-center justify-center gap-2"
            }
          >
            <span className={"font-bold"}>{t("reviewed")}</span>
            <Progress length={data?.cards?.length} progress={reviewed} />
          </div>
          <div
            className={
              "w-full h-full p-5 border border-studoborder/30 rounded-3xl bg-studogrey/30 flex flex-col items-center justify-center gap-2"
            }
          >
            <span className={"font-bold"}>{t("studied")}</span>
            <Progress length={data?.cards?.length} progress={studied} />
          </div>
        </div>

        <hr className="w-full border-0.5 border-solid border-studoborder/30" />
        <div className={"w-full flex justify-between items-center"}>
          <span className="w-full h-fit font-bold text-sm sm:text-base">
            {t("cards_title")}:
          </span>
          <button
            className={
              "w-8 h-8 bg-studogrey/30 border-studoborder/30 border rounded-full items-center justify-center flex cursor-pointer"
            }
          >
            <IoFilter />
          </button>
        </div>
        <CardList cards={data?.cards ?? []} isOwner={isOwner} setId={id} />
        <BottomCredits />
      </div>
    </div>
  );
}
