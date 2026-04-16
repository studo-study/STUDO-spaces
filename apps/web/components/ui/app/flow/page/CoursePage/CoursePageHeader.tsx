"use client"
import {Link} from "@/i18n/routing";
import {getFlowIcon} from "@/components/ui/design_system/icons/iconRegistry";
import {Linkparser} from "@/components/ui/app/flow/page/CoursePage/linkparser";
import Chip from "@/components/ui/design_system/chip/Chip";
import {HiCalendarDays, HiChevronUpDown} from "react-icons/hi2";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import {useTranslations} from "next-intl";
import {BsExclamationTriangle} from "react-icons/bs";
import {CgDanger} from "react-icons/cg";
import {IoWarningOutline} from "react-icons/io5";
import ToggleGroupBase from "@/components/ui/design_system/togglegroup/ToggleGroup";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useFlowStore} from "@/store/flowStore";

const CoursePageHeader = () => {
    const t = useTranslations("flow.course")
    const data = useFlowStore((s) => s.activeCourse);
    const boardData = useFlowStore((s) => s.activeBoard);
    const courseView = useFlowStore((s) => s.courseView);
    const setCourseView = useFlowStore((s) => s.setCourseView);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    if (!data) return null;

    const {Icon, color} = getFlowIcon(data.icon);
    const {name, icon} = Linkparser(data.resource)
    const date = new Date(data.exam_date);

    const openDropDown = () => {
        setIsOpen(prev => !prev);
    }

    return (<div className={"w-full h-25 flex flex-col gap-3"}>
        <div className={"flex flex-row justify-between"}>
            <div className={"relative"}>
                <div onClick={openDropDown}
                    className={"w-fit flex flex-row items-center dark:text-white text-studodarkblue gap-2 transition-all duration-300  cursor-pointer hover:bg-studogrey/30 py-1 px-1 rounded-2xl"}>
                    <Link href={"/flow/" + data.board_id + "/overview"} className={`bg-${color}-400/20 text-${color}-500 min-w-8 min-h-8 w-8 h-8 rounded-xl flex items-center justify-center`}>
                        <Icon size={15}/>
                    </Link>
                    <span className={"font-bold select-none text-xl"}>{data.title}</span>
                    <HiChevronUpDown />
                </div>
                {isOpen && (
                    <div className={`
                    absolute top-full left-0 mt-2 z-[9999] min-w-[180px] rounded-xl
                    bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
                    border border-white/50 dark:border-white/10
                    shadow-xl shadow-black/10 dark:shadow-black/30
                    transition-all duration-200 ease-out origin-top
                    ${isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }
                `} >
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
                <ToggleGroupBase view={courseView} setView={setCourseView} options={["table","kanban","calendar"]} />
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

    if (diffDays < 0) return null;

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
