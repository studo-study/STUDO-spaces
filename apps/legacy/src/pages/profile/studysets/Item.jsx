import { Link } from "react-router-dom";
import { t } from "i18next";
import Studyset from "../../../assets/icons/studyset.svg";
import CourseIcons from "../../../data/Index.js";

export default function Item({ set }) {
  const lang = localStorage.getItem("i18nextLng") || "nl-NL-NL";
  const date = new Date(set.last_updated);
  const formattedDate = date.toLocaleDateString(lang, {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <Link to={"/studoset/" + set.id}>
      <div className="flex justify-between w-full min-h-16 sm:min-h-18 md:min-h-20 max-h-20
        rounded-2xl sm:rounded-full
        bg-studowhite border-transparent border-studoborder
        shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-2 sm:p-3 backdrop-blur-xs
        flex-row
        dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        hover:scale-[1.01] transition-transform">
        <div className="flex items-center justify-start gap-3 sm:gap-5 w-full min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 dark:bg-studogrey rounded-full bg-white
            flex justify-center items-center flex-shrink-0">
            <img src={`${getCoverImage(set.course)}`} alt="" className="h-6 sm:h-7 w-auto" />
          </div>
          <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1">
            <span className="font-semibold text-sm sm:text-base truncate">{set.title}</span>
            <div className="flex flex-row gap-2 sm:gap-3 items-center opacity-50">
              <img
                src={Studyset}
                alt=""
                className="h-3 sm:h-4 dark:invert dark:brightness-0 flex-shrink-0"
              />
              <span className="text-xs sm:text-sm truncate">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getCoverImage(subject) {
  const Import = Object.keys(CourseIcons).find((key) => subject.toLowerCase().includes(key));
  if (!Import) {
    return "../../../../public/assets/icons/courses/default.svg";
  }
  return "../../../../public/assets/icons/courses/" + CourseIcons[Import];
}