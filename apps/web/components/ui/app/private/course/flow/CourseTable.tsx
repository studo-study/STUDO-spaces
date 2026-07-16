"use client";
import { useTranslations } from "next-intl";
import { IoIosAdd } from "react-icons/io";
import CourseRow from "@/components/ui/app/private/course/flow/CourseRow";
import { useCourseRows, useCourseTotals } from "@/hooks/app/flow/useFlowData";
import { useFlowRows } from "@/hooks/app/flow/useFlowMutations";
import { FaListCheck } from "react-icons/fa6";
import { useCourse } from "@/hooks/app/courses/useCourse";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const CourseTable = () => {
  const id = useParams().id;
  const t = useTranslations("flow.course.row");
  console.log(id);
  const data = useCourse(id as string).data;
  const rows = data?.table?.rows;

  console.log("data in questie", data);
  if (!rows) {
    return;
  }

  const containsRes = rows.some((values) => values.resources);

  return (
    <div className={"w-full flex flex-col gap-5"}>
      <div className={"w-full flex items-center gap-2 font-bold text-lg"}>
        <FaListCheck />
        <span>{t("flow_title")}</span>
      </div>
      <div>
        <div
          style={{
            gridTemplateColumns: containsRes
              ? "3% 12% 49% 20% 12% 4%"
              : "3% 12% 69% 12% 4%",
          }}
          className={
            "grid items-center text-xs font-bold border-b border-studoborder/30 h-7  text-studodarkblue/50 dark:text-white/50"
          }
        >
          <div className={"h-full"}></div>
          <span
            className={
              "px-2 h-full flex items-center border-x border-x-studoborder/30"
            }
          >
            status
          </span>
          <span
            className={
              "px-2 h-full flex items-center border-r border-r-studoborder/30"
            }
          >
            description
          </span>
          {containsRes && (
            <span
              className={
                "px-2 h-full flex items-center border-x border-x-studoborder/30"
              }
            >
              resources
            </span>
          )}
          <span
            className={
              "px-2 h-full flex items-center border-r border-r-studoborder/30"
            }
          >
            type
          </span>
          <div className={"h-full"}></div>
        </div>
        <div>
          {rows.map((row) => (
            <CourseRow
              key={row.id}
              rowId={row.id}
              containsRes={containsRes}
              courseId={data.id}
            />
          ))}
        </div>
        <div className={"flex flex-row justify-end"}>
          <button
            type="button"
            onClick={() => console.log("add")}
            className={
              "w-fit cursor-pointer items-center text-studodarkblue/50 dark:text-white/30 flex flex-row gap-2 border border-transparent hover:border-studoborder/30 rounded-full hover:bg-studogrey/30 transition-all duration-300 mt-1 px-5 h-7"
            }
          >
            <IoIosAdd size={20} />
            <span>{t("cta_add_t")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

CourseTable.displayName = "CourseTable";
export default CourseTable;
