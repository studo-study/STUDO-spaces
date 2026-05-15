"use client"
import {useFlowStore} from "@/store/slices/flow/flowStore";

const CourseKanban = () => {
    const data = useFlowStore((s) => s.activeCourse);

    if (!data) return null;

    return (<div className={"w-full min-h-full  h-165 flex flex-col gap-5"}>
        <div className={"w-full min-h-full h-full grid grid-cols-3 gap-5"}>
            <div className={"border rounded-3xl h-full w-full p-3 pt-15"}>
                <div className={"h-full border rounded-2xl"}></div>
            </div>
            <div className={"border rounded-3xl h-full w-full p-3 pt-15"}>
                <div className={"h-full border rounded-2xl"}></div>
            </div>
        </div>
    </div>)
}

CourseKanban.displayName = "CourseKanban"
export default CourseKanban
