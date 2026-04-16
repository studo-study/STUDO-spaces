"use client"
import CoursePageHeader from "@/components/ui/app/flow/page/CoursePage/CoursePageHeader";
import CourseTable from "@/components/ui/app/flow/page/CoursePage/overview_types/table/CourseTable";
import CourseKanban from "@/components/ui/app/flow/page/CoursePage/overview_types/kanban/CourseKanban";
import {useFlowStore} from "@/store/flowStore";

export default function CoursePageContent() {
    const activeCourse = useFlowStore((s) => s.activeCourse);
    const courseView = useFlowStore((s) => s.courseView);

    if (!activeCourse) return null;

    return (<div className={"pt-12 px-2 flex flex-col gap-2 h-full"}>
        <CoursePageHeader/>
        {courseView === "table" && <CourseTable/>}
        {courseView === "kanban" && <CourseKanban/>}
    </div>)
}
