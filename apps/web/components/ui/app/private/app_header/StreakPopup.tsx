"use client";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
interface StreakPopupProps {
  Streak: number;
  StreakOpen: boolean;
  setStreakOpen: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function StreakPopup({
  Streak,
  StreakOpen,
  setStreakOpen,
  containerRef,
}: StreakPopupProps) {
  const t = useTranslations("header");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setStreakOpen(false);
      }
    };

    if (StreakOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [StreakOpen, setStreakOpen, containerRef]);

  return (
    <div
      ref={popupRef}
      className={`absolute top-full right-0 mt-4
        z-[9999] w-56 truncate
        rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out origin-top
        ${
          StreakOpen
            ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
        }
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`w-full h-full flex p-5 flex-col items-center justify-center
                    transition-all duration-200 ease-out
                    ${StreakOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
                    `}
        style={{
          transitionDelay: StreakOpen ? `${1 * 50}ms` : "0ms",
        }}
      >
        <span
          className={`font-atrament bg-gradient-to-b from-orange-400
                    to-yellow-400 bg-clip-text font-bold text-transparent text-7xl transition-all duration-200 ease-out
                    ${StreakOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          style={{ transitionDelay: StreakOpen ? `${2 * 50}ms` : "0ms" }}
        >
          {Streak}
        </span>
        <span
          className={`font-atrament font-sfpro font-bold text-xl text-orange-400
                    transition-all duration-200 ease-out
                    ${StreakOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          style={{ transitionDelay: StreakOpen ? `${3 * 50}ms` : "0ms" }}
        >
          {t("day streak")}
        </span>
        <span
          className={`font-sfpro text-xs text-gray-400 transition-all duration-200 ease-out
                        ${StreakOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          style={{ transitionDelay: StreakOpen ? `${4 * 50}ms` : "0ms" }}
        >
          {t("studied")}
          {Streak}
          {t("days")}.
        </span>
      </div>
    </div>
  );
}
