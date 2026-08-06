"use client";
import { ReactNode, use } from "react";
import { useCourse } from "@/hooks/app/courses/useCourse";
import CourseSplashWrapper from "@/app/[locale]/(app)/course/[id]/CourseSplashWrapper";

export default function CoursePageLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) {
  const { id } = use(params);
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
