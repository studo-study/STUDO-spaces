"use client";

import CourseToggle from "@/components/ui/app/private/course/layout/CourseToggle";
import { ChevronRight } from "lucide-react";
import CourseItemProgress from "@/components/ui/app/private/course/layout/CourseItemProgress";
import { COURSE_TABS } from "@/components/ui/app/private/course/layout/courseTabs";
import { useCourseTotals } from "@/hooks/app/courses/useCourseData";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import classNames from "@/utils/classnames";
import { useState } from "react";

const CourseSidebar: React.FC = () => {
  const t = useTranslations("flow.course");
  const [isOpen, setIsOpen] = useState(true);
  const { totalLength, done, inProgress } = useCourseTotals();

  const segments = usePathname().split("/");
  const basePath = segments.slice(0, 3).join("/");
  const activeTab = segments[3];

  return (
    <div
      className={
        "max-w-57 min-w-57 w-full min-h-0 flex-1 h-full p-5 flex flex-col gap-3"
      }
    >
      <CourseToggle />
      <CourseItemProgress
        total_length={totalLength}
        total_in_progress={inProgress}
        total_done={done}
      />

      <div className={"mt-6 flex flex-col gap-1 overflow-y-scroll"}>
        <button
          type={"button"}
          onClick={() => setIsOpen((prev) => !prev)}
          className={
            "dark:text-white/25 cursor-pointer select-none text-xs mb-1 flex justify-between items-center hover:bg-studogrey/10 transition-colors duration-300 p-1 rounded-lg"
          }
        >
          <span>{t("option")}</span>
          <ChevronRight
            size={15}
            className={classNames(isOpen && "rotate-90")}
          />
        </button>

        {isOpen &&
          COURSE_TABS.map(({ key, slug, label, Icon }) => (
            <Link
              key={key}
              href={`${basePath}/${slug}`}
              className={classNames(
                "flex flex-row items-center gap-2 px-4 py-1.5 rounded-full transition-[colors,opacity] duration-300 hover:bg-studogrey/10",
                activeTab === key
                  ? "dark:text-white bg-studogrey/10 text-studodarkblue"
                  : "dark:text-studogrey text-studodarkblue/30",
              )}
            >
              <Icon size={20} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
      </div>
    </div>
  );
};

CourseSidebar.displayName = "CourseSidebar";
export default CourseSidebar;
