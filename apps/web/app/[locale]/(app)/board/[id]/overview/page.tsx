"use client";
import FlowTable from "@/components/ui/app/private/board/FlowTable";
import CourseItemProgress from "@/components/ui/app/private/course/layout/CourseItemProgress";
import UrgentPoints from "@/components/ui/app/private/board/UrgentPoints";
import { useTranslations } from "next-intl";
import { useFlowBoard } from "@/hooks/app/flow/useFlowData";

export default function Page() {
  const t = useTranslations("flow");
  const data = useFlowBoard().data;

  if (!data) return null;

  return (
    <div className={"w-full h-full pt-5 flex flex-col gap-2"}>
      <span className={"text-2x dark:text-white text-studodarkblue font-bold"}>
        {t("your_courses")}:
      </span>
      <div className={"flex flex-col gap-2"}>
        {data.totalLength !== 0 && data.totalInProgress !== 0 && (
          <div className={"flex flex-row items-center gap-2"}>
            <CourseItemProgress
              total_done={data.totalDone}
              total_in_progress={data.totalInProgress}
              total_length={data.totalLength}
            />
            <span
              className={
                "flex min-w-fit flex-row gap-1 text-sm font-bold text-studodarkblue dark:text-white"
              }
            >
              {data.totalDone + " / " + data.totalLength}
            </span>
          </div>
        )}
        <UrgentPoints />
        <FlowTable data={data.courses} />
      </div>
    </div>
  );
}
