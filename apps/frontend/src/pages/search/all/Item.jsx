import { Link } from "react-router-dom";
import Studyset from "../../../assets/icons/studyset.svg";
import Visualset from "../../../assets/icons/visualset.svg";
import Classroom from "../../../assets/icons/classroom.svg";
import Studoicon from "../../../assets/icons/studoicon.svg";
import Loved from "../../../assets/icons/loved.svg";
import { t } from "i18next";
import Verified from "../../profile/studoheader/Verified.jsx";
import verified from "../../../assets/icons/verified.svg";
import { useState } from "react";

export default function SearchResultItem({ item }) {
  const [hovering, setHovering] = useState(false);
  const hoverToggle = () => {
    setHovering((hovering) => !hovering);
  };

  return (
    <Link to={`/${item.type}/${item.id}`}>
      {item.type === "studyset" ? renderSet(hoverToggle, hovering, item)
        : item.type === "visualset" ? renderSet(hoverToggle, hovering, item) :
          item.type === "profile" ? profile(item) : classroom(item)}
    </Link>
  );
}

function renderSet(hoverToggle, hovering, item) {
  return (
    <div className="w-full h-max rounded-2xl sm:rounded-3xl bg-studogrey flex flex-col p-3 sm:p-4
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      border-[0.5px] border-solid
      dark:border-t-gray-500 dark:border-l-gray-500
      border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
      hover:scale-[1.01] transition-transform">
      <div className="h-10 sm:h-13 flex flex-row justify-baseline gap-2 sm:gap-3
        font-bold truncate text-ellipsis items-center w-full text-sm sm:text-base">
        <img
          src={item.type === "studyset" ? Studyset : Visualset}
          alt="seticon"
          className="h-4 sm:h-5 w-fit items-center dark:invert dark:brightness-0 flex-shrink-0"
        />
        <span className="truncate">{item.title}</span>
      </div>
      <div className="flex flex-row justify-baseline gap-1.5 sm:gap-2 items-center pb-6 sm:pb-10">
        <span
          className="w-fit px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold bg-studogrey rounded-full sm:rounded-4xl">
          {item.items} {item.type === "studyset" ? t("cards") : t("images")}
        </span>
        <div className="h-1 w-1 rounded-full dark:bg-white bg-studodarkblue flex-shrink-0"></div>
        <div className="flex flex-row items-center gap-1 min-w-0">
          <img src={Loved} className="h-3 sm:h-4 w-fit items-center flex-shrink-0" />
          <span className="text-xs sm:text-sm truncate">{item.likes} {t("likes")}</span>
        </div>
      </div>
      <div className="w-full h-6 sm:h-8 rounded-full sm:rounded-4xl items-center flex flex-row gap-1.5 sm:gap-2">
        <div className="rounded-full w-5 h-5 sm:w-6 sm:h-6 bg-studogrey overflow-hidden flex-shrink-0">
          <img src={item.verified ? Studoicon : item.img_url} alt="" className="w-full h-full object-cover" />
        </div>
        <Link
          to={`/profile/${item.owner_id}`}
          className="flex flex-row items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full sm:rounded-3xl bg-studogrey min-w-0 flex-1"
          onClick={(e) => e.stopPropagation()}>
          <span className="truncate text-xs sm:text-sm hover:underline">{item.owner}</span>
          {item.verified && (
            <div className="relative flex items-center flex-shrink-0">
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden sm:block">
                <Verified hovering={hovering} />
              </div>
              <img
                src={verified}
                alt="verified"
                className="h-3 sm:h-4 cursor-pointer"
                onMouseOver={hoverToggle}
                onMouseLeave={hoverToggle}
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
    <div className="w-full max-h-fit rounded-2xl sm:rounded-3xl bg-studogrey flex flex-col p-3 sm:p-4
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      border-[0.5px] border-solid
      dark:border-t-gray-500 dark:border-l-gray-500
      border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
      hover:scale-[1.01] transition-transform gap-2 sm:gap-3">
      <div className="w-full h-10 sm:h-13 flex flex-row justify-baseline gap-2 sm:gap-4 items-center">
        <img
          src={Classroom}
          alt=""
          className="h-5 sm:h-6 w-fit items-center dark:invert dark:brightness-0 flex-shrink-0"
        />
        <span className="font-bold text-base sm:text-lg truncate">{item.name}</span>
      </div>
      <div className="flex flex-row items-center gap-1 text-xs sm:text-sm flex-wrap">
        <span className="font-bold whitespace-nowrap">{t("owned by:")}</span>
        <Link
          to={`/profile/${item.owner_id}`}
          className="flex flex-row items-center w-fit gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full sm:rounded-3xl bg-studogrey min-w-0"
          onClick={(e) => e.stopPropagation()}>
          <span className="truncate w-fit text-xs sm:text-sm hover:underline">{item.owner}</span>
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
    <div className="w-full h-max rounded-2xl sm:rounded-3xl bg-studogrey flex flex-col p-3 sm:p-4
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      border-[0.5px] border-solid
      dark:border-t-gray-500 dark:border-l-gray-500
      border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
      hover:scale-[1.01] transition-transform">
      <div className="w-full h-fit flex flex-row items-center gap-3 sm:gap-5">
        <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-studogrey overflow-hidden flex-shrink-0">
          <img src={item.studoProfile ? Studoicon : item.img_url} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col items-baseline gap-1 sm:gap-2 min-w-0 flex-1">
          <span className="flex flex-row items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-bold truncate w-full">
            <span className="truncate">{item.name}{item.displayName}</span>
            {item.studoProfile && (
              <img src={verified} alt="verified" className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
            )}
          </span>
          <span
            className="flex flex-row text-xs sm:text-sm items-center w-fit gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full sm:rounded-3xl bg-studogrey">
            {item.role}
          </span>
        </div>
      </div>
    </div>
  );
}