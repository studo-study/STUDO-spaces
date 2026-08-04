"use client";

import CourseToggle from "@/components/ui/app/private/course/layout/CourseToggle";
import {
  BookText,
  ChevronRight,
  Layers,
  LayoutGrid,
  SquareCheck,
} from "lucide-react";
import CourseItemProgress from "@/components/ui/app/private/course/layout/CourseItemProgress";
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
  const path = segments.slice(0, 3).join("/");
  const activeTab = segments[3];
  const TAB_OPTIONS = [
    {
      sectionTitle: "option",
      isOpen: isOpen,
      setIsOpen: setIsOpen,
      items: [
        {
          key: "overview",
          label: "Overview",
          icon: <LayoutGrid size={20} strokeWidth={1.5} />,
          href: path + "/overview",
        },
        {
          key: "flow",
          label: "Flow",
          icon: <SquareCheck size={20} strokeWidth={1.5} />,
          href: path + "/flow",
        },
        {
          key: "course",
          label: "Cursus",
          icon: <BookText size={20} strokeWidth={1.5} />,
          href: path + "/course",
        },
        {
          key: "sets",
          label: "Sets",
          icon: <Layers size={20} strokeWidth={1.5} />,
          href: path + "/sets",
        },
      ],
    },
  ];
  return (
    <div
      className={
        " max-w-57 min-w-57 w-full min-h-0 flex-1 h-full p-5 flex flex-col gap-3"
      }
    >
      <CourseToggle />
      <CourseItemProgress
        total_length={totalLength}
        total_in_progress={inProgress}
        total_done={done}
      />

      <div className={"mt-6 flex flex-col gap-1 overflow-y-scroll"}>
        {TAB_OPTIONS.map((section) => {
          return (
            <div key={section.sectionTitle} className={"flex flex-col gap-1"}>
              <div
                onClick={() => section.setIsOpen((prev) => !prev)}
                className={
                  "dark:text-white/25 cursor-pointer select-none text-xs mb-1 flex justify-between items-center hover:bg-studogrey/10 transition-colors duration-300 p-1 rounded-lg"
                }
              >
                <span className={"flex flex-row gap-1 items-center"}>
                  {t(section.sectionTitle)}
                </span>
                <ChevronRight
                  size={15}
                  className={classNames(section.isOpen && "rotate-90")}
                />
              </div>
              <div
                className={classNames(
                  "flex flex-col min-h-0 gap-1 transition-all",
                )}
              >
                {isOpen &&
                  section.items.map((item) => {
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
        })}
      </div>
    </div>
  );
};

CourseSidebar.displayName = "CourseSidebar";
export default CourseSidebar;
