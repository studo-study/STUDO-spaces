import studyset from "../../../../assets/icons/studyset.svg";
import visual from "../../../../assets/icons/visualset.svg";
import folder from "../../../../assets/icons/folder2.svg";
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
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-3
        z-[9999] flex flex-col items-center p-2 gap-2
        font-akira text-2xl font-semibold text-[#2a3a42]
        rounded-3xl border border-white/30
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
          className="flex items-center justify-start w-30 h-8 font-atrament text-[#2a3a42]
              bg-studogrey rounded-2xl shadow-md text-base
              border-solid border-2 border-studogrey
              cursor-pointer select-none transition-transform duration-300 ease-out
              hover:scale-105 dark:text-white"
        >
          <img
            src={studyset}
            alt=""
            className="h-4 ml-3 mr-2 dark:invert dark:brightness-0"
          />
          {t("STUDYSET")}
        </div>
      </Link>

      <Link to="/create-visualset" className="w-full">
        <div
          className="flex items-center justify-start w-30 h-8 font-atrament text-base text-[#2a3a42]
              bg-studogrey rounded-2xl shadow-md
              border-solid border-2 border-studogrey
              cursor-pointer select-none transition-transform duration-300 ease-out
              hover:scale-105 dark:text-white"
        >
          <img
            src={visual}
            alt=""
            className="h-4 ml-3 mr-2 dark:invert dark:brightness-0"
          />
          {t("VISUALSET")}
        </div>
      </Link>
    </div>
  );
}
