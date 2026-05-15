import studyset from "../../../assets/icons/studyset.svg";
import visual from "../../../assets/icons/visualset.svg";
import folder from "../../../assets/icons/folder2.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

export default function CreatePopUp({ isOpen, onClose }) {
  const { t } = useTranslation();
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={popupRef}
      className={`absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-3
        z-[9999] flex flex-col items-center p-3 sm:p-4 gap-3
        font-akira text-xl sm:text-2xl font-semibold text-[#2a3a42]
        rounded-2xl sm:rounded-3xl border border-white/30
        shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
        bg-[rgba(224,224,224,0.2)] backdrop-blur-md
        dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        transition-all duration-300 ease-in-out origin-top
        ${
          isOpen
            ? "opacity-100 scale-100 visible pointer-events-auto"
            : "opacity-0 scale-95 invisible pointer-events-none"
        }
      `}
    >
      <Link to="/create-set" className="w-full">
        <div
          className="flex items-center justify-start w-full sm:w-40 h-10 sm:h-12
          font-atrament text-sm sm:text-base text-[#2a3a42]
          bg-studogrey rounded-lg sm:rounded-xl shadow-md
          border-solid border-2 border-studogrey
          cursor-pointer select-none transition-transform duration-300 ease-out
          hover:scale-105 dark:text-white px-3"
        >
          <img
            src={studyset}
            alt=""
            className="h-5 sm:h-6 mr-2 dark:invert dark:brightness-0"
          />
          {t("STUDYSET")}
        </div>
      </Link>

      <Link to="/create-visualset" className="w-full">
        <div
          className="flex items-center justify-start w-full sm:w-40 h-10 sm:h-12
          font-atrament text-sm sm:text-base text-[#2a3a42]
          bg-studogrey rounded-lg sm:rounded-xl shadow-md
          border-solid border-2 border-studogrey
          cursor-pointer select-none transition-transform duration-300 ease-out
          hover:scale-105 dark:text-white px-3"
        >
          <img
            src={visual}
            alt=""
            className="h-5 sm:h-6 mr-2 dark:invert dark:brightness-0"
          />
          {t("VISUALSET")}
        </div>
      </Link>
    </div>
  );
}
