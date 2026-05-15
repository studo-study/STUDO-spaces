import Recent from "./recent/Recent.jsx";
import Courses from "./courses/Courses.jsx";
import left from "../../assets/icons/left.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import Footer from "../../components/footer/Footer.jsx";
import Classmates from "./classmates/Classmates.jsx";
import CoursesSkeleton from "../../components/skeletons/startpagina/CoursesSkeleton.jsx";
import RecentSkeleton from "../../components/skeletons/startpagina/RecentSkeleton.jsx";
import ClassmatesSkeleton from "../../components/skeletons/startpagina/ClassmatesSkeleton.jsx";

export default function StartingPagina() {
  const { t } = useTranslation();

  const { data = {}, isLoading: isLoadingUser } = useSWR("users/me/start", {
    refreshInterval: 300000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center pt-24 sm:pt-30 lg:pt-35 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full sm:w-11/12 md:w-4/5 lg:w-[65%] xl:w-3/5 flex-col items-center justify-start gap-2 sm:gap-3 md:gap-4">
          {/* Sets section app_footer */}
          <Link
            to="/studysets"
            className="flex flex-row gap-2 items-center justify-start text-studodarkblue
              dark:text-white font-atrament text-lg sm:text-xl w-full"
          >
            {t("SETS")}
            <img
              src={left}
              className="rotate-180 h-5 sm:h-6 md:h-7 dark:invert dark:brightness-0"
              alt=""
            />
          </Link>

          {/* Recent section */}
          {!isLoadingUser && data.lastTen && <Recent recent={data.lastTen} />}
          {isLoadingUser && <RecentSkeleton />}

          {/* courses and Activity grid */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {/* courses column */}
            <div className="w-full">
              <Link
                to="/courses"
                className="flex flex-row gap-2 items-center justify-start text-studodarkblue
                  dark:text-white font-atrament text-lg sm:text-xl w-full"
              >
                {t("COURSES")}
                <img
                  src={left}
                  className="rotate-180 h-5 sm:h-6 md:h-7 dark:invert dark:brightness-0"
                  alt=""
                />
              </Link>
              {!isLoadingUser && data.courses && (
                <Courses courses={data.courses} />
              )}
              {isLoadingUser && <CoursesSkeleton />}
            </div>

            {/* Activity column */}
            <div className="w-full">
              <Link
                to="/classrooms"
                className="flex flex-row gap-2 items-center justify-start
                  text-studodarkblue dark:text-white font-atrament text-lg sm:text-xl w-full"
              >
                {t("ACTIVITY")}
                <img
                  src={left}
                  className="rotate-180 h-5 sm:h-6 md:h-7 dark:invert dark:brightness-0"
                  alt=""
                />
              </Link>
              {isLoadingUser && <ClassmatesSkeleton />}
              {!isLoadingUser &&
                (data.class && data.class.length > 0 ? (
                  <Classmates classMates={data.class} />
                ) : (
                  <div className="w-full mt-3 sm:mt-4 md:mt-7">
                    <div
                      className="flex justify-center items-center
                      bg-studowhite min-h-32 sm:min-h-36 md:min-h-40 w-full
                      border-1 border-transparent border-studoborder rounded-2xl sm:rounded-4xl
                      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-3 backdrop-blur-xs
                      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                      mb-6 sm:mb-8 md:mb-10
                      border-[0.5px] border-solid
                      dark:border-t-gray-500 dark:border-l-gray-500
                      border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]"
                    >
                      <span className="text-sm sm:text-base text-studodarkblue/60 dark:text-white/60">
                        {t("no activity")}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer - always at bottom */}
      <div className="w-full mt-auto pt-4">
        <Footer />
      </div>
    </div>
  );
}
