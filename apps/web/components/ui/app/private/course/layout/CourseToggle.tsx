"use client";
import classNames from "@/utils/classnames";
import FlowIcon from "@/components/ui/app/private/course/layout/FlowIcon";
import SimpleMenu from "@/components/ui/design_system/simple_menu/SimpleMenu";
import { useCourses } from "@/hooks/app/courses/useCourses";
import { useActiveCourse } from "@/hooks/app/courses/useCourseData";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronsUpDown } from "lucide-react";

interface CourseToggleProps {
  burgerOpen: boolean;
}

const CourseToggle = ({ burgerOpen }: CourseToggleProps) => {
  const t = useTranslations("flow.course");
  const courses = useCourses().data;
  const data = useActiveCourse().data;
  const router = useRouter();

  const canOpen = !!courses && (courses.length > 1 || !data);

  if (courses?.length === 0) {
    return;
  }

  const trigger = (
    <div
      className={classNames(
        "w-full flex flex-row h-10 items-center overflow-hidden pr-2 rounded-full text-sm dark:text-white text-studodarkblue",
        "transition-[padding,background-color] duration-500 ease-in-out",
        burgerOpen ? "pl-1" : "pl-[calc(50%-1rem)]",
        canOpen && "hover:bg-studogrey/30 cursor-pointer",
      )}
    >
      <FlowIcon
        icon={data?.icon ?? ""}
        size={13}
        className={"min-w-8 min-h-8 w-8 h-8 rounded-full shrink-0"}
      />
      <span
        className={classNames(
          "font-bold select-none whitespace-nowrap flex-1 min-w-0 truncate",
          "transition-[opacity,max-width,margin] duration-500 ease-in-out",
          burgerOpen ? "opacity-100 max-w-40 ml-2" : "opacity-0 max-w-0 ml-0",
          !data && "text-studodarkblue/40 dark:text-white/40",
        )}
      >
        {data?.title ?? t("select_course")}
      </span>
      {canOpen && (
        <ChevronsUpDown
          size={15}
          className={classNames(
            "shrink-0 transition-[opacity,max-width] duration-500 ease-in-out",
            burgerOpen ? "opacity-50" : "opacity-0 max-w-0",
          )}
        />
      )}
    </div>
  );

  if (!canOpen) return trigger;

  return (
    <SimpleMenu
      side="right"
      align="start"
      width="w-56"
      fullWidth
      trigger={trigger}
    >
      {courses?.map((course) => {
        const isActive = course.id === data?.id;
        return (
          <button
            key={course.id}
            type="button"
            onClick={() => router.push(`/course/${course.id}/overview`)}
            className={classNames(
              "w-full flex items-center gap-2 p-1 pr-2 rounded-lg text-sm transition-colors cursor-pointer",
              isActive
                ? "bg-studogrey/20 text-studodarkblue dark:text-white"
                : "text-studodarkblue/60 dark:text-neutral-300 hover:bg-studogrey/10",
            )}
          >
            <FlowIcon
              icon={course.icon}
              size={14}
              className={"w-8 h-8 rounded-full shrink-0"}
            />
            <span className="truncate">{course.title}</span>
            {isActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-studoblue shrink-0" />
            )}
          </button>
        );
      })}
    </SimpleMenu>
  );
};

CourseToggle.displayName = "CourseToggle";
export default CourseToggle;
