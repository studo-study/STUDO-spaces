import CourseIcons from "../../../../data/Index.js";
import { t } from "i18next";
import { Link } from "react-router-dom";

export default function CourseItem({ course }) {
  return (
    <Link
      to={"/courses/" + course}
      className="py-3 sm:py-4 md:py-5 w-full min-h-24 sm:min-h-28 md:min-h-30
        bg-studowhite gap-2 sm:gap-3 border-1
        border-transparent cursor-pointer border-studoborder
        flex flex-row justify-start items-center
        rounded-2xl sm:rounded-4xl
        shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe]
        p-4 px-4 sm:p-6 sm:px-6 md:p-10 md:px-7 backdrop-blur-xs
        dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        border-[0.5px] border-solid hover:scale-[1.02] transition-all duration-300
        dark:border-t-gray-500 dark:border-l-gray-500
        border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]">
      <div className="items-center flex flex-row justify-start gap-2 sm:gap-3 w-full min-w-0">
        <div className="min-w-10 max-w-10 min-h-10 max-h-10
          sm:min-w-12 sm:max-w-12 sm:min-h-12 sm:max-h-12
          md:min-w-14 md:max-w-14 md:min-h-14 md:max-h-14
          lg:min-w-16 lg:max-w-16 lg:min-h-16 lg:max-h-16
          dark:bg-studogrey rounded-full bg-white
          flex justify-center items-center flex-shrink-0">
          <img
            src={`${getCoverImage(course)}`}
            alt=""
            className="h-5 sm:h-6 md:h-8 lg:h-10 w-auto"
          />
        </div>
        <div className="w-full text-xs sm:text-sm flex flex-col gap-1 sm:gap-2 min-w-0">
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-studogrey rounded-full w-fit text-[10px] sm:text-xs">
            {t("Course")}
          </span>
          <span className="px-2 sm:px-3 text-sm sm:text-base font-bold truncate">
            {course}
          </span>
        </div>
      </div>
    </Link>
  );
}

function getCoverImage(subject) {
  const Import = Object.keys(CourseIcons).find((key) =>
    subject.toLowerCase().includes(key)
  );
  if (!Import) {
    return "../../../../public/assets/icons/courses/default.svg";
  }
  return "../../../../public/assets/icons/courses/" + CourseIcons[Import];
}