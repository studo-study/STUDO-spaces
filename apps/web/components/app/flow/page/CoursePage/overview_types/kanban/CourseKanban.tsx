"use client"
import {FlowCourseResponse, FullFlowCourseResponse} from "@studo/types";
import {useTranslations} from "next-intl";
import CourseItemProgress from "@/components/app/flow/page/overview/CourseItemProgress";
import {useState} from "react";

interface CourseKanbanProps {
    data: FullFlowCourseResponse;
}

const CourseKanban = (props: CourseKanbanProps) => {
    const {data} = props;
    const [totalLength, setTotalLength] = useState(10);
    const [done, setDone] = useState(3);
    const [progress, setProgress] = useState(3);

    const t = useTranslations("flow.course.row")
    return (<div className={"w-full flex flex-col gap-5"}>
        <div>

        </div>
    </div>)
}

CourseKanban.displayName = "CourseKanban"
export default CourseKanban