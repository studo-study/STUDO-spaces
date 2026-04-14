"use client"
import FlowBoardOverviewHeader from "@/components/app/flow/page/layout/FlowBoardOverviewHeader";
import BreadCrumbs from "@/components/app/flow/page/layout/BreadCrumbs";
import {usePathname} from "@/i18n/routing";
import {FlowBoardResponse} from "@studo/types";
import {useFlowBoard} from "@/components/context/FlowBoardContext";
import CreateFlowCourse from "@/components/app/flow/page/layout/CreateFlowCourse";

interface BoardHeaderProps {
    data: FlowBoardResponse;
}

const BoardHeader = (props: BoardHeaderProps) => {
    const {data} = props;
    const pathName = usePathname()
    const isActive = pathName.endsWith("/overview")
    const {open, toggleFlowBoard} = useFlowBoard();

    if (isActive) {
        return <div>
            <FlowBoardOverviewHeader data={data}/>
            <CreateFlowCourse createOpen={open} setCreateOpen={toggleFlowBoard} board_title={data.title} board_id={data.id}/>
        </div>;
    }

    return <div>
        <BreadCrumbs
            board_id={data.id}
            board_title={data.title}
            course_id={pathName.split("/")[pathName.split("/").length - 1]}
            course_title={data.courses.find(i => i.id === pathName.split("/")[pathName.split("/").length - 1]).title}

        />
        <CreateFlowCourse createOpen={open} setCreateOpen={toggleFlowBoard} board_title={data.title} board_id={data.id}/>
    </div>
}

BoardHeader.displayName = "BoardHeader";
export default BoardHeader;