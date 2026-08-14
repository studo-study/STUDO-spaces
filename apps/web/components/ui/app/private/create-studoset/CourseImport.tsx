"use client";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useCourses } from "@/hooks/app/courses/useCourses";
import FlowIcon from "@/components/ui/app/private/course/layout/FlowIcon";
import { useCourse } from "@/hooks/app/courses/useCourse";
import classNames from "@/utils/classnames";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { HiSparkles } from "react-icons/hi";

interface CourseImportInterface {
  courseId?: string | null;
}
const CourseImport: React.FC<CourseImportInterface> = (props) => {
  const { courseId } = props;
  const t = useTranslations("import");
  const [activeCourse, setActiveCourse] = useState<string>(courseId ?? "");
  const courses = useCourses().data ?? [];
  const currentCourse = useCourse(activeCourse)?.data;
  const [selectCourses, setSelectedCourses] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    if (selectCourses.includes(id)) {
      setSelectedCourses((prev) => prev.filter((doc) => doc != id));
    } else {
      setSelectedCourses((prev) => [...prev, id]);
    }
  };

  const handleSubmit = () => {};
  return (
    <div className="w-2/3 h-full relative min-h-[80vh] flex flex-row items-center justify-center gap-6 px-4 py-10">
      <div
        className={
          "w-full h-full max-w-65 min-w-0 flex-1 min-h-0 border  border-studoborder rounded-3xl bg-studogrey/30 p-5 flex flex-col gap-1"
        }
      >
        <span className={"text-sm text-studogrey font-medium"}>
          {t("title_library")}
        </span>
        <div
          className={
            "flex flex-col gap-2 w-full flex-1 min-w-0 min-h-0 overflow-y-auto scroll-hidden"
          }
        >
          {courses.map((course, i) => {
            return (
              <div
                onClick={() => {
                  setActiveCourse(course.id);
                }}
                key={courseId + i.toString()}
                className={classNames(
                  "w-full h-10 bg-studogrey/25 rounded-2xl transition-colors duration-300 flex flex-row items-center px-2 cursor-pointer border border-studoborder/30 hover:border-studoborder",
                  activeCourse === course.id && "bg-studogrey/75",
                )}
              >
                <FlowIcon
                  icon={course?.icon ?? ""}
                  size={15}
                  className={
                    "min-w-8 min-h-8 w-8 h-8 rounded-lg shrink-0 bg-transparent dark:text-white text-studodarkblue"
                  }
                />
                <span
                  title={course.title}
                  className={"text-sm truncate overflow-hidden"}
                >
                  {course.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={"w-full h-full gap-5 flex flex-col min-w-0 flex-1 min-h-0"}
      >
        <div
          className={
            "flex-1 min-h-0 p-5 min-w-0 border border-studogrey/30 rounded-3xl bg-studogrey/10 flex flex-col"
          }
        >
          <span className={"text-xl font-bold mb-3"}>
            {currentCourse?.title}
          </span>
          <div className={"flex flex-row flex-wrap gap-3"}>
            {currentCourse?.documents.map((doc, i) => {
              return (
                <div
                  onClick={() => toggleSelect(doc.id)}
                  key={doc.id + i}
                  className={classNames(
                    "w-fit flex items-center p-2 cursor-pointer border-2 border-transparent rounded-2xl hover:bg-studogrey/30 transition-colors duration-300 h-fit justify-center flex-col gap-3",
                    selectCourses.includes(doc.id) &&
                      "border-studoblue bg-studogrey/30",
                  )}
                >
                  <div
                    className={
                      "min-h-55 max-w-37 w-37 bg-white h-full max-h-55 border rounded-lg"
                    }
                  />
                  <span className={"max-w-50 truncate"}>{doc.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-auto min-w-full">
          <BaseButton
            onClick={handleSubmit}
            disabled={selectCourses.length === 0}
            type={"button"}
            variant={"submit"}
            label={t("import")}
            className={"min-w-full"}
            iconLeft={<HiSparkles />}
          />
        </div>
      </div>
    </div>
  );
};

CourseImport.displayName = "CourseImport";
export default CourseImport;
