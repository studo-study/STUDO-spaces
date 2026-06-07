"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { SetSearchResult } from "@studo/types";
import { useSearchResult } from "@/hooks/app/search/useSearchResult";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";

export default function AllSets() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const result = useSearchResult(query ?? "").data;
  const sets = result && result.data[0].data.slice(0, 3);
  const empty = sets && sets.length === 0;
  const t = useTranslations("landing.search_result.set");
  return (
    <div
      className={`w-full h-full flex flex-col gap-5 ${empty ? "hidden" : "flex"}`}
    >
      <div className={"w-full min-h-30 h-fit grid grid-cols-4 gap-5"}>
        {result &&
          sets?.map((item: SetSearchResult, i: number) => (
            <SetResult key={i} t={t} item={item} />
          ))}
      </div>
    </div>
  );
}

interface SetResultProps {
  item: SetSearchResult;
  t: ReturnType<typeof useTranslations>;
}

function SetResult({ item, t }: SetResultProps) {
  return (
    <Link
      href={
        item.type === "visualset"
          ? "/visualset/" + item.id
          : "/studoset/" + item.id
      }
      className={`w-full min-h-40 rounded-2xl border border-studogrey/30
                 glass-rgb drop-shadow-3xl p-5 flex flex-col gap-2`}
    >
      <div className={"w-full h-fit flex items-center justify-baseline gap-2"}>
        <Image
          src={
            item.type === "visualset"
              ? "/icons/visualset.svg"
              : "/icons/studyset.svg"
          }
          alt=""
          width={0}
          height={0}
          className={"w-5  dark:invert dark:brightness-0"}
        />
        <span className={"font-bold truncate"}>{item.title}</span>
      </div>
      <hr className={"w-full h-0.5 rounded-full bg-studogrey opacity-30"} />
      <div
        className={
          "w-full h-full flex flex-row justify-between gap-1 text-xs opacity-50"
        }
      >
        <span>
          {item.items} {item.type === "visualset" ? t("pins") : t("cards")}
        </span>
        <span>
          {item.likes} {item.likes === 1 ? t("like") : t("likes")}
        </span>
      </div>
      <Link
        href={"/profile/" + item.owner_id}
        className={"w-full h-fit group flex flex-row gap-2 items-center"}
      >
        <Image
          src={item.img_url}
          width={0}
          height={0}
          alt={"pfp"}
          className={"w-5 h-5 rounded-full bg-gray-400/30 overflow-hidden"}
        />
        <span className={"group-hover:underline"}>{item.owner}</span>
      </Link>
    </Link>
  );
}
