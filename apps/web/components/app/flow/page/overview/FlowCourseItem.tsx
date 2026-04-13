import {FlowCourseResponse} from "@studo/types";
import {Link} from "@/i18n/routing";
import {getFlowIcon} from "@/components/design_system/icons/iconRegistry";
import CourseItemProgress from "@/components/app/flow/page/overview/CourseItemProgress";

interface CourseItemProps {
    data: FlowCourseResponse;
}

const FlowCourseItem = (props: CourseItemProps) => {
    const {data} = props;
    const {Icon, color} = getFlowIcon(data.icon);

    return (<Link href={"/flow/" + data.board_id + "/" + data.id} className={"w-full h-full border p-5 flex flex-col gap-5 border-studoborder/30 rounded-3xl bg-studogrey/30 dark:text-white text-studodarkblue"}>
        <div className={'w-full h-fit flex flex-row gap-2'}>
            <div className={"w-full flex flex-row gap-2"}>
                <div className={`bg-${color}-400/20 text-${color}-500 min-w-12 min-h-12 rounded-xl flex items-center justify-center`}>
                    <Icon size={25}/>
                </div>
                <span className={"flex h-full items-center text-lg font-bold"}>{data.title}</span>
            </div>
            <div></div>
        </div>
        <CourseItemProgress total_in_progress={""} total_length={""} total_done={""}/>
    </Link>)
}

FlowCourseItem.displayName = "FlowCourseItem";
export default FlowCourseItem;