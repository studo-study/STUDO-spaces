"use client";
import FlowTable from "@/components/ui/app/private/course/page/overview/FlowTable";
import FlowProgress from "@/components/ui/app/private/course/page/overview/FlowProgress";
import UrgentPoints from "@/components/ui/app/private/course/page/overview/UrgentPoints";
import { useTranslations } from "next-intl";
import { useFlowStore } from "@/store/slices/flow/flowStore";

export default function Page() {
  const t = useTranslations("flow");
  const data = useFlowStore((s) => s.activeBoard);

  if (!data) return null;

  return (
    <div className={"w-full h-full pt-5 flex flex-col gap-2"}>
      <span className={"text-2x dark:text-white text-studodarkblue font-bold"}>
        {t("your_courses")}:
      </span>
      <div className={"flex flex-col gap-2"}>
        {data.totalLength !== 0 && data.totalInProgress !== 0 && (
          <FlowProgress
            total_done={data.totalDone}
            total_in_progress={data.totalInProgress}
            total_length={data.totalLength}
          />
        )}
        <UrgentPoints />
        <FlowTable data={data.courses} />
      </div>
    </div>
  );
}
