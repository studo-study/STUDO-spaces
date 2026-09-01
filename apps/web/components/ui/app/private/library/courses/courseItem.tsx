"use client";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import ItemOptions from "@studo/ui/design_system/item_options/ItemOptions";
import { useTranslations } from "next-intl";
import type { CourseResponse } from "@studo/types";
import FlowIcon from "@/components/ui/app/private/course/layout/FlowIcon";

interface CourseCardProps {
  course: CourseResponse;
  options?: boolean;
}

export default function CourseItem({ course, options }: CourseCardProps) {
  const t = useTranslations("y_f.your_sets");
  return (
    <Link
      href={`/course/${course.id}`}
      className="relative min-w-35 max-w-35 group p-5 rounded-2xl bg-studogrey/30 border  border-neutral-200/30 hover:border-neutral-400 transition-all duration-300 text-center"
    >
      {options && (
        <div className={"absolute right-2 top-2"}>
          <ItemOptions
            options={[
              {
                label: t("external_window"),
                icon: <FaExternalLinkAlt size={10} />,
                onClick: () => console.log("test"),
              },
              {
                label: t("delete_course"),
                icon: <FiTrash2 size={14} />,
                onClick: () => {},
                danger: true,
              },
            ]}
          />
        </div>
      )}
      <div className="mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 w-fit">
        <FlowIcon
          icon={course.icon}
          size={22}
          className="w-12 h-12 rounded-xl"
        />
      </div>
      <h3 className="font-medium truncate dark:text-white text-studodarkblue mb-1">
        {course.title}
      </h3>
    </Link>
  );
}
