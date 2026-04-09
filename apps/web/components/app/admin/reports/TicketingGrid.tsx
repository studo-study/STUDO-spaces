"use client"
import {FaPlus} from "react-icons/fa";
import {useState} from "react";
import {RiProgress4Line, RiProgress8Line} from "react-icons/ri";
import {MdOutlineBrightness1} from "react-icons/md";
import TicketSearch from "@/components/app/admin/reports/TicketSearch";
import {IoFilter} from "react-icons/io5";
import ReportColumn from "@/components/app/admin/reports/ReportColumn";
import mockReports from "@/data/mocks/reportMock";
import {Issue} from "@/types/types";

const data: Issue[] = mockReports

export default function TicketingGrid() {
    const [toDo, setToDo] = useState<Array<Issue>>(data.filter(item => item.status === "to_do"))
    const [inProgress, setInProgress] = useState<Array<Issue>>(data.filter(item => item.status === "in_progress"))
    const [done, setDone] = useState<Array<Issue>>(data.filter(item => item.status === "done"))

    const columns = [
        {
            title: "To Do",
            icon: <MdOutlineBrightness1 size={14} className={"text-rose-500"}/>,
            count: 0,
            description: "This task hasn't been started.",
            items: toDo
        },
        {
            title: "In Progress",
            icon: <RiProgress4Line className={"text-amber-400"}/>,
            count: 0,
            description: "This task actively being worked on.",
            items: inProgress
        },
        {
            title: "Done",
            icon: <RiProgress8Line className={"text-emerald-400"}/>,
            count: 0,
            description: "This task has been completed.",
            items: done
        }
    ]

    return (<div className={"w-full h-full flex flex-col gap-5 dark:text-white text-studodarkblue"}>
        <div className={"w-full h-fit flex flex-row items-center justify-between"}>
            <TicketSearch/>
            <div className={"w-fit h-fit  flex flex-row items-center justify-between gap-3 text-sm font-bold"}>
                <span className={"w-fit px-3 py-1 cursor-pointer rounded-full border border-studoborder/30 bg-studogrey/30"}>My Issues</span>
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
                        description={column.description}
                        items={column.items}

                    />)
            })}
        </div>
    </div>)
}
