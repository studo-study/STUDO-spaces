"use client"
import {FlowCourseResponse, FullFlowCourseResponse} from "@studo/types";
import CoursePageHeader from "@/components/app/flow/page/CoursePage/CoursePageHeader";
import CourseTable from "@/components/app/flow/page/CoursePage/overview_types/table/CourseTable";
import {useState} from "react";
import CourseKanban from "@/components/app/flow/page/CoursePage/overview_types/kanban/CourseKanban";

interface StateProviderProps {
    data: FullFlowCourseResponse;
}

export default function StateProvider(props: StateProviderProps) {
    const {data} = props;
    const [view, setView] = useState<"table" | "kanban" | "calendar">("table")

    return (<div className={"pt-12 px-2 flex flex-col gap-2"}>
        <CoursePageHeader data={data} view={view} setView={setView}/>
        {view === "table" && (<CourseTable data={data}/>)}
        {view === "kanban" && (<CourseKanban data={data}/>)}
    </div>)
}