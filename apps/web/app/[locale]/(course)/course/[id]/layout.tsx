"use client";
import { ReactNode, use } from "react";
import { useCourse } from "@/hooks/app/courses/useCourse";
import CourseSplashWrapper from "@/app/[locale]/(course)/course/[id]/CourseSplashWrapper";

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
        "min-w-0 min-h-0 flex-1 flex justify-center dark:text-white text-studodarkblue"
      }
    >
      <CourseSplashWrapper id={id}>{children}</CourseSplashWrapper>
    </div>
  );
}
