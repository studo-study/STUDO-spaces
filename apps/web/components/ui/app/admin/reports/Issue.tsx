"use client"
import {Issue} from "@/types/types";
import {LuCircleUserRound} from "react-icons/lu";
import {PiCellSignalHighFill, PiCellSignalLowFill, PiCellSignalMediumFill, PiDotsThree} from "react-icons/pi";
import {CgDanger} from "react-icons/cg";
import {MdOutlineBrightness1} from "react-icons/md";
import {RiProgress4Line, RiProgress8Line} from "react-icons/ri";
import {useState} from "react";
import PopupBackdrop from "@/components/ui/design_system/popup/PopupBackdrop";
import IssueDetails from "@/components/ui/app/admin/reports/IssueDetails";
interface IssueProps {
    item: Issue
    status: string



export default function IssueItem({item, status}: IssueProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    }
    return(<div onClick={toggleOpen}
        className={"relative w-full handle min-h-fit flex cursor-pointer active:cursor-grabbing flex-col gap-2 border border-studoborder/30 bg-studogrey/30 rounded-2xl p-3"}>
        <div className={"w-full min-h-fit flex text-white flex-row gap-3 justify-between "}>
            <span className={"w-fit h-fit text-sm text-zinc-400"}>#{item?.number}</span>
            <div>
                {item.assignee_id ? (<div className={"min-w-5 text-xs p-0.5 min-h-5 w-5 h-5 cursor-pointer max-w-5 max-h-5 rounded-full bg-emerald-800 uppercase flex items-center justify-center text-center border border-studoborder"}>
                    {item.assignee_displayName?.split(" ").map(item => item.split("")[0]).join("")}
                </div>)
                :
                <div className={"min-w-5 min-h-5 w-5 h-5 cursor-pointer max-w-5 max-h-5 rounded-full bg-zinc-800/30 flex items-center justify-center opacity-50"}>
                    <LuCircleUserRound />
                </div>}
            </div>
        </div>
        <div className={"w-full flex flex-row gap-2 items-center"}>
            {getProgress(status)}
            <span className={"truncate text-sm"}>{item.title}</span>
        </div>
        <div className={"w-full flex flex-row gap-2 items-center"}>
            <div className={"max-w-6 max-h-6 h-6 w-6 rounded-xl bg-studogrey flex items-center justify-center opacity-50"}>
                {item.priority ? getPriority(item.priority) : <PiDotsThree />}
            </div>
            <div className={"max-w-fit max-h-6 text-xs  px-3 h-6 first-letter:uppercase w-fit rounded-xl bg-studogrey flex items-center justify-center opacity-50"}>
                {item.report_type.split("_").join(" ")}
            </div>
        </div>
        <PopupBackdrop
        isOpen={isOpen}
        setIsOpen={toggleOpen}>
           <IssueDetails/>
        </PopupBackdrop>
    </div>)
}

function getPriority(priority: string){
    switch(priority){
        case "low": return <PiCellSignalLowFill size={12}/>;
        case "medium": return <PiCellSignalMediumFill size={12}/>;
        case "high": return <PiCellSignalHighFill size={12}/>;
        case "urgent": return <CgDanger size={12}/>;
    }

    return ""
}

function getProgress(progress: string) {
    switch(progress){
        case "to_do": return <MdOutlineBrightness1 size={14} className={"text-rose-500"}/>;
        case "in_progress": return <RiProgress4Line className={"text-amber-400"}/>;
        case "done": return <RiProgress8Line className={"text-emerald-400"}/>;
    }

}