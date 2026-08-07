"use client";
import { useState } from "react";
import FlowHeading from "@/components/ui/app/private/course/flow/FlowHeading";
import FlowTable from "@/components/ui/app/private/course/flow/table/FlowTable";

export default function CourseFlowPage() {
  //effectieve data
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  return (
    <div className="relative flex scroll-hidden min-h-0 flex-1 w-full flex-col gap-5 items-center overflow-y-auto overflow-x-clip p-5">
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
  );
}
