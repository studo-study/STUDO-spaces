"use client";
import { useFlowCourse } from "@/hooks/app/flow/useFlowData";

export default function CoursePageContent() {
  const activeCourse = useFlowCourse().data;

  if (!activeCourse) return null;

  return <div className={"pt-8 px-2 flex flex-col gap-2 h-full w-full"}></div>;
}
