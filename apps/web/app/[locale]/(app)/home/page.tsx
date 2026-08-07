import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";

import CTABlock from "@/components/ui/app/private/home/CTABlock";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import JumpBackIn from "@/components/ui/app/private/home/jump-back-in/JumpBackIn";
import QuickStats from "@/components/ui/app/private/home/quick_stats/QuickStats";
import YourSets from "@/components/ui/app/private/home/YourSets/YourSets";
import Courses from "@/components/ui/app/private/home/courses/Courses";
import EmptyFallback from "@/components/ui/app/private/home/EmptyFallback/EmptyFallback";
import { useImpersonation } from "@/hooks/app/auth/useImpersonation";
import BottomShade from "@/components/ui/app/private/home/BottomShade";
export const metadata: Metadata = {
  title: "Home | Studo",
};

export default async function HomePage() {
  const [t, tTimed, session] = await Promise.all([
    getTranslations("home"),
    getTranslations("timed"),
    auth(),
  ]);
  const welcome = getWelcomeMsg(tTimed, session?.user?.displayName ?? "");
  return (
    <>
      <section
        className={`w-full max-h-fit mb-3 gap-5 flex flex-col sticky top-0 z-20 pb-3`}
      >
        <div className={"w-full flex-1 min-w-0 flex flex-col gap-2"}>
          <div className="w-full h-fit flex flex-col gap-2 ">
            <span className="font-georgia font-bold dark:text-white text-studodarkblue text-2xl">
              {welcome}
            </span>
            <span className="dark:text-studogrey text-gray-400">
              {t("ready")}
            </span>
          </div>
        </div>
        <QuickStats />
      </section>
      <div className={"w-full grid grid-cols-1 gap-10 pb-10"}>
        <EmptyFallback />

        <JumpBackIn />
        <Courses />
        <YourSets />
      </div>
      <div className="fixed z-40 bottom-10 w-fit left-1/2 -translate-1/2 h-fit flex items-end justify-center">
        <AnimateOnMount delay={2000}>
          <CTABlock />
        </AnimateOnMount>
      </div>
      <BottomShade />
    </>
  );
}

function getWelcomeMsg(
  t: ReturnType<typeof useTranslations>,
  name: string,
): string {
  const time = new Date().getHours();
  const ranges = [
    { from: 0, to: 1, key: "0" },
    { from: 2, to: 3, key: "2" },
    { from: 4, to: 6, key: "4" },
    { from: 7, to: 10, key: "7" },
    { from: 11, to: 14, key: "11" },
    { from: 15, to: 18, key: "15" },
    { from: 19, to: 21, key: "19" },
    { from: 22, to: 23, key: "22" },
  ];

  const match = ranges.find((r) => time >= r.from && time <= r.to);
  if (!match) return `Welcome back, ${name}`;

  try {
    const messages = t.raw(match.key) as string[];
    return messages[Math.floor(Math.random() * messages.length)].replace(
      "{name}",
      name,
    );
  } catch {
    return `Welcome back, ${name}`;
  }
}
