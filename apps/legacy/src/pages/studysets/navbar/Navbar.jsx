import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <div className="w-full h-fit flex flex-col justify-baseline">
      <div className="w-full min-h-16 sm:min-h-20 flex flex-col justify-center gap-3 sm:gap-4 md:gap-5">
        <div className="w-full flex flex-row gap-4 sm:gap-6 md:gap-10 overflow-x-auto scroll-hidden">
          <NavLink
            to="/studysets"
            className="whitespace-nowrap h-6 flex justify-center items-center text-studodarkblue text-sm sm:text-base
              hover:scale-110 hover:text-green-300 transition-transform transition-colors duration-300 dark:text-white
              aria-[current=page]:font-bold text-studoblue dark:text-green-300">
            {t("Studysets")}
          </NavLink>

          <NavLink
            to="/folders"
            className="whitespace-nowrap h-6 flex justify-center items-center text-studodarkblue text-sm sm:text-base
              hover:scale-110 hover:text-green-300 transition-transform transition-colors duration-300 dark:text-white
              aria-[current=page]:font-bold text-studoblue dark:text-green-300">
            {t("Folders")}
          </NavLink>

          <NavLink
            to="/courses"
            className="whitespace-nowrap h-6 flex justify-center items-center text-studodarkblue text-sm sm:text-base
              hover:scale-110 hover:text-green-300 transition-transform transition-colors duration-300 dark:text-white
              aria-[current=page]:font-bold text-studoblue dark:text-green-300">
            {t("Courses")}
          </NavLink>
        </div>
        <div className="w-full h-0.5 sm:h-1 bg-studogrey rounded-full"></div>
      </div>

      <Outlet />
    </div>
  );
}