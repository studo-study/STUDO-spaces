import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import QuickStats from "@/components/ui/app/admin/stats/quick_stats/quickstats";
import { VscGraphLine } from "react-icons/vsc";
import { MdOutlineQueryStats } from "react-icons/md";
import Overview from "@/components/ui/app/admin/stats/overview/overview";

export const metadata: Metadata = {
  title: "Admin Dashboard | Studo",
};

export default async function ModeratorPage() {
  const t = await getTranslations("admin");
  return (
    <div className={"w-full min-h-full flex flex-col gap-12"}>
      <div className={"w-full h-fit flex flex-col items-center gap-5"}>
        <span
          className={
            "w-full h-fit font-bold dark:text-white text-studodarkblue flex gap-2 items-center"
          }
        >
          <VscGraphLine />
          {t("subtitle_stats")}:
        </span>
        <QuickStats />
      </div>
      <div className={"w-full h-3/4 flex flex-col gap-5"}>
        <span
          className={
            "w-full h-fit font-bold dark:text-white text-studodarkblue flex gap-2 items-center"
          }
        >
          <MdOutlineQueryStats />
          {t("subtitle_overview")}:
        </span>
        <Overview />
      </div>
    </div>
  );
}
