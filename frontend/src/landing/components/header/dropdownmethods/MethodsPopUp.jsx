import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import ss from "../../../../../public/assets/icons/studyset.svg";
import vs from "../../../../../public/assets/icons/visualset.svg";
import ai from "../../../../../public/assets/icons/sparkle.svg";

export default function MethodsPopUp({ MethodsOpen, setMethodsOpen, triggerRef }) {
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
        text-[#2a3a42] w-40 justify-baseline
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
      <div className={"flex flex-col gap-3 w-full p-0 items-baseline justify-baseline"}>
        <Link to={"/about-studysets"}
              className={"w-full flex px-4 py-2 rounded-full bg-studogrey items-center justify-center gap-2"}>
          <img src={ss} alt="learn" className={"h-4 dark:invert dark:brightness-0"} />
          {t("studysets")}
        </Link>
        <Link to={"/about-visualsets"}
              className={"w-full flex px-4 py-2 rounded-full bg-studogrey items-center justify-center gap-2"}>
          <img src={vs} alt="speedy" className={"h-4 dark:invert dark:brightness-0"} />
          {t("visualsets")}
        </Link>
        <Link to={"/about-ai"}
              className={"w-full flex px-4 py-2 rounded-full bg-studogrey items-center justify-center gap-2"}>
          <img src={ai} alt="learn" className={"h-4 dark:invert dark:brightness-0"} />
          {t("ai")}
        </Link>
      </div>
    </div>
  );
}