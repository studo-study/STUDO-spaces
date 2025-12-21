import { Link } from "react-router-dom";
import { t } from "i18next";
import Studyset from "../../../../public/assets/icons/studyset.svg";
import Imageset from "../../../../public/assets/icons/image.svg";
import CourseIcons from "../../../data/Index.js";
import { Progress } from "./progress/Progress.jsx";

export default function SetItem({ set }) {
  return (
    <Link to={"/" + set.type + "/" + set.set_id}>
      <div className="flex flex-row justify-between items-start sm:items-center
        w-full min-h-fit sm:min-h-20 sm:max-h-20
        rounded-2xl sm:rounded-full md:justify-between
        bg-studowhite border-transparent border-studoborder
        shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-3 sm:p-3 backdrop-blur-xs
        gap-3 sm:gap-0
        dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]">
        <div className="flex items-center justify-start gap-3 sm:gap-5 w-full">
          <div className="w-12 h-12 sm:w-14 sm:h-14
            dark:bg-studogrey rounded-full bg-white
            flex justify-center items-center flex-shrink-0">
            <img src={`${getCoverImage(set.Course)}`} alt="" className="h-6 sm:h-7 w-auto" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-sm sm:text-base truncate">{set.title}</span>
            <div className="flex flex-row gap-2 sm:gap-3 items-center opacity-50">
              <img src={set.type.toLowerCase() === "studyset" ? Studyset : Imageset} alt=""
                   className="h-3 sm:h-4 dark:invert dark:brightness-0" />
              <span className="text-xs sm:text-sm truncate">{formatDate(set.last_studied)}</span>
            </div>
          </div>
        </div>
        <div className="w-full w-fit w-full flex justify-end">
          <Progress length={set.length} progress={set.progress} />
        </div>
      </div>
    </Link>
  );
}

function formatDate(date) {
  const lang = localStorage.getItem("i18nextLng");
  const datum = new Date(date);
  const formattedDate = datum.toLocaleDateString(lang, {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return ` ${formattedDate}`;
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