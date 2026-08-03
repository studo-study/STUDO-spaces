"use client";
import { ReactNode, use } from "react";
import CoursePageHeader from "@/components/ui/app/private/course/layout/CourseHeader";
import PageContainer from "@/components/ui/design_system/page/PageContainer";
import { useCourse } from "@/hooks/app/courses/useCourse";

export default function CoursePageLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) {
  const { id } = use(params);
  // Vult de react-query cache (courseKeys.course(id)); CoursePageHeader en de
  // children lezen dezelfde entry via useActiveCourse.
  useCourse(id);

  return (
    <div
      className={
        "min-w-0 min-h-0 flex-1 flex py-15 justify-center dark:text-white text-studodarkblue"
      }
    >
      <div className={"flex flex-1 min-h-0 justify-start max-w-4/5"}>
        {children}
      </div>
    </div>
  );
}
