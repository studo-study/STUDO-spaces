import { useTranslation } from "react-i18next";
import RecentItem from "./RecentItem.jsx";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Recent({ recent }) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-around items-baseline flex-col
      bg-studowhite min-h-60 sm:min-h-72 md:min-h-80 h-fit w-full gap-3 sm:gap-4
      border-1 border-gray-300 rounded-2xl sm:rounded-4xl
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe]
      p-4 px-4 sm:p-6 sm:px-6 md:p-10 md:px-7 backdrop-blur-xs
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      mb-6 sm:mb-8 md:mb-10
      border-[0.5px] border-solid
      dark:border-t-gray-500 dark:border-l-gray-500 border-black
      dark:border-[#8181812f] dark:border-t-[#ffffff] dark:border-l-[#f2f2f2]">

      {recent && recent.length > 0 && (
        <div className="w-full flex flex-row justify-baseline text-studodarkblue dark:text-white">
          <span className="text-lg sm:text-xl select-none">{t("Recently")}:</span>
        </div>
      )}

      {recent && recent.length > 0 ? (
        <div className="
    w-full h-fit
    grid
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-2
     md:grid-rows-3
    md:min-h-65
    gap-2
    sm:gap-3
    lg:gap-4
  ">
          {recent.slice(0, 6).map((item, index) => (
            <RecentItem key={index} recent={item} />
          ))}
        </div>
      ) : (
        <div className="w-full h-fit min-h-40 sm:min-h-48 flex justify-center items-center flex-col gap-3">
          <Link
            to="/create-set"
            className="text-base sm:text-lg md:text-xl select-none flex flex-row gap-2 sm:gap-3 items-center
              hover:text-studoblue dark:hover:text-green-300 transition-colors">
            {t("Create Studyset")}
            <FaArrowRight />
          </Link>
          <span className="opacity-30 text-sm sm:text-base">{t("or")}</span>
          <Link
            to="/create-visualset"
            className="text-base sm:text-lg md:text-xl select-none flex flex-row gap-2 sm:gap-3 items-center
              hover:text-studoblue dark:hover:text-green-300 transition-colors">
            {t("Create Visualset")}
            <FaArrowRight />
          </Link>
        </div>
      )}
    </div>
  );
}