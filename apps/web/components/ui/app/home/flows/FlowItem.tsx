import {Boards} from "@studo/types";
import {Link} from "@/i18n/routing";
import {getFlowIcon} from "@/components/ui/design_system/icons/iconRegistry";
import SmallProgress from "@/components/ui/design_system/progress/SmallProgress";
import SmallBoardProgress from "@/components/ui/app/home/flows/SmallBoardProgress";
import {useTranslations} from "next-intl";

interface FlowItemProps {
    board: Boards;
}
const FlowItem = (props: FlowItemProps) => {
    const { board } = props;
    const {Icon, color} = getFlowIcon(board.icon);
    const t = useTranslations("home.flow")
    return (<Link href={"/flow/" + board.id + "/overview"} className={"w-50 h-30 p-3 rounded-2xl flex flex-col gap-2 border border-studoborder/30 bg-studogrey/30 hover:border-studoborder transition-all duration-300"}>
            <div className={"flex flex-row gap-3"}>
                <div className={`bg-${color}-400/20 text-${color}-500 min-w-8 min-h-8 w-8 h-8 rounded-lg flex items-center justify-center`}>
                    <Icon size={20}/>
                </div>
                <span className={"font-bold text-lg dark:text-white text-studodarkblue"}>{board.title}</span>
            </div>
            <div></div>
            <div className={"flex flex-row gap-2 w-full"}>
                <SmallBoardProgress total_in_progress={board.total_in_progress} total_length={board.total_length} total_done={board.total_done} />
            </div>
            <span className={"text-xs dark:text-white text-studodarkblue opacity-50"}>{board.courses} {board.courses === 1 ? t("course") : t("courses")}</span>
    </Link>)
}


FlowItem.displayName = "FlowItem";
export default FlowItem;