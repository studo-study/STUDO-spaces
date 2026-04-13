"use client"
import {FlowBoardResponse} from "@studo/types";
import CreateFlowCourseButton from "@/components/app/flow/page/overview/CreateFlowCourseButton";
import FlowCourseItem from "@/components/app/flow/page/overview/FlowCourseItem";

interface FlowTableProps {
    data?: FlowBoardResponse;
}

const FlowTable = (props: FlowTableProps) => {
    const {data} = props;
    console.log(data)
    return (<div className={"grid grid-cols-4 gap-5"}>
        {data.map(flow => <FlowCourseItem data={flow} />)}
        <CreateFlowCourseButton/>
    </div>);
}

FlowTable.displayName = "FlowTable";
export default FlowTable;