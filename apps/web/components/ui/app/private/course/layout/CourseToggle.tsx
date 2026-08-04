import classNames from "@/utils/classnames";
import { HiChevronUpDown } from "react-icons/hi2";
import FlowIcon from "@/components/ui/app/private/course/layout/FlowIcon";
import { useCourses } from "@/hooks/app/courses/useCourses";
import { useActiveCourse } from "@/hooks/app/courses/useCourseData";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CourseToggle = () => {
  const courses = useCourses().data;
  const data = useActiveCourse().data;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const openDropDown = () => {
    if (courses && courses?.length <= 1) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={" flex flex-row items-center gap-3"}>
      <div className={"relative min-w-0 flex-1"}>
        <div className={"flex flex-row gap-3 items-center w-full"}>
          <div
            onClick={openDropDown}
            className={classNames(
              "w-full flex flex-row items-center dark:text-white text-studodarkblue gap-2 transition-all duration-300  py-1 px-1 rounded-2xl",
              courses &&
                courses?.length > 1 &&
                "hover:bg-studogrey/30 cursor-pointer",
            )}
          >
            <FlowIcon
              icon={data?.icon ?? ""}
              size={15}
              className={"min-w-8 min-h-8 w-8 h-8 rounded-xl"}
            />
            <span className={"font-bold select-none truncate min-w-0 flex-1"}>
              {data?.title}
            </span>
            {courses && courses?.length > 1 && <HiChevronUpDown />}
          </div>
        </div>
        {isOpen && (
          <div
            className={`
                    absolute top-full left-0 mt-2 z-9999 min-w-45 w-full rounded-xl
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
              const isActive = course.id === data?.id;
              return (
                <button
                  key={course.id}
                  onClick={() => {
                    router.push(`/course/${course.id}`);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 pr-6 py-2 text-sm transition-colors cursor-pointer
                        ${
                          isActive
                            ? "bg-white/20 dark:bg-white/10 text-neutral-900 dark:text-white"
                            : "text-neutral-600 dark:text-neutral-300 hover:bg-white/10 dark:hover:bg-white/5"
                        }`}
                >
                  <FlowIcon
                    icon={course.icon}
                    size={12}
                    className={"w-6 h-6 rounded-lg shrink-0"}
                  />
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
    </div>
  );
};

CourseToggle.displayName = "CourseToggle";
export default CourseToggle;
