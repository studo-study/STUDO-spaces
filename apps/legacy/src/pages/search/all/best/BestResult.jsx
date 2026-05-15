import { Link } from "react-router-dom";
import Studyset from "../../../../assets/icons/studyset.svg";
import Visualset from "../../../../assets/icons/visualset.svg";
import { t } from "i18next";
import Loved from "../../../../assets/icons/loved.svg";
import verified from "../../../../assets/icons/verified.svg";
import Classroom from "../../../../assets/icons/classroom.svg";
import Studoicon from "../../../../assets/icons/studoicon.svg";

export default function BestResult({ item }) {
  return (
    <Link to={`/${item.type}/${item.id}`}>
      {item.type === "studyset"
        ? renderSet(item)
        : item.type === "visualset"
          ? renderSet(item)
          : item.type === "profile"
            ? profile(item)
            : classroom(item)}
    </Link>
  );
}

function renderSet(item) {
  return (
    <div
      className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-max rounded-2xl sm:rounded-3xl
      bg-studogrey flex flex-col p-3 sm:p-4
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      border-[0.5px] border-solid
      dark:border-t-gray-500 dark:border-l-gray-500
      border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
      hover:scale-[1.01] transition-transform"
    >
      <div
        className="h-10 sm:h-13 flex flex-row justify-baseline gap-2 sm:gap-3
        font-bold truncate text-ellipsis items-center w-full"
      >
        <img
          src={item.type === "studyset" ? Studyset : Visualset}
          alt="seticon"
          className="h-5 sm:h-7 w-fit items-center dark:invert dark:brightness-0 flex-shrink-0"
        />
        <span className="text-base sm:text-lg truncate">{item.title}</span>
      </div>
      <div className="flex flex-row justify-baseline gap-1.5 sm:gap-2 items-center pb-6 sm:pb-10">
        <span className="w-fit px-2 py-1 text-xs sm:text-sm font-bold bg-studogrey rounded-full sm:rounded-4xl">
          {item.items} {item.type === "studyset" ? t("cards") : t("images")}
        </span>
        <div className="h-1 w-1 rounded-full dark:bg-white bg-studodarkblue flex-shrink-0"></div>
        <div className="flex flex-row items-center gap-1 min-w-0">
          <img
            src={Loved}
            className="h-3 sm:h-4 w-fit items-center flex-shrink-0"
          />
          <span className="text-xs sm:text-sm truncate">
            {item.likes} {t("likes")}
          </span>
        </div>
      </div>
      <div className="w-full h-6 sm:h-8 rounded-full sm:rounded-4xl items-center flex flex-row gap-1.5 sm:gap-2">
        <div className="rounded-full w-5 h-5 sm:w-6 sm:h-6 bg-studogrey overflow-hidden flex-shrink-0">
          <img
            src={item.verified ? Studoicon : item.img_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <Link
          to={`/profile/${item.owner_id}`}
          className="flex flex-row items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full sm:rounded-3xl bg-studogrey min-w-0 flex-1"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="truncate text-xs sm:text-sm hover:underline">
            {item.owner}
          </span>
          {item.verified && (
            <div className="relative flex items-center flex-shrink-0">
              <img
                src={verified}
                alt="verified"
                className="h-3 sm:h-4 cursor-pointer"
              />
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}

function classroom(item) {
  return (
    <div
      className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-h-fit rounded-2xl sm:rounded-3xl
      bg-studogrey flex flex-col p-3 sm:p-4
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      border-[0.5px] border-solid
      dark:border-t-gray-500 dark:border-l-gray-500
      border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
      hover:scale-[1.01] transition-transform gap-2 sm:gap-3"
    >
      <div className="w-full h-10 sm:h-13 flex flex-row justify-baseline gap-2 sm:gap-4 items-center">
        <img
          src={Classroom}
          alt=""
          className="h-5 sm:h-6 w-fit items-center dark:invert dark:brightness-0 flex-shrink-0"
        />
        <span className="font-bold text-base sm:text-lg truncate">
          {item.name}
        </span>
      </div>
      <div className="flex flex-row items-center gap-1 text-xs sm:text-sm flex-wrap">
        <span className="font-bold whitespace-nowrap">{t("owned by:")}</span>
        <Link
          to={`/profile/${item.owner_id}`}
          className="flex flex-row items-center w-fit gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full sm:rounded-3xl bg-studogrey min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="truncate w-fit text-xs sm:text-sm hover:underline">
            {item.owner}
          </span>
          {item.verified && (
            <div className="relative flex items-center flex-shrink-0">
              <img
                src={verified}
                alt="verified"
                className="h-3 sm:h-4 cursor-pointer"
              />
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}

function profile(item) {
  return (
    <div
      className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-max rounded-2xl sm:rounded-3xl
      bg-studogrey flex flex-col p-3 sm:p-4
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      border-[0.5px] border-solid
      dark:border-t-gray-500 dark:border-l-gray-500
      border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
      hover:scale-[1.01] transition-transform"
    >
      <div className="w-full h-fit flex flex-row items-center gap-3 sm:gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-25 md:h-25 rounded-full overflow-hidden bg-amber-300 flex-shrink-0">
          <img
            src={item.verified ? Studoicon : item.img_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-baseline gap-1 sm:gap-2 min-w-0 flex-1">
          <span className="text-lg sm:text-xl font-bold truncate w-full">
            {item.displayName}
          </span>
          <span className="bg-studogrey rounded-full sm:rounded-4xl px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm md:text-md flex items-center">
            {item.role}
          </span>
        </div>
      </div>
    </div>
  );
}
