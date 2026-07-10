"use client";
import { useFlowCourse } from "@/hooks/app/flow/useFlowData";

const CourseKanban = () => {
  const data = useFlowCourse().data;

  if (!data) return null;

  return (
    <div className={"w-full min-h-0 flex-1 flex gap-5"}>
      <div
        className={"border rounded-3xl min-h-0 w-full p-3 pt-15 flex flex-col"}
      >
        <div className={"flex-1 min-h-0 border rounded-2xl"}></div>
      </div>
      <div
        className={"border rounded-3xl min-h-0 w-full p-3 pt-15 flex flex-col"}
      >
        <div className={"flex-1 min-h-0 border rounded-2xl"}></div>
      </div>
      <div
        className={"border rounded-3xl min-h-0 w-full p-3 pt-15 flex flex-col"}
      >
        <div className={"flex-1 min-h-0 border rounded-2xl"}></div>
      </div>
    </div>
  );
};

CourseKanban.displayName = "CourseKanban";
export default CourseKanban;
