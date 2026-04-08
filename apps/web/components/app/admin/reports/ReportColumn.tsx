import GridHeader from "@/components/app/admin/reports/GridHeader";
import {FaPlus} from "react-icons/fa";

interface ReportColumnProps {
    title: string,
    icon: React.ReactNode,
    count: number,
    description: string,

}

export default function ReportColumn({title, icon, count, description}: ReportColumnProps) {
    return (<div
            className={"w-full h-full flex flex-col gap-5 border border-studoborder/30 bg-studogrey/10 rounded-3xl p-5"}>
            <GridHeader
                title={title}
                icon={icon}
                count={count}
                description={description}/>
            <div className={"w-full h-full group flex flex-col gap-3"}>
                <AddIssue/>
            </div>
        </div>

    )
}

function AddIssue() {
    return (<div className={"w-full rounded-2xl border border-studoborder/30 h-fit py-2 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300"}>
        <FaPlus />
    </div>)
}