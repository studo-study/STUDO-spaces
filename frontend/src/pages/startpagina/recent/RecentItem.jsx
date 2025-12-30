import Visualset from "../../../assets/icons/visualset.svg";
import Studyset from "../../../assets/icons/studyset.svg";
import { t } from "i18next";
import CourseIcons from "../../../data/Index.js";
import { Link } from "react-router-dom";
import { Progress } from "../../account/set/progress/Progress.jsx";

export default function RecentItem({ recent }) {
  return (
    <Link to={`${recent.type === "studyset" ? "/studyset" : "/visualset"}/${recent.set_id}`}>
      <div className="flex items-center bg-studogrey shadow-md border-solid border-2 border-studogrey
        cursor-pointer select-none transition-transform duration-300 ease-out
        w-full min-h-14 sm:min-h-16 md:min-h-18 max-h-18
        overflow-hidden justify-between rounded-full gap-2 p-2 px-2 bg-studoblue
        hover:scale-[1.02] active:scale-[0.98]">

        <div className="flex flex-row gap-2 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
            dark:bg-studogrey rounded-full bg-white flex
            justify-center overflow-hidden items-center flex-shrink-0">
            <img
              src={getCoverImage(recent.Course)}
              alt={recent.Course}
              className="h-5 sm:h-6 md:h-7 w-auto object-contain"
            />
          </div>

          <div className="flex w-full flex-col gap-0.5 sm:gap-1 justify-center min-w-0">
            <div className="w-full text-sm sm:text-base md:text-lg font-bold truncate">
              {recent.title}
            </div>
            <div className="w-full flex flex-row gap-1.5 sm:gap-2 items-center">
              <img
                src={recent.type === "visualset" ? Visualset : Studyset}
                alt={recent.type}
                className="h-3 sm:h-4 dark:invert dark:brightness-0 flex-shrink-0"
              />
              <span className="text-xs sm:text-sm truncate">
                {formatDate(recent.last_studied)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
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