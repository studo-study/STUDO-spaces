"use client";
import { CourseResponse } from "@studo/types";
import CreateFlowCourseButton from "@/components/ui/app/private/board/CreateFlowCourseButton";
import FlowCourseItem from "@/components/ui/app/private/board/FlowCourseItem";

interface FlowTableProps {
  data: CourseResponse[];
}

const FlowTable = (props: FlowTableProps) => {
  const { data } = props;
  const sortedData = data.sort((a, b) => {
    const aFirst = a.lessonDays
      ? Number(a.lessonDays.split("-").sort()[0])
      : Infinity;
    const bFirst = b.lessonDays
      ? Number(b.lessonDays.split("-").sort()[0])
      : Infinity;
    return aFirst - bFirst;
  });
  console.log(data);
  return (
    <div className={"grid grid-cols-4 gap-5"}>
      {sortedData.map((flow, i) => (
        <FlowCourseItem key={i} data={flow} />
      ))}
      <CreateFlowCourseButton />
    </div>
  );
};

FlowTable.displayName = "FlowTable";
export default FlowTable;
