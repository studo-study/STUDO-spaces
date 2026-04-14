"use client"
import {FlowCourseResponse} from "@studo/types";
import CoursePageHeader from "@/components/app/flow/page/CoursePage/CoursePageHeader";
import CourseTable from "@/components/app/flow/page/CoursePage/CourseTable";
import {useState} from "react";

type viewModes = ["table", "kanban", "kalendar"];

interface StateProviderProps {
    data: FlowCourseResponse;
}

export default function StateProvider(props: StateProviderProps) {
    const {data} = props;
    const [viewMode, setViewMode] = useState<string>("table")
    return (<div className={"pt-12 px-2 flex flex-col gap-2"}>
        <CoursePageHeader data={data}/>

        <CourseTable data={data}/>
    </div>)
}