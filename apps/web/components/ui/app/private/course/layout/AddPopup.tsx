"use client";
import { useTranslations } from "next-intl";
import SimpleMenu from "@studo/ui/design_system/simple_menu/SimpleMenu";
import { IoIosAdd } from "react-icons/io";
import { FiBookOpen } from "react-icons/fi";
import { FaChevronRight } from "react-icons/fa";
import { HiOutlineViewGridAdd } from "react-icons/hi";

export default function CourseAdd() {
  const t = useTranslations("header");
  return (
    <SimpleMenu
      trigger={
        <button className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300">
          <div className="absolute bg-purple-500/50 h-8 w-8 rounded-full blur-sm" />
          <div className="relative z-10 shadow-2xl bg-purple-500 h-8 min-w-8 text-3xl flex items-center justify-center text-white rounded-full border border-studoborder">
            <IoIosAdd />
          </div>
        </button>
      }
    >
      {(isOpen: boolean) => {
        return (
          <div className="relative flex flex-col gap-1">
            <div
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl
                text-studodarkblue dark:text-white cursor-pointer
                hover:bg-linear-to-r hover:from-violet-400 to-purple-500 hover:text-white
                transition-all duration-200 ease-out
                ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
              `}
              style={{
                transitionDelay: isOpen ? `50ms` : "0ms",
              }}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg
                bg-linear-to-br from-violet-400 to-purple-500
                shadow-md shadow-black/10
                group-hover:scale-110 group-hover:shadow-lg
                transition-all duration-200`}
              >
                <FiBookOpen />
              </div>
              <span className="font-medium text-sm">{t("create_c")}</span>
              <FaChevronRight
                size={10}
                className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              />
            </div>
            <div
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl
                text-studodarkblue dark:text-white cursor-pointer
                hover:bg-linear-to-r hover:from-purple-600 to-purple-700 hover:text-white
                transition-all duration-200 ease-out
                ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
              `}
              style={{
                transitionDelay: isOpen ? `100ms` : "0ms",
              }}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg
                bg-linear-to-br from-purple-600 to-purple-700
                shadow-md shadow-black/10
                group-hover:scale-110 group-hover:shadow-lg
                transition-all duration-200`}
              >
                <HiOutlineViewGridAdd />
              </div>
              <span className="font-medium text-sm">{t("create_b")}</span>
              <FaChevronRight
                size={10}
                className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              />
            </div>
          </div>
        );
      }}
    </SimpleMenu>
  );
}
