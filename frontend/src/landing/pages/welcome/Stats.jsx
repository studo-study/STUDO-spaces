import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiTool } from "react-icons/fi";
import { TbFreeRights } from "react-icons/tb";
import { IoMdInfinite } from "react-icons/io";

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: FiTool,
      label: t("5 study tools"),
      ariaLabel: t("Five different study tools available")
    },
    {
      icon: IoMdInfinite,
      label: t("endless sets"),
      ariaLabel: t("Create unlimited study sets")
    },
    {
      icon: TbFreeRights,
      label: t("100% free"),
      ariaLabel: t("Completely free to use")
    }
  ];

  return (
    <section
      ref={ref}
      aria-label={t("Platform statistics")}
      className={`
        w-full max-w-screen flex justify-center items-center
        md:px-20
        transition-all duration-700
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
      `}
    >
      <ul
        className={`
          flex flex-col md:flex-row items-center justify-center gap-4
          w-fit md:min-w-[40%] rounded-3xl
          md:rounded-full
          bg-gradient-to-r from-emerald-400 to-emerald-500
          dark:bg-none dark:backdrop-blur-md
          border border-studoborder/20
          py-4 px-6 md:px-8
          shadow-lg hover:shadow-2xl
          transition-all duration-300
          list-none
        `}
        role="list"
      >
        {stats.map((stat, index) => (
          <li key={index} className="contents">
            <div
              className="flex flex-col items-center justify-center text-white text-center gap-2 md:gap-1 px-3"
              aria-label={stat.ariaLabel}
            >
              <stat.icon className="text-3xl md:text-4xl" aria-hidden="true" />
              <span className="font-bold text-lg md:text-xl">{stat.label}</span>
            </div>

            {/* Separator - only between items, not after last */}
            {index < stats.length - 1 && (
              <div
                className="hidden md:block h-12 border-l-2 border-white mx-4"
                role="separator"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}