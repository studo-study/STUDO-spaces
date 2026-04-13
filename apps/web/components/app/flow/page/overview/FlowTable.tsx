"use client"
import {FlowBoardResponse} from "@studo/types";
import CreateFlowCourseButton from "@/components/app/flow/page/overview/CreateFlowCourseButton";

interface FlowTableProps {
    data?: FlowBoardResponse;
}

const FlowTable = (props: FlowTableProps) => {
    return (<div className={"grid grid-cols-4 gap-5"}>
        {}
        <CreateFlowCourseButton/>
    </div>);
}

FlowTable.displayName = "FlowTable";
export default FlowTable;