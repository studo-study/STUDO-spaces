import studyset from "../../../assets/icons/studyset.svg";
import visual from "../../../assets/icons/visualset.svg";
import folder from "../../../assets/icons/folder2.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

export default function AddPopUp({ isOpen, onClose }) {
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300
          ${isOpen ? "opacity-100 visible flex md:hidden" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* Popup - slides up from bottom on mobile, stays top-right on desktop */}
      <div
        ref={popupRef}
        className={`fixed z-[9999] flex flex-col items-center
          p-4 sm:p-4 gap-3 font-akira text-xl sm:text-2xl font-semibold text-[#2a3a42]
          rounded-t-3xl sm:rounded-3xl border border-white/30
          shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
          glass-rgb w-full sm:w-auto
          dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
          transition-all duration-300 ease-out
          
          bottom-0 left-0 right-0
          sm:bottom-auto sm:left-auto sm:right-30 sm:top-27
          
          ${isOpen
          ? "translate-y-0 sm:translate-y-0 opacity-100 visible pointer-events-auto"
          : "translate-y-full sm:translate-y-0 opacity-0 invisible pointer-events-none"
        }`}>

        <Link to="/create-set" className="w-full">
          <div className="flex items-center w-full sm:w-56 h-12 font-atrament text-sm sm:text-base text-[#2a3a42]
            bg-studogrey rounded-xl shadow-md
            border-solid border-2 border-studogrey
            cursor-pointer select-none transition-transform duration-300 ease-out
            hover:scale-105">
            <span className="flex items-center w-full px-3 sm:px-4 py-2 gap-2 dark:text-white">
              <img src={studyset} alt="" className="h-5 sm:h-6 dark:invert dark:brightness-0" />
              {t("CREATE STUDYSET")}
            </span>
          </div>
        </Link>

        <Link to="/create-visualset" className="w-full">
          <div className="flex items-center w-full sm:w-56 h-12 font-atrament text-sm sm:text-base text-[#2a3a42]
            bg-studogrey rounded-xl shadow-md
            border-solid border-2 border-studogrey
            cursor-pointer select-none transition-transform duration-300 ease-out
            hover:scale-105">
            <span className="flex items-center w-full px-3 sm:px-4 py-2 gap-2 dark:text-white">
              <img src={visual} alt="" className="h-5 sm:h-6 dark:invert dark:brightness-0" />
              {t("CREATE VISUALSET")}
            </span>
          </div>
        </Link>

        <Link to="/create-folder" className="w-full">
          <div className="flex items-center w-full sm:w-56 h-12 font-atrament text-sm sm:text-base text-[#2a3a42]
            bg-studogrey rounded-xl shadow-md
            border-solid border-2 border-studogrey
            cursor-pointer select-none transition-transform duration-300 ease-out
            hover:scale-105">
            <span className="flex items-center w-full px-3 sm:px-4 py-2 gap-2 dark:text-white">
              <img src={folder} alt="" className="h-5 sm:h-6 dark:invert dark:brightness-0" />
              {t("CREATE FOLDER")}
            </span>
          </div>
        </Link>
      </div>
    </>
  );
}