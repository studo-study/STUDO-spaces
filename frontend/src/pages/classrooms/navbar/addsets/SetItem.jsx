import { Link } from "react-router-dom";
import Studyset from "../../../../assets/icons/studyset.svg";
import Imageset from "../../../../assets/icons/image.svg";
import { t } from "i18next";
import CourseIcons from "../../../../data/Index.js";
import { FaChevronRight } from "react-icons/fa";

export default function SetItem({ set, isDisabled, isSelected, onToggle }) {
  const handleClick = (e) => {
    if (!e.target.closest("a")) {
      onToggle();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex justify-between items-center
        w-full min-h-16 sm:min-h-20 
        rounded-2xl sm:rounded-full
        ${isDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
        p-3 backdrop-blur-xs font-sfpro overflow-hidden
        ${isSelected
        ? "bg-emerald-100 dark:bg-emerald-900/30 border-2 sm:border-3 border-emerald-400 dark:border-emerald-600"
        : "border-2 sm:border-3 border-studowhite bg-studowhite dark:bg-gray-700"
      }`}>
      <div className="flex items-center gap-3 sm:gap-5 w-full min-w-0">
        <div className="min-w-12 min-h-12 sm:min-w-14 sm:min-h-14
          dark:bg-studogrey rounded-full bg-white
          flex justify-center items-center flex-shrink-0">
          <img src={`${getCoverImage(set.course)}`} alt="" className="h-6 sm:h-7 w-auto" />
        </div>
        <div className="flex flex-col w-full min-w-0">
          <span className="font-semibold text-sm sm:text-base dark:text-white truncate">
            {set.title}
          </span>
          <div className="flex flex-row gap-2 sm:gap-3 items-center opacity-50">
            <img
              src={set.type.toLowerCase() === "studyset" ? Studyset : Imageset}
              alt=""
              className="h-3 sm:h-4 dark:invert dark:brightness-0"
            />
            <span className="text-xs sm:text-sm dark:text-white truncate">
              {formatDate(set.created_at)}
            </span>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
          <Link
            to={"/" + set.type + "/" + set.id}
            className="flex items-center justify-center p-2 sm:p-3 dark:text-white">
            <FaChevronRight className="text-sm sm:text-base" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatDate(date) {
  if (new Date(date).getDate() === new Date().getDate()) {
    return t("today") + " - " + new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  return new Date(date).toDateString();
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