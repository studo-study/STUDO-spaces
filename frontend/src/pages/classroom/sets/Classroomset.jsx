import { Link } from "react-router-dom";
import Studyset from "../../../../public/assets/icons/studyset.svg";
import Imageset from "../../../../public/assets/icons/image.svg";
import Delete from "../../../../public/assets/icons/delete.svg";
import { Progress } from "../../account/set/progress/Progress.jsx";
import { t } from "i18next";
import { FaChevronRight } from "react-icons/fa";
import CourseIcons from "../../../data/Index.js";

export default function Classroomset({ isLoading, sets, toggleDelete }) {
  return (
    <div className="w-full h-fit">
      <ul className="flex flex-col gap-3 sm:gap-4 md:gap-5 w-full h-max">
        {!isLoading && sets && sets.map((set) => (
          <div
            key={set.set_id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center
              w-full min-h-fit sm:min-h-20 sm:max-h-20
              rounded-2xl sm:rounded-full
              bg-studowhite border-transparent border-studoborder
              shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-3 backdrop-blur-xs gap-3 sm:gap-0
              dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]">
            <div className="flex w-full items-center justify-between gap-3 sm:gap-5">
              <div className="min-w-12 min-h-12 sm:min-w-14 sm:min-h-14
                dark:bg-studogrey rounded-full bg-white flex justify-center items-center flex-shrink-0">
                <img src={`${getCoverImage(set.course)}`} alt="" className="h-6 sm:h-7 w-auto" />
              </div>
              <div className="flex flex-col w-full min-w-0">
                <span className="font-semibold text-sm sm:text-base truncate">{set.title}</span>
                <div className="flex flex-row gap-2 sm:gap-3 items-center opacity-50">
                  <img
                    src={set.set_type.toLowerCase() === "studyset" ? Studyset : Imageset}
                    alt=""
                    className="h-3 sm:h-4 dark:invert dark:brightness-0" />
                  <span className="text-xs sm:text-sm truncate">
                    {t("added by")} {set.added_by}
                  </span>
                </div>
              </div>
              <div className="flex flex-row gap-2 sm:gap-3 items-center flex-shrink-0">
                <button onClick={() => toggleDelete(set.set_id)}>
                  <img
                    src={Delete}
                    alt="Delete"
                    className="h-6 sm:h-8 cursor-pointer dark:invert dark:brightness-0" />
                </button>
                <Link to={`/${set.set_type}/${set.set_id}`}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                    <FaChevronRight className="text-sm sm:text-base" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
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