"use client";
import { usePathname } from "@/i18n/routing";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";

export default function CourseDetailPage() {
  const path = usePathname().split("/");
  const courseId = path[2];
  const docId = path[4];

  useCourseNav([
    { title: "Course", href: `/course/${courseId}/course`, isLast: false },
    {
      title: "Document title",
      href: `/course/${courseId}/course/${docId}`,
      isLast: true,
    },
  ]);

  return (
    <div className={"w-full h-full flex flex-col"}>
      <div className={"h-10 w-full flex flex-row items-center gap-3 mb-2"}>
        <span>title</span>
      </div>
      <div></div>
    </div>
  );
}
