"use client"
import {FlowBoardResponse, FlowCourseResponse, FullFlowCourseResponse} from "@studo/types";
import {Link} from "@/i18n/routing";
import {getFlowIcon} from "@/components/design_system/icons/iconRegistry";
import {Linkparser} from "@/components/app/flow/page/CoursePage/linkparser";
import Chip from "@/components/design_system/chip/Chip";
import {HiCalendarDays, HiChevronUpDown} from "react-icons/hi2";
import BaseTooltip from "@/components/design_system/tooltip/BaseToolTip";
import {useTranslations} from "next-intl";
import {BsExclamationTriangle} from "react-icons/bs";
import {CgDanger} from "react-icons/cg";
import {IoWarningOutline} from "react-icons/io5";
import ToggleGroupBase from "@/components/design_system/togglegroup/ToggleGroup";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useFlowBoard} from "@/components/context/FlowBoardContext";

interface CoursePageHeaderProps {
    data: FullFlowCourseResponse;
    view: "table" | "kanban" | "calendar";
    setView: (view: "table" | "kanban" | "calendar") => void;
}

const CoursePageHeader = (props: CoursePageHeaderProps) => {
    const {data, view, setView} = props;
    const t = useTranslations("flow.course")
    const {Icon, color} = getFlowIcon(data.icon);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const {name, icon} = Linkparser(data.resource)
    const date = new Date(data.exam_date);
    const boardData = useFlowBoard().boardData;

    const openDropDown = () => {
        setIsOpen(prev => !prev);
    }

    const navigateToLink = (board_id: string) => {
        router.push(`/flow/${board_id}`);
    }
    return (<div className={"w-full h-25 flex flex-col gap-3"}>
        <div className={"flex flex-row justify-between"}>
            <div className={"relative"}>
                <div onClick={openDropDown}
                    className={"w-fit flex flex-row items-center dark:text-white text-studodarkblue gap-2 transition-all duration-300  cursor-pointer hover:bg-studogrey/30 py-1 px-1 rounded-2xl"}>
                    <Link href={"/flow/" + data.board_id + "/overview"} className={`bg-${color}-400/20 text-${color}-500 min-w-8 min-h-8 w-8 h-8 rounded-xl flex items-center justify-center`}>
                        <Icon size={15}/>
                    </Link>
                    <span className={"font-bold  text-xl"}>{data.title}</span>
                    <HiChevronUpDown />
                </div>
                {isOpen && (
                    <div className="absolute top-full left-0 mt-2 z-[9999] min-w-[220px] rounded-xl
        bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        py-1.5"
                    >
                        {boardData?.courses.map((course) => {
                            const {Icon, color} = getFlowIcon(course.icon);
                            const isActive = course.id === data.id;
                            return (
                                <button
                                    key={course.id}
                                    onClick={() => {
                                        router.push(`/flow/${data.board_id}/${course.id}`);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer
                        ${isActive
                                        ? "bg-white/20 dark:bg-white/10 text-neutral-900 dark:text-white"
                                        : "text-neutral-600 dark:text-neutral-300 hover:bg-white/10 dark:hover:bg-white/5"
                                    }`}
                                >
                    <span className={`bg-${color}-400/20 text-${color}-500 w-6 h-6 rounded-lg flex items-center justify-center shrink-0`}>
                        <Icon size={12}/>
                    </span>
                                    <span className="truncate">{course.title}</span>
                                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"/>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
            <div>
                <ToggleGroupBase view={view} setView={setView} options={["table","kanban","calendar"]} />
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

