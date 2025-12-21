import studyset from "../../../../../public/assets/icons/studyset.svg";
import visual from "../../../../../public/assets/icons/visualset.svg";
import folder from "../../../../../public/assets/icons/folder2.svg";
import learn from "../../../../../public/assets/icons/pencil.svg";
import speedy from "../../../../../public/assets/icons/clock.svg";
import cards from "../../../../../public/assets/icons/cards.svg";
import pin from "../../../../../public/assets/icons/pin-icon.svg";
import point from "../../../../../public/assets/icons/point.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

export default function ToolsPopup({ MethodsOpen, setMethodsOpen, triggerRef }) {
  const { t } = useTranslation();
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setMethodsOpen(false);
      }
    };

    if (MethodsOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [MethodsOpen, setMethodsOpen, triggerRef]);

  return (
    <div
      ref={popupRef}
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-3
        z-[9999] flex flex-col items-center p-3 gap-3
        text-[#2a3a42] w-45 justify-baseline
        rounded-3xl border border-white/30
        shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
        bg-[rgba(224,224,224,0.2)] backdrop-blur-md
        dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        transition-all duration-300 ease-in-out origin-top dark:text-white
        ${MethodsOpen
        ? "opacity-100 scale-100 visible pointer-events-auto"
        : "opacity-0 scale-95 invisible pointer-events-none"}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <span className={"w-full flex justify-baseline opacity-50 pl-2"}>{t("studysets")}</span>
      <div className={"flex flex-col gap-3 w-full p-0 items-baseline justify-baseline"}>
        <Link to={"/learn"}
              className={"w-full flex px-4 py-2 rounded-full pl-7 bg-studogrey items-center justify-baseline gap-2"}>
          <img src={learn} alt="learn" className={"h-4 dark:invert dark:brightness-0"} />
          {t("learn")}
        </Link>
        <Link to={"/speedy"}
              className={"w-full flex px-4 py-2 rounded-full pl-7 bg-studogrey items-center justify-baseline gap-2"}>
          <img src={speedy} alt="speedy" className={"h-4 dark:invert dark:brightness-0"} />
          {t("speedy")}
        </Link>
        <Link to={"/flashcards"}
              className={"w-full flex px-4 py-2 rounded-full pl-7 bg-studogrey items-center justify-baseline gap-2"}>
          <img src={cards} alt="learn" className={"h-4 dark:invert dark:brightness-0"} />
          {t("flashcards")}
        </Link>
      </div>
      <span className={"w-full flex justify-baseline opacity-50 pl-2"}>{t("visualsets")}</span>
      <div className={"flex flex-col gap-3 w-full p-0 items-baseline justify-baseline"}>
        <Link to={"/identify"}
              className={"w-full flex px-4 py-2 rounded-full pl-7 bg-studogrey items-center justify-baseline gap-2"}>
          <img src={pin} alt="learn" className={"h-4 dark:invert dark:brightness-0"} />
          {t("pin")}
        </Link>
        <Link to={"/point"}
              className={"w-full flex px-4 py-2 rounded-full pl-7 bg-studogrey items-center justify-baseline gap-2"}>
          <img src={point} alt="speedy" className={"h-4 dark:invert dark:brightness-0"} />
          {t("point")}
        </Link>
      </div>
    </div>
  );
}