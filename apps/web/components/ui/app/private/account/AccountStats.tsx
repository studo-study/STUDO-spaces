"use client";
import { useTranslations } from "next-intl";
import { useUser } from "@/components/providers/auth/UserProvider";
import { ClockFading, CreditCard, Trophy } from "lucide-react";

export default function Stats() {
  const user = useUser().user;
  const t = useTranslations("account.stats");
  return (
    <div className={"w-full flex flex-col gap-5"}>
      <span className={"font-bold text-lg dark:text-white text-studodarkblue"}>
        {t("subtitle_stats")}:
      </span>
      <div className={"w-full flex flex-row gap-5"}>
        <div
          className={
            "w-1/3 border border-neutral-200/30 h-20 rounded-3xl bg-gray-700 px-10 py-5 flex items-center justify-center dark:text-white textstudodarkblue font-bold gap-2"
          }
        >
          <CreditCard
            size={20}
            className="dark:text-white text-studodarkblue"
          />
          <span>{t("total_cards")}:</span>
          {user?.stats?.cardsLearned ?? 0}
        </div>

        <div
          className={
            "w-1/3 border border-neutral-200/30 h-20 rounded-3xl bg-gray-700 px-10 py-5 flex items-center justify-center dark:text-white textstudodarkblue font-bold gap-2"
          }
        >
          <ClockFading
            size={20}
            className="dark:text-white text-studodarkblue"
          />
          <span>{t("time_studied")}:</span>
          {user?.stats?.timeLearned ?? 0}
        </div>

        <div
          className={
            "w-1/3 border border-neutral-200/30 h-20 rounded-3xl bg-gray-700 px-10 py-5 flex items-center justify-center dark:text-white textstudodarkblue font-bold gap-2"
          }
        >
          <Trophy size={20} className="dark:text-white text-studodarkblue" />
          <span>{t("total_sets")}:</span>
          {user?.stats?.totalsets ?? 0}
        </div>
      </div>
    </div>
  );
}
