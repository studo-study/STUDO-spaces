"use client";
import Image from "next/image";
import CourseItem from "@/components/ui/app/private/your-files/courses/courseItem";
import { useCourses } from "@/hooks/app/courses/useCourses";
import { useTranslations } from "next-intl";
import SetSearch from "@/components/ui/app/private/your-files/sets/search";
import { IoIosAdd } from "react-icons/io";
import { useMemo, useState } from "react";

const CourseGrid = () => {
  const t = useTranslations("courses");
  const { data: courses = [] } = useCourses();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCoures = useMemo(() => {
    let result = courses;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.title.toLowerCase().includes(q));
    }

    return result;
  }, [courses, searchQuery]);
  if (courses.length === 0) {
    return (
      <div className="w-full h-fit flex-1 flex-col gap-2 flex dark:text-white text-studodarkblue font-bold items-center pt-40">
        <Image
          width={100}
          height={100}
          src={"/images/fallbacks/graduate.png"}
          alt=""
          className="h-30 w-30 opacity-50 saturate-0"
        />
        <div className={"flex flex-col items-center justify-center gap-2"}>
          <span className={"dark:text-white text-xl font-bold"}>
            {t("nothing_title")}
          </span>
          <p
            className={"dark:text-studogrey text-gray-400 font-normal text-sm"}
          >
            {t("nothing_paragraph")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={"w-full flex-1"}>
      <div className="sticky top-0 w-full h-20 z-20 backdrop-blur-2xl py-8 flex overflow-visible flex-row items-center justify-end gap-3">
        <div className="w-fit flex flex-row gap-5 items-center">
          <SetSearch
            sets={courses}
            setSearchQuery={setSearchQuery}
            placeholder={t("search_course")}
          />
          <button className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300">
            <div className="absolute bg-purple-500/50 h-8 w-8 rounded-full blur-sm" />
            <div className="relative z-10 shadow-2xl bg-purple-500 h-8 min-w-8 text-3xl flex items-center justify-center text-white rounded-full border border-studoborder">
              <IoIosAdd />
            </div>
          </button>
        </div>
      </div>
      <div className="w-full grid grid-cols-5 gap-5 scroll-hidden py-5">
        {filteredCoures.map((course) => (
          <CourseItem key={course.id} course={course} options />
        ))}
      </div>
    </div>
  );
};

CourseGrid.displayName = "CourseGrid";
export default CourseGrid;
