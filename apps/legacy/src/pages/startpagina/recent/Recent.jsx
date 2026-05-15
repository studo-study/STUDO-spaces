import { useTranslation } from "react-i18next";
import RecentItem from "./RecentItem.jsx";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Recent({ recent }) {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-col justify-start items-stretch
      bg-studowhite w-full
      h-auto min-h-52 sm:min-h-60 md:min-h-72 lg:min-h-[280px]
      gap-2 sm:gap-3 md:gap-4
      border-[0.5px] border-solid border-studoborder
      rounded-2xl sm:rounded-3xl md:rounded-4xl
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe]
      p-3 sm:p-5 md:py-6 md:px-6 lg:p-7
      backdrop-blur-xs
      dark:bg-gray-700
      dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      dark:border-[#8181812f] dark:border-t-studowhite dark:border-l-studowhite
      mb-4 sm:mb-6 md:mb-8"
    >
      {recent?.length > 0 && (
        <div className="w-full flex flex-row text-studodarkblue dark:text-white">
          <span className="text-base sm:text-lg md:text-xl select-none">
            {t("Recently")}:
          </span>
        </div>
      )}

      {recent?.length > 0 ? (
        <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 lg:gap-3">
          {recent.slice(0, 6).map((item, index) => (
            <RecentItem key={index} recent={item} />
          ))}
        </div>
      ) : (
        <div className="w-full flex-1 flex justify-center items-center flex-col gap-2 sm:gap-3">
          <Link
            to="/create-set"
            className="text-sm sm:text-base md:text-lg select-none flex flex-row gap-2 items-center
              hover:text-studoblue dark:hover:text-green-300 transition-colors"
          >
            {t("Create Studyset")}
            <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
          <span className="opacity-30 text-xs sm:text-sm">{t("or")}</span>
          <Link
            to="/create-visualset"
            className="text-sm sm:text-base md:text-lg select-none flex flex-row gap-2 items-center
              hover:text-studoblue dark:hover:text-green-300 transition-colors"
          >
            {t("Create Visualset")}
            <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
