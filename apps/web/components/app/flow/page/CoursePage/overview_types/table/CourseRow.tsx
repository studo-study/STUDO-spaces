"use client"
import {FullFlowCourseResponse} from "@studo/types";
import {useTranslations} from "next-intl";
import {RxDragHandleDots2} from "react-icons/rx";
import {ReactNode, useState} from "react";
import {IoChevronDownOutline, IoChevronUpOutline, IoDocumentTextOutline} from "react-icons/io5";
import RowSelector from "@/components/app/flow/page/CoursePage/overview_types/table/RowSelector";
import {RiPencilFill, RiProgress4Line, RiProgress8Line} from "react-icons/ri";
import {TbCircle, TbWriting} from "react-icons/tb";
import {FaRegCircleCheck} from "react-icons/fa6";
import {CiTextAlignLeft} from "react-icons/ci";
import {IoMdBook} from "react-icons/io";

interface CourseRowProps {
    data: FullFlowCourseResponse;
    containsRes: boolean;
}

const CourseRow = (props: CourseRowProps) => {
    const {data, containsRes} = props;
    const t = useTranslations("flow.course.row")

    //state
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [type, setType] = useState<string>("");
    const toggleOpen = () => setIsOpen(prev => !prev);


    return (<div className={`flex flex-col border-b border-studoborder/30 cursor-pointer`}>
            <div style={{gridTemplateColumns: containsRes ? "3% 12% 49% 20% 12% 4%" : "3% 12% 69% 12% 4%"}}
                 className={`grid items-center h-10  text-studodarkblue overflow-visible dark:text-white ${status === "done" ? "bg-emerald-400/10" : "hover:bg-studogrey/30"}  rounded-xl`}>
                <div className={"h-full flex items-center justify-center active:cursor-grabbing"}><RxDragHandleDots2/>
                </div>
                <div className={"px-2 h-full overflow-visible w-full truncate text-base flex items-center"}>
                    <StatusSelector
                        status={status}
                        setStatus={setStatus}
                    />
                </div>
                <div className={"px-2 h-full w-full truncate overflow-hidden text-base flex items-center"}>
                    <input type="text" placeholder={"typ a description..."}
                           className={"outline-none border-none w-full h-full"}/>
                </div>
                {containsRes && <div className={"px-2 h-full w-full truncate overflow-hidden text-base flex items-center"}></div>}
                    <div className={"px-2 h-full overflow-visible w-full truncate text-base flex items-center"}>
                    <RowSelector
                        label="type"
                        icon={<TbCircle className={"text-blue-500"}/>}
                        options={[
                            {icon: <IoMdBook className={"text-blue-500"}/>, value: "course", label: "Lesson"},
                            {
                                icon: <IoDocumentTextOutline className={"text-blue-500"}/>,
                                value: "notes",
                                label: "Notes"
                            },
                            {icon: <CiTextAlignLeft className={"text-blue-500"}/>, value: "summary", label: "Summary"},
                            {icon: <TbWriting className={"text-blue-500"}/>, value: "abstract", label: "Exercise"},
                            {
                                icon: <RiPencilFill className={"text-blue-500"}/>,
                                value: "sample_exam",
                                label: "Sample Exam"
                            },
                            {icon: <FaRegCircleCheck className={"text-blue-500"}/>, value: "task", label: "Task"},
                        ]}
                        value={type}
                        onChange={setType}/>
                </div>
                <div onClick={toggleOpen}
                     className={"h-full flex items-center justify-center"}>{isOpen ? <IoChevronUpOutline/> :
                    <IoChevronDownOutline/>}</div>
            </div>
            {isOpen && <div style={{gridTemplateColumns: "3% 97%"}}
                            className={"w-full h-50 grid"}>
                <div onClick={toggleOpen} className={"h-full flex items-center justify-center group py-2 pb-5"}>
                    <div
                        className={"h-full w-0.5 border group-hover:border-white border-studoborder/30 rounded-full"}/>
                </div>
            </div>}
        </div>
    )
}

interface StatusIcon {
    icon: ReactNode;
    value: string;
    label: string;
}

interface StatusIconProps {
    status: string;
    setStatus: (status: string) => void;
}

function StatusSelector({status, setStatus}: StatusIconProps) {
    const [index, setIndex] = useState(0);
    const options: StatusIcon[] = [
        {icon: <TbCircle className={"text-blue-500"}/>, value: "no_status", label: "no status"},
        {icon: <TbCircle className={"text-rose-500"}/>, value: "to_do", label: "to do"},
        {icon: <RiProgress4Line className={"text-amber-400"}/>, value: "in_progress", label: "in progress"},
        {icon: <RiProgress8Line className={"text-emerald-500"}/>, value: "done", label: "done"},
    ]

    const toggleChange = () => {
        if (index + 1 >= options.length) {
            setIndex(0);
            setStatus(options[0].value)
        }
        else {
            setIndex(prev => prev + 1);
            setStatus(options[index + 1].value)
        }


    }
    return <div onClick={toggleChange}
        className={"w-full cursor-pointer select-none flex items-center justify-baseline gap-2"}>
        {options[index].icon}
        {options[index].label}
    </div>
}

CourseRow.displayName = "CourseRow"
export default CourseRow