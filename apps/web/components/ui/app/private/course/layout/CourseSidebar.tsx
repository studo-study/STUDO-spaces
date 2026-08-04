"use client";

import CourseToggle from "@/components/ui/app/private/course/layout/CourseToggle";
import { Layers, NotebookText, Rows3, ScrollText } from "lucide-react";
import CourseItemProgress from "@/components/ui/app/private/course/layout/CourseItemProgress";
import { useCourseTotals } from "@/hooks/app/courses/useCourseData";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import classNames from "@/utils/classnames";
const CourseSidebar: React.FC = () => {
  const t = useTranslations("flow.course");

  const { totalLength, done, inProgress } = useCourseTotals();
  const segments = usePathname().split("/");
  const path = segments.slice(0, 3).join("/");
  const activeTab = segments[3];
  const TAB_OPTIONS = [
    {
      key: "overview",
      label: "Overview",
      icon: <ScrollText size={20} strokeWidth={1.5} />,
      href: path + "/overview",
    },
    {
      key: "flow",
      label: "Flow",
      icon: <Rows3 size={20} strokeWidth={1.5} />,
      href: path + "/flow",
    },
    {
      key: "course",
      label: "Cursus",
      icon: <NotebookText size={20} strokeWidth={1.5} />,
      href: path + "/course",
    },
    {
      key: "sets",
      label: "Sets",
      icon: <Layers size={20} strokeWidth={1.5} />,
      href: path + "/sets",
    },
  ];
  return (
    <div
      className={
        "w-full h-screen border-r border-studoborder/30 bg-studogrey/10 p-5 flex flex-col gap-3"
      }
    >
      <CourseToggle />
      <CourseItemProgress
        total_length={totalLength}
        total_in_progress={inProgress}
        total_done={done}
      />

      <div className={"mt-6 flex flex-col gap-1"}>
        <span className={"dark:text-white/25 text-xs mb-1"}>{t("option")}</span>
        {TAB_OPTIONS.map((item) => {
          return (
            <Link
              href={item.href}
              key={item.key}
              className={classNames(
                "flex flex-row items-center dark:text-white transition-[colors, opacity] duration-300 text-studodarkblue gap-2 hover:bg-studogrey/10 px-4 py-1.5 rounded-full",
                activeTab === item.key
                  ? " dark:text-white bg-studogrey/10"
                  : "dark:text-studogrey text-studodarkblue/30",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

CourseSidebar.displayName = "CourseSidebar";
export default CourseSidebar;
