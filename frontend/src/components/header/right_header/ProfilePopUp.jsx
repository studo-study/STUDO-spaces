import profile from "../../../../public/assets/icons/profile.svg";
import logout from "../../../../public/assets/icons/logout.svg";
import privacy from "../../../../public/assets/icons/privacy.svg";
import streak from "../../../../public/assets/icons/streak.svg";
import "animate.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

export default function ProfilePopUp({ isOpen, onClose, headerData }) {
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

  const {
    displayName = "Guest",
    email = "",
    streak_count = 0
  } = headerData || {};

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300
          ${isOpen ? "opacity-100 visible md:hidden flex" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      <div
        ref={popupRef}
        className={`fixed z-[9999] flex flex-col items-center
          p-4 sm:p-4 gap-3 font-akira text-xl sm:text-2xl text-[#2a3a42] font-semibold
          rounded-t-3xl sm:rounded-3xl border border-white/30
          shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
          glass-rgb sm:w-auto md:w-80
          dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
          transition-all duration-300 ease-out
          
          bottom-0 left-0 right-0
          sm:bottom-auto sm:left-auto sm:right-10 sm:top-27
          
          ${isOpen
          ? "translate-y-0 sm:translate-y-0 opacity-100 visible pointer-events-auto"
          : "translate-y-full sm:translate-y-0 opacity-0 invisible pointer-events-none"
        }`}>

        <div className="w-full">
          <Link to={`${parseInt(streak_count) > 2 ? "/streak" : "/account"}`}>
            <div
              className={`flex flex-col items-baseline w-full h-20 sm:h-24 font-atrament text-[#2a3a42]
                rounded-xl shadow-md
                border-solid border-2 border-studogrey justify-center
                cursor-pointer select-none transition-transform duration-300 ease-out
                ${parseInt(streak_count) > 9 ? "background-profile" : "bg-studogrey"}
                p-3 sm:p-4 overflow-hidden`}>
              <div className="overflow-hidden w-full flex flex-row items-center gap-2">
                <span className="text-lg sm:text-2xl text-start dark:text-white animate__animated animate__headShake
                  font-bold h-fit w-fit max-w-3/4 truncate">
                  {displayName}
                </span>
                <Link to="/streak">
                  <img
                    src={streak}
                    className={`${parseInt(streak_count) > 2 && parseInt(streak_count) < 10 ? "flex" : "hidden"}
                      transition-scale duration-300 hover:scale-110 h-fit w-4 sm:w-5`}
                    alt="streak"
                  />
                </Link>
              </div>
              <span className={`truncate w-full text-xs sm:text-sm text-gray-400 
                ${parseInt(streak_count) > 9 ? "dark:text-studodarkblue" : "dark:text-gray-400"} 
                font-bold font-sfpro`}>
                {email}
              </span>
            </div>
          </Link>
        </div>

        <Link to="/Account" className="w-full">
          <div className="flex items-center w-full h-12 font-atrament text-sm sm:text-base text-[#2a3a42]
            bg-studogrey rounded-xl shadow-md
            border-solid border-2 border-studogrey font-semibold
            cursor-pointer select-none transition-transform duration-300 ease-out
            hover:scale-105">
            <span className="flex items-center w-full px-3 sm:px-4 py-2 gap-2 dark:text-white">
              <img src={profile} alt="" className="h-5 sm:h-6 dark:invert dark:brightness-0" />
              {t("account").toUpperCase()}
            </span>
          </div>
        </Link>

        <Link to="/Privacy" className="w-full">
          <div className="flex items-center w-full h-12 font-atrament text-sm sm:text-base text-[#2a3a42]
            bg-studogrey rounded-xl shadow-md
            border-solid border-2 border-studogrey font-semibold
            cursor-pointer select-none transition-transform duration-300 ease-out
            hover:scale-105">
            <span className="flex items-center w-full px-3 sm:px-4 py-2 gap-2 dark:text-white">
              <img src={privacy} alt="" className="h-5 sm:h-6 dark:invert dark:brightness-0" />
              {t("privacy").toUpperCase()}
            </span>
          </div>
        </Link>

        <Link to="/logout" className="w-full">
          <div className="flex items-center w-full h-12 font-atrament text-sm sm:text-base text-[#2a3a42]
            bg-studogrey rounded-xl shadow-md
            border-solid border-2 border-studogrey font-semibold
            cursor-pointer select-none transition-transform duration-300 ease-out
            hover:scale-105">
            <span className="flex items-center w-full px-3 sm:px-4 py-2 gap-2 dark:text-white">
              <img src={logout} alt="" className="h-5 sm:h-6 dark:invert dark:brightness-0" />
              {t("Log Out").toUpperCase()}
            </span>
          </div>
        </Link>
      </div>
    </>
  );
}