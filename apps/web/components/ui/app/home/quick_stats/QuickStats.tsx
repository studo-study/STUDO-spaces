"use client";
import { useTranslations } from "next-intl";
import StatItem from "@/components/ui/app/home/quick_stats/StatItem";
import { LuTimer } from "react-icons/lu";
import { FaCheck, FaRegEye } from "react-icons/fa";
import { useSets } from "@/hooks/app/useSets";
import StatItemSkeleton from "@/components/ui/app/home/quick_stats/StatItemSkeleton";

const STATS_CONFIG = [
  {
    color:
      "dark:from-orange-500/20 dark:to-orange-600/20 from-orange-400 to-orange-500 text-white",
    measurement: "days",
    label: "Streak",
    extra: "",
  },
  {
    color:
      "dark:from-purple-500/20 dark:to-purple-400/20 from-purple-500 to-purple-500 text-white",
    icon: "/icons/studyset.svg",
    measurement: "cards",
    label: "totCards",
    extra: "",
    invert: true,
  },
  {
    color:
      "dark:from-blue-500/20 dark:to-blue-500/20 from-blue-400 to-blue-500 text-white",
    icon: "/icons/clock.svg",
    measurement: "min",
    label: "tmStd",
    extra: "week",
    invert: true,
  },
  {
    color:
      "dark:from-emerald-500/20 dark:to-emerald-600/20 from-emerald-400 to-emerald-500 text-white",
    iconComponent: true,
    measurement: "cards",
    label: "mastered",
    extra: "",
  },
];

const QuickStats = () => {
  const { stats, isLoading } = useSets();
  const t = useTranslations("home");

  if (isLoading || !stats) {
    return (
      <section className="grid grid-cols-4 gap-2 overflow-visible w-full">
        {[...Array(4)].map((_, i) => (
          <StatItemSkeleton key={i} />
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-4 gap-2 overflow-visible w-full">
      <StatItem
        bg={
          stats.totalsets === 0
            ? "bg-stuodgrey/30 opacity-50 "
            : STATS_CONFIG[0].color
        }
        image={"/icons/studyset.svg"}
        title={
          stats.totalsets +
          " " +
          (stats.totalsets === 1 ? t("set_studied") : t("sets_studied"))
        }
      />
      <StatItem
        bg={
          stats.totalCards === 0
            ? "bg-stuodgrey/30 opacity-50 "
            : STATS_CONFIG[1].color
        }
        icon={<FaRegEye />}
        title={
          stats.totalCards +
          " " +
          (stats.totalCards === 1 ? t("card") : t("cards"))
        }
      />
      <StatItem
        bg={
          stats.cardsLearned === 0
            ? "bg-stuodgrey/30 opacity-50 "
            : STATS_CONFIG[2].color
        }
        icon={<FaCheck />}
        title={
          stats.cardsLearned.toString() +
          " " +
          (stats.cardsLearned === 1 ? t("card_learned") : t("cards_learned"))
        }
      />
      <StatItem
        bg={
          stats.timeLearned === 0
            ? "bg-stuodgrey/30 opacity-50 "
            : STATS_CONFIG[3].color
        }
        icon={<LuTimer />}
        title={TimeParser(stats.timeLearned, t)}
      />
    </section>
  );
};

function TimeParser(time: number, t: ReturnType<typeof useTranslations>) {
  if (time < 60) {
    return `${time} ${time === 1 ? t("minute") : t("minutes")} ${t("studied")}`;
  }

  const hours = Math.floor(time / 60);

  if (hours < 24) {
    return `${hours} ${hours === 1 ? t("hour") : t("hours")} ${t("studied")}`;
  }

  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? t("day") : t("days")} ${t("studied")}`;
}

QuickStats.displayName = "QuickStats";
export default QuickStats;
