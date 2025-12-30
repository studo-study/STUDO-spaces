import Recent from "./recent/Recent.jsx";
import Courses from "./courses/Courses.jsx";
import left from "../../assets/icons/left.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import Footer from "../../components/footer/Footer.jsx";
import Classmates from "./classmates/Classmates.jsx";

export default function StartingPagina() {
  const { t } = useTranslation();

  const { data = {}, isLoading: isLoadingUser } = useSWR(
    "users/me/start",
    {
      refreshInterval: 300000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  );

  return (
    <div className="w-full flex flex-col items-center justify-center pt-30 sm:pt-25 md:pt-35 px-4 sm:px-6 lg:px-8">
      <div
        className="flex w-full sm:w-11/12 md:w-4/5 lg:w-3/5 flex-col items-center justify-center gap-3 sm:gap-4 md:gap-5 pb-20">
        <Link to="/studysets"
              className="flex flex-row gap-2 items-center justify-start text-studodarkblue
                dark:text-white font-atrament text-lg sm:text-xl w-full">
          {t("SETS")}
          <img src={left} className="rotate-180 h-6 sm:h-8 dark:invert dark:brightness-0" alt="" />
        </Link>
        {!isLoadingUser && data.lastTen && <Recent recent={data.lastTen} />}

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          <div className="w-full">
            <Link to="/courses"
                  className="flex flex-row gap-2 items-center justify-start text-studodarkblue
                    dark:text-white font-atrament text-lg sm:text-xl w-full">
              {t("COURSES")}
              <img src={left} className="rotate-180 h-6 sm:h-8 dark:invert dark:brightness-0" alt="" />
            </Link>
            {!isLoadingUser && data.courses && <Courses courses={data.courses} />}
          </div>

          <div className="w-full">
            <Link to="/classrooms" className="flex flex-row gap-2 items-center justify-start
              text-studodarkblue dark:text-white font-atrament text-lg sm:text-xl w-full">
              {t("ACTIVITY")}
              <img src={left} className="rotate-180 h-6 sm:h-8 dark:invert dark:brightness-0" alt="" />
            </Link>
            {!isLoadingUser && data.class && data.class.length > 0 ? (
              <Classmates classMates={data.class} />
            ) : (
              <span className="w-full flex pt-10 sm:pt-15 md:pt-20 justify-center h-full text-sm sm:text-base">
                {t("no activity")}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
}