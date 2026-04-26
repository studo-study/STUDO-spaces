import verified from "../../../assets/icons/verified.svg";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useState } from "react";
import Verified from "./Verified.jsx";

export default function Studoheader({ profile }) {
  const { t } = useTranslation();
  const [hovering, setHovering] = useState(false);
  const hoverToggle = () => {
    setHovering((hovering) => !hovering);
  };

  return (
    <div className="relative w-full h-60 sm:h-72 md:h-80 flex justify-center
      items-center bg-amber-200 rounded-2xl sm:rounded-4xl overflow-hidden shadow-2xl">

      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none z-10" />

      <div className="absolute bottom-0 z-50 flex flex-row items-center
        bg-blue-50/90 dark:bg-gray-800/90 backdrop-blur-xl
        min-h-16 sm:min-h-20 md:min-h-22 w-full px-4 sm:px-6 py-3 sm:py-4 md:py-5
        border-t-2 border-blue-100/80 dark:border-gray-700/50
        rounded-tl-2xl rounded-tr-2xl sm:rounded-tl-4xl sm:rounded-tr-4xl
        shadow-[0_-10px_40px_rgba(0,0,0,0.1)]
        dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]
        transition-all duration-300 hover:shadow-[0_-12px_48px_rgba(0,0,0,0.15)]
        dark:hover:shadow-[0_-12px_48px_rgba(0,0,0,0.6)]">

        <div className="flex flex-col gap-2 sm:gap-3 w-full">
          <div className="flex flex-row items-center gap-2 sm:gap-3 relative flex-wrap">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-studogrey dark:bg-white
              p-1.5 sm:p-2 overflow-hidden flex-shrink-0">
              <img
                src={profile.img_url}
                alt=""
                className="w-full h-full object-cover object-center rounded-full"
              />
            </div>

            <span className="font-akira text-lg sm:text-xl md:text-2xl dark:text-white">STUDO</span>
            <span className="text-lg sm:text-xl md:text-2xl font-sfpro font-bold text-emerald-400 truncate">
              {formatTitle(profile.displayName)}
            </span>

            <div className="relative flex items-center flex-shrink-0">
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3">
                <Verified hovering={hovering} />
              </div>

              <img
                src={verified}
                alt="verified"
                className="h-4 sm:h-5 cursor-pointer"
                onMouseOver={hoverToggle}
                onMouseLeave={hoverToggle}
              />
            </div>
          </div>
        </div>
      </div>

      <img
        src={profile.banner_url}
        className="w-full h-full z-0 relative object-cover"
        alt="banner"
      />
    </div>
  );
}

function formatTitle(displayName) {
  return t(displayName.split(" ")[1]);
}