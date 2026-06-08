"use client";
import { FlowCourseResponse } from "@studo/types";
import { getFlowIcon } from "@/components/ui/design_system/icons/iconRegistry";
import CourseItemProgress from "@/components/ui/app/private/flow/page/overview/CourseItemProgress";
import { useRouter } from "next/navigation";
import ItemOptions from "@/components/ui/design_system/item_options/ItemOptions";
import { FiTrash2 } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { HiOutlineExternalLink } from "react-icons/hi";
import { CgDanger } from "react-icons/cg";
import { BsExclamationTriangle } from "react-icons/bs";

interface CourseItemProps {
  data: FlowCourseResponse;
}

const FlowCourseItem = (props: CourseItemProps) => {
  const { data } = props;
  const { Icon, color } = getFlowIcon(data.icon);
  const router = useRouter();
  const t = useTranslations("flow");

  const handleExternal = () => {
    window.open(`/flow/${data.board_id}/${data.id}`, "_blank");
  };
  const handleDelete = async () => {
    await fetch(`/api/flows/course/${data.id}`, { method: "DELETE" });
  };
  return (
    <div
      onClick={() => router.push(`/flow/${data.board_id}/${data.id}`)}
      className={
        "relative gap-5 w-full flex flex-col cursor-pointer hover:border-studoborder transition-all min-h-30 p-5 rounded-3xl text-studodarkblue dark:text-white border border-studoborder/30 bg-studogrey/30"
      }
    >
      <div className={"w-full h-fit flex flex-row gap-2"}>
        <div
          className={
            "w-full flex flex-row gap-2 min-h-15 h-full items-center overflow-hidden"
          }
        >
          <div
            className={`bg-${color}-400/20 text-${color}-500 min-w-12 min-h-12 max-h-12 max-w-12 rounded-xl flex items-center justify-center`}
          >
            <Icon size={25} />
          </div>
          <span className="flex h-full items-center text-lg font-bold max-w-[50%] line-clamp-2">
            {data.title}
          </span>
        </div>
        <div
          className={"absolute top-5 right-5 flex flex-row gap-2 items-center"}
        >
          <ItemOptions
            options={[
              {
                label: t("external"),
                icon: <HiOutlineExternalLink size={14} />,
                onClick: () => handleExternal(),
                danger: false,
              },
              {
                label: t("delete_course"),
                icon: <FiTrash2 size={14} />,
                onClick: () => handleDelete(),
                danger: true,
              },
            ]}
          />
        </div>
        <div></div>
      </div>
      <div className={"flex flex-col gap-3"}>
        <CourseItemProgress
          total_in_progress={data.total_in_progress}
          total_length={data.total_length}
          total_done={data.total_done}
        />
        <div
          className={
            "w-full flex cursor-pointer flex-row gap-1 truncate align-center justify-between"
          }
        >
          <span className={"bg-studogrey opacity-30 text-xs rounded-3xl px-2"}>
            {data.total_done} / {data.total_length} done
          </span>
          {ExamChip({
            examDate: data.exam_date,
            totalItems: data.total_length,
            doneItems: data.total_done,
          })}
        </div>
      </div>
    </div>
  );
};

FlowCourseItem.displayName = "FlowCourseItem";
export default FlowCourseItem;

function ExamChip({
  examDate,
  totalItems,
  doneItems,
}: {
  examDate: string | null;
  totalItems: number;
  doneItems: number;
}) {
  if (!examDate) return null;

  const now = new Date();
  const exam = new Date(examDate);
  const diffDays = (exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  // examen is voorbij
  if (diffDays < 0) return null;

  // behind status check
  if (totalItems > 0) {
    const remainingItems = totalItems - doneItems;
    const itemsPerDay = diffDays > 0 ? remainingItems / diffDays : Infinity;

    if (itemsPerDay > 5) {
      return (
        <div className="bg-rose-500 text-xs rounded-3xl px-2 flex items-center gap-1 text-white">
          <BsExclamationTriangle size={10} />
          behind
        </div>
      );
    }
    if (itemsPerDay > 3) {
      return (
        <div className="bg-orange-500 text-xs rounded-3xl px-2 flex items-center gap-1 text-white">
          <CgDanger size={10} />
          slightly behind
        </div>
      );
    }
  }

  // exam countdown
  let bgColor = "";
  let message = "";

  if (diffDays <= 1) {
    bgColor = "bg-rose-600 text-white";
    message = "Exam tomorrow";
  } else if (diffDays <= 2) {
    bgColor = "bg-rose-500 text-white";
    message = "Exam in 2 days";
  } else if (diffDays <= 3) {
    bgColor = "bg-rose-400 text-studodarkblue";
    message = "Exam in 3 days";
  } else if (diffDays <= 7) {
    bgColor = "bg-orange-400 text-studodarkblue ";
    message = `Exam in ${Math.ceil(diffDays)} days`;
  } else if (diffDays <= 14) {
    bgColor = "bg-yellow-400 text-studodarkblue";
    message = "Exam in 2 weeks";
  } else {
    return null;
  }

  return (
    <div className={`${bgColor} text-xs rounded-3xl px-2 py-0.5 `}>
      {message}
    </div>
  );
}
