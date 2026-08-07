"use client";
import { useState } from "react";
import FlowHeading from "@/components/ui/app/private/course/flow/FlowHeading";
import FlowTable from "@/components/ui/app/private/course/flow/table/FlowTable";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";
import { useParams } from "next/navigation";
import { useCourse } from "@/hooks/app/courses/useCourse";

export default function CourseFlowPage() {
  //effectieve data
  const { id } = useParams<{ id: string }>();

  const course = useCourse(id)?.data;
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  useCourseNav([
    {
      title: "home",
      href: `/home`,
      isLast: false,
      translate: true,
    },
    {
      title: course?.title ?? "",
      href: `/course/${id}/overview`,
      isLast: false,
      translate: false,
    },
    {
      title: "flow",
      href: `/course/${id}/flow`,
      isLast: true,
      translate: true,
    },
  ]);
  return (
    <div
      data-flow-boundary
      className="relative flex scroll-hidden min-h-0 flex-1 w-full flex-col gap-5 items-center overflow-y-auto overflow-x-clip p-5"
    >
      <div
        className={"overflow-x-hidden w-full h-full flex-col flex items-center"}
      >
        <div className="flex h-fit w-200 max-w-full flex-col gap-5 pb-20">
          <FlowHeading
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
          <FlowTable />
        </div>
      </div>
    </div>
  );
}
