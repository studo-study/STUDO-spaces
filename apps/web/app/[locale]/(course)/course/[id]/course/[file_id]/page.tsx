"use client";
import { usePathname, useRouter } from "@/i18n/routing";
import { useCourseStore } from "@/store/course/couresStore";
import { useEffect } from "react";

export default function CourseDetailPage() {
  //path
  const path = usePathname().split("/");
  const courseId = path[2];
  const docId = path[4];

  //nav
  const setNav = useCourseStore((state) => state.setNav);
  useEffect(() => {
    setNav([
      {
        title: "Course",
        href: "/course/" + courseId + "/course",
        isLast: false,
      },
      {
        title: "Document title",
        href: "/course/" + courseId + "/course/" + docId,
        isLast: true,
      },
    ]);
  }, [courseId, docId, setNav]);

  const Router = useRouter();
  return (
    <div className={"w-full h-full flex flex-col"}>
      <div className={"h-10 w-full flex flex-row items-center gap-3 mb-2"}>
        <span>title</span>
      </div>
      <div></div>
    </div>
  );
}
