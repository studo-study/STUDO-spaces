"use client"
import {FaPlus, FaRegCircle} from "react-icons/fa";
import {BsThreeDots} from "react-icons/bs";
import {LuCirclePlus} from "react-icons/lu";
import {useState} from "react";
import {RiProgress4Line, RiProgress8Line} from "react-icons/ri";
import {MdOutlineBrightness1} from "react-icons/md";
import TicketSearch from "@/components/app/admin/reports/TicketSearch";
import {IoFilter} from "react-icons/io5";
import GridHeader from "@/components/app/admin/reports/GridHeader";
import ReportColumn from "@/components/app/admin/reports/ReportColumn";

const columns = [
    {
        title: "To Do",
        icon: <MdOutlineBrightness1 size={14} className={"text-rose-500"}/>,
        count: 0,
        description: "This task hasn't been started.",
    },
    {
        title: "In Progress",
        icon: <RiProgress4Line className={"text-amber-400"}/>,
        count: 0,
        description: "This task actively being worked on.",
    },
    {
        title: "Done",
        icon: <RiProgress8Line className={"text-emerald-400"}/>,
        count: 0,
        description: "This task has been completed.",
    }
]
export default function TicketingGrid() {
    const [toDo, setToDo] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [done, setDone] = useState([]);
    return (<div className={"w-full h-full flex flex-col gap-5 dark:text-white text-studodarkblue"}>
        <div className={"w-full h-fit flex flex-row items-center justify-between"}>
            <TicketSearch/>
            <div className={"w-fit h-fit  flex flex-row items-center justify-between gap-3"}>
                <div className={"p-2 cursor-pointer rounded-full border border-studoborder/30 bg-studogrey/30"}>
                    <IoFilter size={12}/>
                </div>
                <div className={"p-2 cursor-pointer rounded-full border border-studoborder/30 bg-studogrey/30"}>
                    <FaPlus size={12}/>
                </div>
            </div>

        </div>
        <div className={"w-full h-full grid grid-cols-3 gap-7"}>

            {columns.map((column, i) => {
                return (
                    <ReportColumn
                        key={i}
                        title={column.title}
                        icon={column.icon}
                        count={column.count}
                        description={column.description}/>)
            })}
        </div>
    </div>)
}
