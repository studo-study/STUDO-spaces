"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSets } from "@/hooks/app/sets/useSets";
import { useBoards } from "@/hooks/app/flow/useBoards";

const EmptyFallback = () => {
  const { sets, isLoading: setsLoading } = useSets();
  const { data, isLoading: boardsLoading } = useBoards();
  const t = useTranslations("home.fallback");

  if (setsLoading && boardsLoading) return null;
  if (sets.length > 0 || (data?.boards ?? []).length > 0) return null;

  return (
    <div
      className={
        "w-full min-h-100 flex-1 flex flex-col items-center justify-center gap-4"
      }
    >
      <Image
        src={"/vectors/workplace.png"}
        alt={"lamp"}
        width={200}
        height={200}
        className={"h-30 w-fit saturate-0 opacity-75"}
      />

      <div className={"flex flex-col items-center justify-center gap-2"}>
        <span className={"dark:text-white text-2xl font-bold"}>
          {t("nothing_title")}
        </span>
        <p className={"dark:text-studogrey text-gray-400 text-sm"}>
          {t("nothing_paragraph")}
        </p>
      </div>
    </div>
  );
};

EmptyFallback.displayName = "EmptyFallback";
export default EmptyFallback;
