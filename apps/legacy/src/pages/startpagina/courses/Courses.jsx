import CourseItem from "./CourseItem.jsx";
import More from "./More.jsx";
import { t } from "i18next";

export default function Courses({ courses }) {
  return (
    <div className="relative w-full mt-2 sm:mt-3 md:mt-5">
      {courses.length === 0 ? (
        <div
          className="w-full h-28 sm:h-32 md:h-36 p-3 justify-center items-center flex text-sm sm:text-base
          bg-studowhite border-1 border-transparent border-studoborder rounded-2xl sm:rounded-3xl md:rounded-4xl
          shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe]
          dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
          border-[0.5px] border-solid dark:border-t-gray-500 dark:border-l-gray-500
          border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]"
        >
          <span className="text-studodarkblue/60 dark:text-white/60">
            {t("no courses yet")}
          </span>
        </div>
      ) : (
        <div
          className="w-full flex-row flex justify-baseline items-center
          rounded-2xl sm:rounded-3xl md:rounded-4xl min-h-fit
          flex-nowrap overflow-x-auto scroll-hidden
          gap-2 sm:gap-3 md:gap-4
          border-1 border-transparent border-studoborder
          p-3 sm:p-4 md:p-5 lg:p-6 backdrop-blur-xs
          border-[0.5px] border-solid"
        >
          {courses.map((course, index) => (
            <CourseItem key={index} course={course} />
          ))}
          {courses.length > 0 && <More />}
        </div>
      )}

      {/* Left gradient fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-3 sm:w-4 md:w-6
        bg-gradient-to-r from-bg-white dark:from-bg-dark to-transparent
        pointer-events-none rounded-l-2xl sm:rounded-l-3xl md:rounded-l-4xl"
      ></div>

      {/* Right gradient fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-5 sm:w-8 md:w-12
        bg-gradient-to-l from-bg-white dark:from-bg-dark to-transparent
        pointer-events-none rounded-r-2xl sm:rounded-r-3xl md:rounded-r-4xl"
      ></div>
    </div>
  );
}
