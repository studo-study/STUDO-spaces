import { Link } from "react-router-dom";
import Studyset from "../../../../../public/assets/icons/studyset.svg";
import Imageset from "../../../../../public/assets/icons/image.svg";
import Delete from "../../../../../public/assets/icons/delete.svg";
import { Progress } from "../../../account/set/progress/Progress.jsx";
import { t } from "i18next";
import CourseIcons from "../../../../data/Index.js";
import { PiStudent } from "react-icons/pi";

export default function StudysetItem({ set }) {

  return (
    <Link to={`/${set.type}` + "/" + set.id} className="h-fit">
      <div className="flex justify-between w-full min-h-32 sm:min-h-36 md:min-h-40
        max-h-48 sm:max-h-52 md:max-h-60 rounded-2xl sm:rounded-3xl
        bg-studowhite border-transparent border-studoborder
        shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#bebebe]
        sm:shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe]
        p-2 sm:p-3 backdrop-blur-xs flex-col gap-2 sm:gap-3
        dark:bg-gray-700 overflow-hidden
        dark:shadow-[6px_6px_12px_#1a1a2a,-6px_-6px_12px_#1a1a2a]
        sm:dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        hover:scale-[1.02] transition-transform duration-200">

        <div className="w-full h-fit flex flex-row justify-between items-center
          px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-studowhite">
          <span className="text-[10px] sm:text-xs text-studodarkblue dark:text-white/50 truncate ml-2">
            {formatDate(set.created_at)}
          </span>
        </div>

        <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 flex-1 items-center">
          {/* Course icon */}
          <div className="min-w-12 max-w-12 min-h-12 max-h-12
            sm:min-w-14 sm:max-w-14 sm:min-h-14 sm:max-h-14
            md:min-w-16 md:max-w-16 md:min-h-16 md:max-h-16
            dark:bg-studogrey rounded-full bg-white
            flex justify-center items-center flex-shrink-0">
            <img
              src={`${getCoverImage(set.course)}`}
              alt=""
              className="h-6 sm:h-8 md:h-10 w-auto"
            />
          </div>

          <div className="flex-1 flex flex-col gap-1.5 sm:gap-2 md:gap-3
            items-start justify-center min-w-0">
            <div className="font-semibold flex flex-row gap-2 items-center text-sm sm:text-base md:text-lg
              m-0 p-0 truncate w-full">
              <img
                src={set.type === "visualset" ? Imageset : Studyset}
                alt=""
                className="h-5 sm:h-4 opacity-50 dark:invert dark:brightness-0"
              />
              <span className={"truncate"}>{set.title}</span>
            </div>

            <Link
              to={"/profile/" + set.user_id}
              className="w-fit max-w-full flex flex-row gap-1.5 sm:gap-2
                items-center justify-start"
            >
              <div className="min-w-5 max-w-5 min-h-5 max-h-5
                sm:min-w-6 sm:max-w-6 sm:min-h-6 sm:max-h-6 flex
                overflow-hidden rounded-full bg-emerald-400 items-center justify-center flex-shrink-0">
                {set.img_url === "default" ? <PiStudent size={15} color={"white"} /> :
                  <img src={set.img_url} alt="pfp" className="w-full h-full object-cover" />}
              </div>
              <div className="hover:underline px-2 sm:px-3 py-0.5 sm:py-1 truncate
                bg-studogrey rounded-full text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                {set.displayName}
              </div>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 sm:h-1 rounded-full bg-studogrey"></div>
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