"use client";
import { useSideMenu } from "@/store/course_context_menu/SideMenuStore";
import { useCourse } from "@/hooks/app/courses/useCourse";
import PdfReader from "./PdfReader";

const CourseOverview = () => {
  const info = useSideMenu((state) => state.menuInfo);
  const course = useCourse(info?.course_id ?? "");

  if (course) {
    return <PdfReader />;
  }
  return (
    <div
      className={
        "min-w-0 min-h-0 flex-1 flex flex-col items-center justify-center"
      }
    ></div>
  );
};

CourseOverview.displayName = "CourseOverview";
export default CourseOverview;
