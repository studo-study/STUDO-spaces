"use client"
import {FlowCourseResponse} from "@studo/types";
import CreateFlowCourseButton from "@/components/ui/app/flow/page/overview/CreateFlowCourseButton";
import FlowCourseItem from "@/components/ui/app/flow/page/overview/FlowCourseItem";

interface FlowTableProps {
    data: FlowCourseResponse[];
}

const FlowTable = (props: FlowTableProps) => {
    const {data} = props;
    const sortedData = data.sort((a, b) => {
        const aFirst = a.lesson_days ? Number(a.lesson_days.split("-").sort()[0]) : Infinity;
        const bFirst = b.lesson_days ? Number(b.lesson_days.split("-").sort()[0]) : Infinity;
        return aFirst - bFirst;
    });
    console.log(data)
    return (<div className={"grid grid-cols-4 gap-5"}>
        {sortedData.map((flow, i) => <FlowCourseItem key={i} data={flow} />)}
        <CreateFlowCourseButton/>
    </div>);
}

FlowTable.displayName = "FlowTable";
export default FlowTable;