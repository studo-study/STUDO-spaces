"use client";
import CoursePageHeader from "@/components/ui/app/private/flow/page/CoursePage/CoursePageHeader";
import CourseTable from "@/components/ui/app/private/flow/page/CoursePage/overview_types/table/CourseTable";
import CourseKanban from "@/components/ui/app/private/flow/page/CoursePage/overview_types/kanban/CourseKanban";
import { useFlowStore } from "@/store/slices/flow/flowStore";

export default function CoursePageContent() {
  const activeCourse = useFlowStore((s) => s.activeCourse);
  const courseView = useFlowStore((s) => s.courseView);

  if (!activeCourse) return null;

  return (
    <div className={"pt-8 px-2 flex flex-col gap-2 h-full w-full"}>
      <CoursePageHeader />
      {courseView === "table" && <CourseTable />}
      {courseView === "kanban" && <CourseKanban />}
    </div>
  );
}
