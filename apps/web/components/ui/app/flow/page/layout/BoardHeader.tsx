"use client"
import FlowBoardOverviewHeader from "@/components/ui/app/flow/page/layout/FlowBoardOverviewHeader";
import BreadCrumbs from "@/components/ui/app/flow/page/layout/BreadCrumbs";
import {usePathname} from "@/i18n/routing";
import {useFlowStore} from "@/store/slices/flow/flowStore";
import CreateFlowCourse from "@/components/ui/app/flow/page/layout/CreateFlowCourse";

const BoardHeader = () => {
    const data = useFlowStore((s) => s.activeBoard);
    const createCourseOpen = useFlowStore((s) => s.createCourseOpen);
    const setCreateCourseOpen = useFlowStore((s) => s.setCreateCourseOpen);
    const pathName = usePathname();
    const isActive = pathName.endsWith("/overview");
    const courseId = pathName.split("/").at(-1);

    if (!data) return null;

    const course = data.courses.find(i => i.id === courseId);

    if (isActive) {
        return <div className={"w-full"}>
            <FlowBoardOverviewHeader />
            <CreateFlowCourse createOpen={createCourseOpen} setCreateOpen={setCreateCourseOpen} board_title={data.title} board_id={data.id}/>
        </div>;
    }

    return <div className={"relative w-full"}>
        <BreadCrumbs
            board_id={data.id}
            board_title={data.title}
            course_id={courseId}
            course_title={course?.title ?? ""}
        />
        <CreateFlowCourse createOpen={createCourseOpen} setCreateOpen={setCreateCourseOpen} board_title={data.title} board_id={data.id}/>
    </div>
}

BoardHeader.displayName = "BoardHeader";
export default BoardHeader;
