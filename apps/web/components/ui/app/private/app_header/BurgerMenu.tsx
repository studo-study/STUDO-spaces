"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import UserPopup from "@/components/ui/app/private/app_header/popups/BurgerPopup";
import classNames from "@/utils/classnames";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import {
  Album,
  BookOpen,
  GraduationCap,
  House,
  Layers,
  Search,
  SquareStack,
} from "lucide-react";

interface BurgerProps {
  burgerOpen: boolean;
  toggleSearch: () => void;
  toggleCreate: () => void;
}

const main = [
  {
    icon: <House size={20} />,
    iconSelect: <House size={20} />,
    link: "/home",
    label: "home",
  },
  {
    icon: <Layers size={20} />,
    link: "/your-files/sets",
    label: "sets",
  },
  {
    icon: <BookOpen size={20} />,
    link: "/your-files/courses",
    label: "courses",
  },
];

const sec = [
  {
    icon: <GraduationCap size={20} />,
    link: "/classrooms",
    label: "classrooms",
  },
];

export default function BurgerMenu({ burgerOpen, toggleSearch }: BurgerProps) {
  const t = useTranslations("header");
  const pathname = usePathname();
  const isActive = (link: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|de)/, "");
    return (
      pathWithoutLocale === link || pathWithoutLocale.startsWith(link + "/")
    );
  };

  return (
    <div
      className={`h-full border-r select-none border-studoborder/30
            transition-[width] duration-300 flex flex-col gap-3 py-10 pb-20
            ${burgerOpen ? "w-57" : "w-30"}`}
    >
      {main.map((item, index) => (
        <BaseTooltip
          key={item.label}
          content={t(item.label)}
          position={"right"}
          hidden={burgerOpen}
        >
          <Link
            href={item.link}
            key={index}
            className={classNames(
              `w-full h-10 px-5`,
              isActive(item.link) ? "opacity-75" : "opacity-50",
            )}
          >
            <div
              className={`transition-colors duration-200 flex gap-5 rounded-4xl dark:hover:bg-studogrey hover:bg-slate-200 ${isActive(item.link) ? "dark:bg-studogrey bg-slate-200" : ""} flex-row justify-baseline px-5 items-center w-full h-10`}
            >
              <div className="flex items-center min-w-10 justify-center cursor-pointer text-2xl dark:text-white">
                {item.icon}
              </div>
              <span
                className={`dark:text-white select-none whitespace-nowrap transition-[opacity,transform] duration-200
                            ${burgerOpen ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4 pointer-events-none"}`}
              >
                {t(item.label)}
              </span>
            </div>
          </Link>
        </BaseTooltip>
      ))}

      <div className="w-full px-10 my-3 opacity-30">
        <div className="w-full h-0.5 rounded-4xl dark:bg-white bg-studodarkblue" />
      </div>
      {sec.map((item, index) => (
        <BaseTooltip
          key={item.label}
          content={t(item.label)}
          position={"right"}
          hidden={burgerOpen}
        >
          <Link
            href={item.link}
            key={index}
            className={classNames(
              `w-full h-10 px-5`,
              isActive(item.link) ? "opacity-75" : "opacity-50",
            )}
          >
            <div
              className={`transition-colors duration-200 flex gap-5 rounded-4xl dark:hover:bg-studogrey hover:bg-slate-200 ${isActive(item.link) ? "dark:bg-studogrey bg-slate-200" : ""} flex-row justify-baseline px-5 items-center w-full h-10`}
            >
              <div className="flex items-center min-w-10 justify-center cursor-pointer text-2xl dark:text-white">
                {item.icon}
              </div>
              <span
                className={classNames(
                  `dark:text-white select-none whitespace-nowrap transition-[opacity,transform] duration-200`,
                  burgerOpen
                    ? "opacity-100 translate-x-0 delay-100"
                    : "opacity-0 -translate-x-4 pointer-events-none",
                )}
              >
                {t(item.label)}
              </span>
            </div>
          </Link>
        </BaseTooltip>
      ))}
      <BaseTooltip
        content={t("search_btn")}
        position={"right"}
        hidden={burgerOpen}
      >
        <div
          onClick={toggleSearch}
          className="w-full h-10 aria-selected:opacity-100 px-5 opacity-50 cursor-pointer"
        >
          <div className="transition-colors duration-200 flex gap-5 select-none rounded-4xl dark:hover:bg-studogrey hover:bg-slate-200 flex-row justify-baseline px-5 items-center w-full h-10">
            <div className="flex items-center min-w-10 justify-center cursor-pointer text-2xl dark:text-white">
              <Search size={20} />
            </div>
            <span
              className={`dark:text-white select-none whitespace-nowrap transition-[opacity,transform] duration-200
                        ${burgerOpen ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4 pointer-events-none"}`}
            >
              {t("search_btn")}
            </span>
          </div>
        </div>
      </BaseTooltip>

      <div className="w-full h-full flex flex-col gap-3 justify-end items-baseline">
        <UserPopup burgerOpen={burgerOpen} />
      </div>
    </div>
  );
}
