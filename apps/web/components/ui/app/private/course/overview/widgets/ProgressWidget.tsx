import { Progress } from "@/components/ui/app/shared/studosets/progress/progress";
import type { ReactNode } from "react";
import { useWidgetMenu } from "@/store/course_context_menu/WidgetMenuStore";
import { useCourseTable } from "@/hooks/app/courses/useCourse";

export default function ProgressWidget({
  icon,
  type,
}: {
  icon: ReactNode;
  type: string;
}) {
  const courseId = useWidgetMenu((s) => s.courseId);
  const table = useCourseTable(courseId ?? "");
  const rows = table?.rows ?? [];
  const total = rows.length;
  const done = rows.filter((r) => r.status === "done").length;

  return (
    <div
      className={
        "flex h-full w-full flex-col items-center gap-2 text-sm text-neutral-400 "
      }
    >
      <div className={"w-full flex flex-row gap-2 items-center"}>
        {icon}
        <span className={"font-semibold capitalize"}>{type}</span>
      </div>
      <div
        className={
          "flex-1 min-h-0 p-3 gap-3 flex items-center justify-center flex-col"
        }
      >
        <Progress length={total || 1} progress={done} height={90} />
        <span className={"text-neutral-400 "}>
          {done}/{total} tasks done
        </span>
      </div>
    </div>
  );
}
