"use client";

import { IoTrendingUpOutline } from "react-icons/io5";
import { IoIosRocket, IoIosTrendingDown } from "react-icons/io";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { useTranslations } from "next-intl";
import { useAdminStats } from "@/hooks/app/admin/useAdminStats";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";

function refactor(number: number) {
  const numberArray = number.toString().split("").reverse();
  for (let i = numberArray.length - 1; i > 0; i--) {
    if (i % 3 === 0) {
      numberArray[i] = numberArray[i] + ".";
    }
  }
  return numberArray.reverse().join("");
}

function perc(current: number, previous: number) {
  if (previous === 0) return null;
  const diff = current - previous;
  const p = Math.floor((diff / previous) * 10000) / 100;
  return (
    <span className="text-xs dark:text-white/30 text-black/30 font-normal">
      ({diff >= 0 ? "+" : ""}
      {p}%)
    </span>
  );
}

function TrendValue({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) {
  const diff = current - previous;
  const threshold20 = previous * 0.2;
  const threshold10 = previous * 0.1;
  const threshold5 = previous * 0.05;

  const icon =
    diff >= threshold20 ? (
      <IoIosRocket size={20} />
    ) : diff >= threshold10 ? (
      <BiSolidPlaneAlt size={20} />
    ) : diff > 0 ? (
      <IoTrendingUpOutline size={24} />
    ) : diff < 0 ? (
      <IoIosTrendingDown size={24} />
    ) : null;

  const color =
    diff >= threshold10
      ? "text-emerald-500"
      : diff >= threshold5
        ? "text-emerald-300"
        : diff < 0
          ? "text-rose-500"
          : "dark:text-white text-studodarkblue";

  return (
    <div className={`w-full flex flex-row items-center gap-2 text-xl ${color}`}>
      <span className="w-fit font-bold dark:text-white text-studodarkblue">
        {refactor(current)}
      </span>
      {icon}
      {diff !== 0 && (
        <span className="text-sm dark:text-white/50 text-black/50">
          ({diff > 0 ? "+" : ""}
          {refactor(diff)})
        </span>
      )}
    </div>
  );
}

function StatCard({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-25 rounded-4xl dark:bg-studogrey/10 bg-studogrey border dark:border-studoborder/30 border-studodarkblue/20 p-5 flex flex-col gap-1">
      <span className="w-full font-bold dark:text-white/50 text-sm text-studodarkblue/50 items-baseline flex gap-2 flex-row">
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

export default function QuickStats() {
  useCourseNav([
    {
      title: "admin",
      href: `/admin`,
      isLast: false,
      translate: true,
    },
    {
      title: "stats",
      href: `/admin/stats`,
      isLast: true,
      translate: true,
    },
  ]);
  const t = useTranslations("admin");
  const { data, isLoading } = useAdminStats();

  if (isLoading || !data) {
    return (
      <div className="w-full grid grid-rows-1 grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-full h-25 rounded-4xl dark:bg-studogrey/10 bg-studogrey border dark:border-studoborder/30 border-studodarkblue/20 p-5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full grid grid-rows-1 grid-cols-4 gap-5">
      <StatCard
        label={
          <>
            {t("total_usr")}{" "}
            {perc(data.totalUsersThisMonth, data.totalUsersLastMonth)}
          </>
        }
      >
        <TrendValue
          current={data.totalUsersThisMonth}
          previous={data.totalUsersLastMonth}
        />
      </StatCard>

      <StatCard
        label={
          <>
            {t("total_month")}{" "}
            {perc(data.activeUsersThisMonth, data.activeUsersLastMonth)}
          </>
        }
      >
        <TrendValue
          current={data.activeUsersThisMonth}
          previous={data.activeUsersLastMonth}
        />
      </StatCard>

      <StatCard label={t("total_ss")}>
        <span className="w-full font-bold dark:text-white text-studodarkblue text-xl">
          {refactor(data.totalStudysets)}
        </span>
      </StatCard>

      <StatCard label={t("total_vs")}>
        <span className="w-full font-bold dark:text-white text-studodarkblue text-xl">
          {refactor(data.totalVisualsets)}
        </span>
      </StatCard>
    </div>
  );
}
