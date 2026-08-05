"use client";
import { usePathname } from "@/i18n/routing";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";
import React, { ReactNode, useState } from "react";
import ButtonRow from "@/components/ui/design_system/button/ButtonRow";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
export default function CourseDetailPage({
  children,
}: {
  children: ReactNode;
}) {
  const path = usePathname().split("/");
  const courseId = path[2];
  const docId = path[4];
  const [title, setTitle] = useState("");
  useCourseNav([
    { title: "Course", href: `/course/${courseId}/course`, isLast: false },
    {
      title: "Document title",
      href: `/course/${courseId}/course/${docId}`,
      isLast: true,
    },
  ]);

  return (
    <div className={"min-w-0 min-h-0 flex-1 flex flex-col"}>
      <div
        className={
          "w-full flex flex-row items-center justify-between gap-3 p-5 border-b border-studoborder/30"
        }
      >
        <input
          className={"font-bold text-lg outline-none truncate"}
          type={"text"}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <ButtonRow
          buttons={[
            { icon: <ChevronDown size={15} /> },
            {
              icon: <ChevronUp size={15} />,
            },
            {
              icon: <Plus size={15} />,
            },
          ]}
        />
      </div>
      <div className={"min-w-0 min-h-0 flex-1 flex flex-row"}>
        {children}
        <div className={"w-20 border-l border-studoborder/30"}></div>
      </div>
    </div>
  );
}
