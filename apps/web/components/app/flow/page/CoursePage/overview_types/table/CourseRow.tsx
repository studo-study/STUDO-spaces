"use client"
import {FlowRowResponse} from "@studo/types";
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
import TagSelector from "@/components/design_system/tag/TagSelector";
import {LuLink} from "react-icons/lu";
import LinkTag from "@/components/design_system/tag/LinkTag";
import ResourceIcon from "@/components/app/flow/page/CoursePage/overview_types/table/ResourceIcon";
import {HiCalendarDays} from "react-icons/hi2";

interface CourseRowProps {
    data: FlowRowResponse;
    containsRes: boolean;
    onChange: (updates: FlowRowResponse) => void;
}

const CourseRow = (props: CourseRowProps) => {
    const {data, containsRes, onChange} = props;
    const t = useTranslations("flow.course.row")

    //state
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleOpen = () => setIsOpen(prev => !prev);
    const handleDeleteResource = (link: string) => {
        onChange({...data, resources: data.resources.filter(resource => resource.link !== link)});
    }

    return (<div className={`flex flex-col border-b border-studoborder/30 cursor-pointer`}>
            <div style={{gridTemplateColumns: containsRes ? "3% 12% 49% 20% 12% 4%" : "3% 12% 69% 12% 4%"}}
                 className={`grid items-center h-10  text-studodarkblue  text-sm overflow-visible dark:text-white ${data.status === "done" ? "bg-emerald-400/10" : "hover:bg-studogrey/30"}  rounded-xl`}>
                <div className={"h-full flex items-center justify-center active:cursor-grabbing"}><RxDragHandleDots2/>
                </div>
                <div className={"px-2 h-full overflow-visible w-full truncate flex items-center"}>
                    <StatusSelector
                        status={data.status}
                        setStatus={(s) => onChange({ ...data, status: s })}
                    />
                </div>
                <div className={"px-2 h-full w-full truncate overflow-hidden flex items-center"}>
                    <input type="text" placeholder={"add a task..."}
                           value={data.title}
                           onChange={(e) => onChange({...data, title: e.target.value})}
                           className={"outline-none border-none w-full h-full"}/>
                </div>
                {containsRes && (
                    <div className="px-2 flex gap-2 w-full flex items-center overflow-x-auto scroll-hidden">
                        {data.resources.map((link, key) => (
                            <ResourceIcon input={link} key={key} />
                        ))}
                    </div>
                )}
                <div className={"px-2 h-full overflow-visible w-full truncate flex items-center"}>
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
                        value={data.description}
                        onChange={(d) => onChange({ ...data, description: d })}
                    />
                </div>
                <div onClick={toggleOpen} className={"h-full flex items-center justify-center"}>{isOpen ? <IoChevronUpOutline/> :
                    <IoChevronDownOutline/>}</div>
            </div>
            {isOpen && <div style={{gridTemplateColumns: "3% 97%"}}
                            className={"w-full h-50 grid"}>
                <div onClick={toggleOpen} className={"h-full flex items-center justify-center group py-2 pb-5"}>
                    <div
                        className={"h-full w-0.5 border group-hover:border-white border-studoborder/30 rounded-full"}/>
                </div>
                <div className={" flex flex-col pt-2"}>
                    <div className={"w-full h-3/5"}>
                        <span className={"font-bold text-studodarkblue text-sm dark:text-white"}>{t("add_details")}:</span>
                        <div className={"w-full flex flex-row gap-2"}>
                            <TagSelector
                                label={t("due_date")}
                                icon={<HiCalendarDays size={14}/>}
                                datePicker
                                subtle
                                value={data.priority}
                                onChange={(d) => onChange({ ...data, due_date: d })}
                            />

                        </div>
                    </div>
                    <div className={"w-full flex flex-col gap-2 h-2/5"}>
                        <span className={"font-bold text-studodarkblue text-sm dark:text-white"}>{t("add_resources")}:</span>
                        <div className={"min-w-full w-full flex flex-row gap-2 text-studodarkblue dark:text-white"}>
                            <LinkTag
                                label="Link"
                                icon={<LuLink size={14}/>}
                                value={""}
                                onChange={(d) => onChange({ ...data, resources: [...data.resources, {title: "", id: "", link: d, link_type:"", resource_type: "notes" }]} )}
                                placeholder="Typ je school..."
                            />
                            {data.resources.map((link, key) => (
                                <ResourceIcon input={link} key={key} deleteable onDelete={(link) => handleDeleteResource(link)}/>
                            ))}
                            {}
                        </div>
                    </div>
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
    const options: StatusIcon[] = [
        {icon: <TbCircle className={"text-rose-500"}/>, value: "to_do", label: "to do"},
        {icon: <RiProgress4Line className={"text-amber-400"}/>, value: "in_progress", label: "in progress"},
        {icon: <RiProgress8Line className={"text-emerald-500"}/>, value: "done", label: "done"},
    ]

    const index = options.findIndex(option => option.value === status);
    const current = options[index] ?? options[0];

    const toggleChange = () => {
        const next = (index + 1) % options.length;
        setStatus(options[next].value);
    }

    return <div onClick={toggleChange}
        className={"w-full cursor-pointer select-none flex items-center justify-baseline gap-2"}>
        {current.icon}
        {current.label}
    </div>
}


CourseRow.displayName = "CourseRow"
export default CourseRow