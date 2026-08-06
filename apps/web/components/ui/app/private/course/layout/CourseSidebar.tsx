"use client";

import CourseToggle from "@/components/ui/app/private/course/layout/CourseToggle";
import { COURSE_TABS } from "@/components/ui/app/private/course/layout/courseTabs";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import classNames from "@/utils/classnames";

interface CourseSidebarProps {
  burgerOpen: boolean;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ burgerOpen }) => {
  const t = useTranslations("flow.course");
  const segments = usePathname().split("/");
  const basePath = segments.slice(0, 3).join("/");
  const activeTab = segments[3];
  const isCourseRoute = segments[1] === "course" && !!segments[2];

  return (
    <div className="w-full h-fit flex flex-col gap-1">
      <CourseToggle burgerOpen={burgerOpen} />

      {/* tabs altijd gemount → glad in-/uitklappen bij binnenkomen van een vak
          én bij het inklappen van de burger */}
      <div
        aria-hidden={!(isCourseRoute && burgerOpen)}
        className={classNames(
          "overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out",
          isCourseRoute && burgerOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="flex flex-col gap-1 pl-5 pt-1">
          <div className="pl-2 border-l border-studoborder/40 dark:border-white/10 flex flex-col gap-1">
            {COURSE_TABS.map(({ key, slug, Icon }) => (
              <Link
                key={key}
                href={`${basePath}/${slug}`}
                className={classNames(
                  "flex flex-row items-center font-sfpro gap-2.5 px-3 py-1.5 rounded-full text-[13px] transition-colors duration-200",
                  activeTab === key
                    ? "dark:text-white bg-studogrey/15 text-studodarkblue font-medium"
                    : "dark:text-studogrey text-studodarkblue/40 hover:bg-studogrey/10",
                )}
              >
                <Icon size={16} strokeWidth={1.75} />
                {t(slug)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

CourseSidebar.displayName = "CourseSidebar";
export default CourseSidebar;
