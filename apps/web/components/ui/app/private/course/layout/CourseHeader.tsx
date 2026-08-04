"use client";
import { getFlowIcon } from "@/components/ui/design_system/icons/iconRegistry";
import Chip from "@/components/ui/design_system/chip/Chip";
import { HiCalendarDays, HiChevronUpDown } from "react-icons/hi2";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import { useTranslations } from "next-intl";
import { BsExclamationTriangle } from "react-icons/bs";
import { CgDanger } from "react-icons/cg";
import { IoWarningOutline } from "react-icons/io5";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCourseStore } from "@/store/slices/course/courseStore";
import {
  useActiveCourse,
  useCourseTotals,
} from "@/hooks/app/courses/useCourseData";
import CourseItemProgress from "@/components/ui/app/private/course/layout/CourseItemProgress";
import { Tabs } from "@/components/ui/design_system/tabs/Tabs";
import { Layers, NotebookText, Rows3, ScrollText } from "lucide-react";
import { usePathname } from "@/i18n/routing";
import { useCourses } from "@/hooks/app/courses/useCourses";
import classNames from "@/utils/classnames";

const CourseHeader = () => {
  const t = useTranslations("flow.course");
  const tRow = useTranslations("flow.course.row");
  const courses = useCourses().data;
  const data = useActiveCourse().data;
  const setCourseView = useCourseStore((s) => s.setCourseView);
  const { totalLength, done, inProgress } = useCourseTotals();
  const router = useRouter();
  const segments = usePathname().split("/");
  const path = segments.slice(0, 3).join("/");
  const lastSegment = segments[3] ?? "overview";
  const activeTab = (lastSegment === "course" ? "cursus" : lastSegment) as
    | "overview"
    | "cursus"
    | "sets"
    | "flow";
  const [isOpen, setIsOpen] = useState(false);

  const { Icon, color } = getFlowIcon(data?.icon ?? "");

  const openDropDown = () => {
    if (courses && courses?.length <= 1) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={"min-w-full min-h-fit flex flex-col gap-3"}>
      <div className={"flex flex-row justify-between"}>
        <div className={"relative"}>
          <div
            onClick={openDropDown}
            className={classNames(
              "w-fit flex flex-row items-center dark:text-white text-studodarkblue gap-2 transition-all duration-300  py-1 px-1 rounded-2xl",
              courses &&
                courses?.length > 1 &&
                "hover:bg-studogrey/30 cursor-pointer",
            )}
          >
            <div
              className={`bg-${color}-400/20 text-${color}-500 min-w-8 min-h-8 w-8 h-8 rounded-xl flex items-center justify-center`}
            >
              <Icon size={15} />
            </div>
            <span className={"font-bold select-none text-xl"}>
              {data?.title}
            </span>
            {courses && courses?.length > 1 && <HiChevronUpDown />}
          </div>
          {isOpen && (
            <div
              className={`
                    absolute top-full left-0 mt-2 z-9999 min-w-45 rounded-xl
                    bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
                    border border-white/50 dark:border-white/10 overflow-hidden
                    shadow-xl shadow-black/10 dark:shadow-black/30
                    transition-all duration-200 ease-out origin-top
                    ${
                      isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }
                `}
            >
              {courses?.map((course) => {
                const { Icon, color } = getFlowIcon(course.icon);
                const isActive = course.id === data?.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => {
                      router.push(`/course/${course.id}`);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer
                        ${
                          isActive
                            ? "bg-white/20 dark:bg-white/10 text-neutral-900 dark:text-white"
                            : "text-neutral-600 dark:text-neutral-300 hover:bg-white/10 dark:hover:bg-white/5"
                        }`}
                  >
                    <span
                      className={`bg-${color}-400/20 text-${color}-500 w-6 h-6 rounded-lg flex items-center justify-center shrink-0`}
                    >
                      <Icon size={12} />
                    </span>
                    <span className="truncate">{course.title}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className={"w-fit flex flex-row flex-wrap items-center gap-3"}>
          {data?.examDate && ExamDateParser(data?.examDate, t)}
          {data?.examDate &&
            ExamStatus({
              examDate: data?.examDate,
              totalRows: data?.totalRows ?? 0,
              totalDone: data?.totalDone ?? 0,
              t,
            })}
        </div>
      </div>
      <div className={"flex flex-1 min-w-50 flex-row items-center gap-2"}>
        <CourseItemProgress
          total_length={totalLength}
          total_in_progress={inProgress}
          total_done={done}
        />
        <span
          className={
            "flex flex-row min-w-fit gap-1 text-sm font-bold text-studodarkblue dark:text-white"
          }
        >
          {done + " / " + totalLength} {tRow("done")}
        </span>
      </div>
      <div className={"flex flex-row "}>
        <Tabs
          tabs={[
            {
              key: "overview",
              label: "Overview",
              icon: <ScrollText size={20} />,
              href: path + "/overview",
            },
            {
              key: "flow",
              label: "Flow",
              icon: <Rows3 size={20} />,
              href: path + "/flow",
            },
            {
              key: "cursus",
              label: "Cursus",
              icon: <NotebookText size={20} />,
              href: path + "/course",
            },
            {
              key: "sets",
              label: "Sets",
              icon: <Layers size={20} />,
              href: path + "/sets",
            },
          ]}
          value={activeTab}
          onChange={setCourseView}
        />
      </div>
    </div>
  );
};

function ExamDateParser(
  examDate: string,
  t: ReturnType<typeof useTranslations>,
) {
  return (
    <BaseTooltip content={t("exam_date")} position={"bottom"}>
      <Chip label={examDate} iconLeft={<HiCalendarDays />} />
    </BaseTooltip>
  );
}

function ExamStatus({
  examDate,
  totalRows,
  totalDone,
  t,
}: {
  examDate: string | null;
  totalRows: number;
  totalDone: number;
  t: ReturnType<typeof useTranslations>;
}) {
  if (!examDate) return null;

  const now = new Date();
  const exam = new Date(examDate);
  const diffDays = (exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return null;

  if (totalRows > 0) {
    const remainingItems = totalRows - totalDone;
    const itemsPerDay = diffDays > 0 ? remainingItems / diffDays : Infinity;

    if (itemsPerDay > 5) {
      return (
        <Chip
          label={t("behind")}
          iconLeft={<BsExclamationTriangle size={10} />}
          bgColor={"bg-rose-500"}
        />
      );
    }
    if (itemsPerDay > 3) {
      return (
        <Chip
          label={t("slightly_behind")}
          iconLeft={<CgDanger size={10} />}
          bgColor={"bg-orange-500"}
        />
      );
    }
  }

  let bgColor = "";
  let message = "";

  if (diffDays <= 1) {
    bgColor = "bg-rose-600";
    message = "Exam tomorrow";
  } else if (diffDays <= 2) {
    bgColor = "bg-rose-500";
    message = "Exam in 2 days";
  } else if (diffDays <= 3) {
    bgColor = "bg-rose-400 text-studodarkblue";
    message = "Exam in 3 days";
  } else if (diffDays <= 7) {
    bgColor = "bg-orange-400 text-studodarkblue";
    message = `Exam in ${Math.ceil(diffDays)} days`;
  } else if (diffDays <= 14) {
    bgColor = "bg-yellow-400 text-studodarkblue";
    message = "Exam in 2 weeks";
  } else {
    return null;
  }

  return (
    <BaseTooltip content={t("exam_status")} position={"bottom"}>
      <Chip
        label={message}
        iconLeft={<IoWarningOutline size={12} />}
        bgColor={bgColor}
      />
    </BaseTooltip>
  );
}

CourseHeader.displayName = "CourseDropdown";
export default CourseHeader;
