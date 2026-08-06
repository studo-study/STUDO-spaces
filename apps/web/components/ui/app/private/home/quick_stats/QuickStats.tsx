"use client";
import { useTranslations } from "next-intl";
import StatItem from "@/components/ui/app/private/home/quick_stats/StatItem";
import { useSets } from "@/hooks/app/sets/useSets";
import StatItemSkeleton from "@/components/ui/app/private/home/quick_stats/StatItemSkeleton";
import { Check, Eye, Layers, Timer } from "lucide-react";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";

const STATS_CONFIG = [
  {
    color: "dark:text-orange-400 text-orange-500",
    measurement: "days",
    label: "Streak",
    extra: "",
  },
  {
    color: "dark:text-purple-400 text-purple-500",
    icon: "/icons/studyset.svg",
    measurement: "cards",
    label: "totCards",
    extra: "",
    invert: true,
  },
  {
    color: "dark:text-blue-400 text-blue-500",
    icon: "/icons/clock.svg",
    measurement: "min",
    label: "tmStd",
    extra: "week",
    invert: true,
  },
  {
    color: "dark:text-emerald-400 text-emerald-500",
    iconComponent: true,
    measurement: "cards",
    label: "mastered",
    extra: "",
  },
];

const QuickStats = () => {
  const { stats, isLoading } = useSets();
  const t = useTranslations("home");
  useCourseNav([
    {
      title: "home",
      href: `/home`,
      isLast: true,
      translate: true,
    },
  ]);

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
        icon={<Layers size={13} className={STATS_CONFIG[0].color} />}
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
        icon={<Eye size={13} className={STATS_CONFIG[1].color} />}
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
        icon={<Check size={13} className={STATS_CONFIG[2].color} />}
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
        icon={<Timer size={13} className={STATS_CONFIG[3].color} />}
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
