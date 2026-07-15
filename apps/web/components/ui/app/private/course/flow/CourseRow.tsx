"use client";
import { useTranslations } from "next-intl";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useState } from "react";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import RowSelector from "@/components/ui/app/private/course/flow/RowSelector";
import { RiPencilFill, RiProgress4Line, RiProgress8Line } from "react-icons/ri";
import { TbCircle, TbWriting } from "react-icons/tb";
import { FaRegCircleCheck } from "react-icons/fa6";
import { CiTextAlignLeft } from "react-icons/ci";
import { IoMdBook } from "react-icons/io";
import TagSelector from "@/components/ui/design_system/tag/TagSelector";
import { LuLink } from "react-icons/lu";
import ResourceIcon from "@/components/ui/app/private/course/flow/ResourceIcon";
import { HiCalendarDays } from "react-icons/hi2";
import { useFlowCourse } from "@/hooks/app/flow/useFlowData";
import { useFlowRows } from "@/hooks/app/flow/useFlowMutations";

interface CourseRowProps {
  rowId: string;
  containsRes: boolean;
}

const CourseRow = (props: CourseRowProps) => {
  const { rowId, containsRes } = props;
  const data = useFlowCourse().data?.rows.find((r) => r.id === rowId);
  const { updateRow } = useFlowRows();
  const t = useTranslations("flow.course.row");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleOpen = () => setIsOpen((prev) => !prev);

  if (!data) return null;

  const onChange = (updates: Record<string, unknown>) =>
    updateRow(rowId, updates);

  return (
    <div
      className={`flex flex-col border-b border-studoborder/30 cursor-pointer`}
    >
      <div
        style={{
          gridTemplateColumns: containsRes
            ? "3% 12% 49% 20% 12% 4%"
            : "3% 12% 69% 12% 4%",
        }}
        className={`grid items-center h-10  text-studodarkblue  text-sm overflow-visible dark:text-white ${data.status === "done" ? "bg-emerald-400/10" : "hover:bg-studogrey/30"}  rounded-xl`}
      >
        <div
          className={
            "h-full flex items-center justify-center active:cursor-grabbing"
          }
        >
          <RxDragHandleDots2 />
        </div>
        <div
          className={
            "px-2 h-full overflow-visible w-full truncate flex items-center"
          }
        >
          <StatusSelector
            status={data.status}
            setStatus={(s) => onChange({ status: s })}
          />
        </div>
        <div
          className={
            "px-2 h-full w-full truncate overflow-hidden flex items-center"
          }
        >
          <input
            type="text"
            placeholder={"add a task..."}
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className={"outline-none border-none w-full h-full"}
          />
        </div>
        {containsRes && (
          <div className="px-2 flex gap-2 w-full flex items-center overflow-x-auto scroll-hidden">
            {data.resources.map((link, key) => (
              <ResourceIcon input={link} key={key} />
            ))}
          </div>
        )}
        <div
          className={
            "px-2 h-full overflow-visible w-full truncate flex items-center"
          }
        >
          <RowSelector
            label="type"
            icon={<TbCircle className={"text-blue-500"} />}
            options={[
              {
                icon: <IoMdBook className={"text-blue-500"} />,
                value: "course",
                label: "Lesson",
              },
              {
                icon: <IoDocumentTextOutline className={"text-blue-500"} />,
                value: "notes",
                label: "Notes",
              },
              {
                icon: <CiTextAlignLeft className={"text-blue-500"} />,
                value: "summary",
                label: "Summary",
              },
              {
                icon: <TbWriting className={"text-blue-500"} />,
                value: "abstract",
                label: "Exercise",
              },
              {
                icon: <RiPencilFill className={"text-blue-500"} />,
                value: "sample_exam",
                label: "Sample Exam",
              },
              {
                icon: <FaRegCircleCheck className={"text-blue-500"} />,
                value: "task",
                label: "Task",
              },
            ]}
            value={data.description}
            onChange={(d) => onChange({ description: d })}
          />
        </div>
        <div
          onClick={toggleOpen}
          className={"h-full flex items-center justify-center"}
        >
          {isOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
        </div>
      </div>
      {isOpen && (
        <div
          style={{ gridTemplateColumns: "3% 97%" }}
          className={"w-full h-fit grid"}
        >
          <div
            onClick={toggleOpen}
            className={
              "h-full flex items-center justify-center group py-2 pb-4"
            }
          >
            <div
              className={
                "h-full w-0.5 border group-hover:border-white border-studoborder/30 rounded-full"
              }
            />
          </div>

          <div
            className={
              "flex flex-row items-center justify-between gap-3 px-2 py-3 border-t border-studoborder/30 w-full"
            }
          >
            <div className={"w-1/3 flex items-center justify-baseline"}>
              <TagSelector
                label={t("due_date")}
                icon={<HiCalendarDays size={14} />}
                datePicker
                subtle
                value={data.dueDate ?? ""}
                onChange={(d) => onChange({ due_date: d })}
              />
            </div>
            <div className={"w-1/3 flex items-center justify-baseline"}>
              <RowSelector
                label={t("priority")}
                options={[
                  {
                    value: "no_priority",
                    label: "No priority",
                    dot: "bg-studogrey/50",
                  },
                  { value: "low", label: "Low", dot: "bg-blue-400" },
                  { value: "medium", label: "Medium", dot: "bg-amber-400" },
                  { value: "high", label: "High", dot: "bg-rose-500" },
                ]}
                value={data.priority}
                onChange={(d) => onChange({ priority: d })}
              />
            </div>
            <div className={"w-1/3 flex items-center justify-baseline"}>
              <TagSelector
                label="Link"
                icon={<LuLink size={14} />}
                value={""}
                freeInput
                onChange={(d) =>
                  onChange({
                    resources: [
                      ...data.resources,
                      {
                        title: "",
                        id: "",
                        link: d,
                        link_type: "",
                        resource_type: "notes",
                      },
                    ],
                  })
                }
                placeholder="Typ je school..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface StatusIconProps {
  status: string;
  setStatus: (status: string) => void;
}

function StatusSelector({ status, setStatus }: StatusIconProps) {
  const t = useTranslations("flow.course.row");
  const options = [
    {
      icon: <TbCircle className={"text-rose-500"} />,
      value: "not_started",
      label: t("not_started"),
    },
    {
      icon: <RiProgress4Line className={"text-amber-400"} />,
      value: "doing",
      label: t("doing"),
    },
    {
      icon: <RiProgress8Line className={"text-emerald-500"} />,
      value: "done",
      label: t("done"),
    },
  ];

  const index = options.findIndex((option) => option.value === status);
  const current = options[index] ?? options[0];

  const toggleChange = () => {
    const next = (index + 1) % options.length;
    setStatus(options[next].value);
  };

  return (
    <div
      onClick={toggleChange}
      className={
        "w-full cursor-pointer select-none flex items-center justify-baseline gap-2"
      }
    >
      {current.icon}
      {current.label}
    </div>
  );
}

CourseRow.displayName = "CourseRow";
export default CourseRow;
