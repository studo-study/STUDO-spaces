import Visualset from "../../../assets/icons/visualset.svg";
import Studyset from "../../../assets/icons/studyset.svg";
import { t } from "i18next";
import CourseIcons from "../../../data/Index.js";
import { Link } from "react-router-dom";
import { Progress } from "../../account/set/progress/Progress.jsx";

export default function RecentItem({ recent }) {
  return (
    <Link
      to={`${recent.type === "studyset" ? "/studoset" : "/((visualset))"}/${recent.set_id}`}
    >
      <div
        className="flex items-center bg-studogrey shadow-md border-solid border-2 border-studogrey
        cursor-pointer select-none transition-transform duration-300 ease-out
        w-full h-12 sm:h-14 md:h-16 lg:h-[60px]
        overflow-hidden justify-between rounded-full gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-studoblue
        hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="flex flex-row gap-1.5 sm:gap-2 flex-1 min-w-0">
          {/* Course icon */}
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-11 lg:h-11
            dark:bg-studogrey rounded-full bg-white flex
            justify-center overflow-hidden items-center flex-shrink-0"
          >
            <img
              src={getCoverImage(recent.Course)}
              alt={recent.Course}
              className="h-4 sm:h-5 md:h-6 w-auto object-contain"
            />
          </div>

          {/* Text content */}
          <div className="flex w-full flex-col gap-0 sm:gap-0.5 justify-center min-w-0">
            <div className="w-full text-xs sm:text-sm md:text-base font-bold truncate leading-tight">
              {recent.title}
            </div>
            <div className="w-full flex flex-row gap-1 sm:gap-1.5 items-center">
              <img
                src={recent.type === "visualset" ? Visualset : Studyset}
                alt={recent.type}
                className="h-2.5 sm:h-3 md:h-3.5 dark:invert dark:brightness-0 flex-shrink-0"
              />
              <span className="text-[10px] sm:text-xs truncate opacity-70">
                {formatDate(recent.last_studied)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex-shrink-0 scale-75 sm:scale-90 md:scale-100">
          <Progress length={recent.length} progress={recent.progress} />
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
    month: "short",
  });
  return formattedDate;
}

function getCoverImage(subject) {
  const Import = Object.keys(CourseIcons).find((key) =>
    subject.toLowerCase().includes(key),
  );
  if (!Import) {
    return "./src/assets/icons/courses/default.svg";
  }
  return "./src/assets/icons/courses/" + CourseIcons[Import];
}
