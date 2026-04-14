"use client"
import {FlowCourseResponse} from "@studo/types";
import {useTranslations} from "next-intl";
import CourseItemProgress from "@/components/app/flow/page/overview/CourseItemProgress";
import {useState} from "react";

interface CourseTableProps {
    data: FlowCourseResponse;
}

const CourseTable = (props: CourseTableProps) => {
    const {data} = props;
    const [totalLength, setTotalLength] = useState(10);
    const [done, setDone] = useState(3);
    const [progress, setProgress] = useState(3);

    const t = useTranslations("flow.course.row")
    return (<div className={"w-full flex flex-col gap-5"}>
        <div className={"flex flex-row gap-3 items-center"}>
            <CourseItemProgress
                total_length={totalLength}
                total_in_progress={progress}
                total_done={done}
            />
            <span className={"flex flex-row truncate text-sm min-w-fit gap-2 text-studodarkblue font-bold dark:text-white"}>
                {done + " / " + totalLength} {t("done")}
            </span>
        </div>
        <div>

        </div>
    </div>)
}

CourseTable.displayName = "CourseTable"
export default CourseTable