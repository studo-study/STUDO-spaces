import {FlowCourseResponse} from "@studo/types";
import {Link} from "@/i18n/routing";
import {getFlowIcon} from "@/components/design_system/icons/iconRegistry";
import {Linkparser} from "@/components/app/flow/page/CoursePage/linkparser";
import Chip from "@/components/design_system/chip/Chip";
import {HiCalendarDays} from "react-icons/hi2";
import BaseTooltip from "@/components/design_system/tooltip/BaseToolTip";
import {useTranslations} from "next-intl";
import {BsExclamationTriangle} from "react-icons/bs";
import {CgDanger} from "react-icons/cg";
import {IoWarningOutline} from "react-icons/io5";

interface CoursePageHeaderProps {
    data: FlowCourseResponse;
}

const CoursePageHeader = (props: CoursePageHeaderProps) => {
    const {data} = props;
    const t = useTranslations("flow.course")
    const {Icon, color} = getFlowIcon(data.icon);
    const {name, icon} = Linkparser(data.resource)
    const date = new Date(data.exam_date);
    return (<div className={"w-full h-fit flex flex-col gap-3"}>
        <div className={"flex flex-row justify-between"}>
            <div className={"w-full flex flex-row items-center gap-2"}>
                <Link href={"/flow/" + data.board_id + "/overview"} className={`bg-${color}-400/20 text-${color}-500 min-w-8 min-h-8 w-8 h-8 rounded-xl flex items-center justify-center`}>
                    <Icon size={15}/>
                </Link>
                <span className={"font-bold dark:text-white text-studodarkblue text-xl"}>{data.title}</span>
            </div>
            <div>

            </div>
        </div>
        <div className={"w-full flex flex-row items-center gap-2"}>

            {data.exam_date && ExamDateParser(date.toLocaleDateString(), t)}
            {data.exam_date && ExamStatus({
                examDate: date.toLocaleDateString(),
                totalItems: data.total_length,
                doneItems: data.total_done,
                t
            })}

            {data.resource && <BaseTooltip
                content={t("link")}
                position={"bottom"}
            >
                <Chip
                    label={name}
                    iconLeft={icon}
                />
            </BaseTooltip>}

        </div>
    </div>)
}

function ExamDateParser(examDate: string, t: any) {

    return (<BaseTooltip content={t("exam_date")} position={"bottom"}>
        <Chip
            label={examDate}
            iconLeft={<HiCalendarDays/>}
        />
    </BaseTooltip>)

}

function ExamStatus({examDate, totalItems, doneItems, t}: {
    examDate: string | null;
    totalItems: number;
    doneItems: number;
    t: any
}) {
    if (!examDate) return null;

    const now = new Date();
    const exam = new Date(examDate);
    const diffDays = (exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    // examen is voorbij
    if (diffDays < 0) return null;

    // behind status check
    if (totalItems > 0) {
        const remainingItems = totalItems - doneItems;
        const itemsPerDay = diffDays > 0 ? remainingItems / diffDays : Infinity;

        if (itemsPerDay > 5) {
            return (
                <Chip label={t("behind")} iconLeft={<BsExclamationTriangle size={10}/>} bgColor={"bg-rose-500"}/>
            );
        }
        if (itemsPerDay > 3) {
            return (
                <Chip label={t("slightly_behind")} iconLeft={<CgDanger size={10}/>} bgColor={"bg-orange-500"}/>
            );
        }
    }

    // exam countdown
    let bgColor = "";
    let message = "";

    if (diffDays <= 1) {
        bgColor = "bg-rose-600";
        message = "Exam tomorrow";
    } else if (diffDays <= 2) {
        bgColor = "bg-rose-500";
        message = "Exam in 2 days";
    } else if (diffDays <= 3) {
        bgColor = "bg-rose-400 text-studodarkblue";
        message = "Exam in 3 days";
    } else if (diffDays <= 7) {
        bgColor = "bg-orange-400 text-studodarkblue";
        message = `Exam in ${Math.ceil(diffDays)} days`;
    } else if (diffDays <= 14) {
        bgColor = "bg-yellow-400 text-studodarkblue";
        message = "Exam in 2 weeks";
    } else {
        return null;
    }

    return (
        <BaseTooltip content={t("exam_status")} position={"bottom"}>
            <Chip label={message} iconLeft={<IoWarningOutline size={12}/>} bgColor={bgColor}/>
        </BaseTooltip>
    );
}

CoursePageHeader.displayName = "CoursePageHeader"
export default CoursePageHeader;

