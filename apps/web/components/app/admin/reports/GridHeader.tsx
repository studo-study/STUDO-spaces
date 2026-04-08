import {BsThreeDots} from "react-icons/bs";
import {LuCirclePlus} from "react-icons/lu";

interface GridHeaderProps {
    title: string,
    icon: React.ReactNode,
    count: number,
    description: string,

}

export default function GridHeader({title, icon, count, description}: GridHeaderProps) {
    return (<div className={"w-full h-fit flex flex-col gap-2 dark:text-white text-studodarkblue"}>
        <div className={"w-full h-fit flex flex-row gap-3 justify-between "}>
            <div className={"w-fit h-fit flex flex-row items-center gap-2 "}>
                {icon}
                <div className={"font-bold text-lg flex flex-row items-center gap-1"}>
                    <span>{title}</span>
                    <span className={"bg-studogrey/30 text-sm rounded-3xl px-2 py-0.5"}>{count}</span>
                </div>
            </div>
            <div className={"w-fit flex flex-row gap-3 justify-center items-center"}>
                <BsThreeDots size={20} className={"cursor-pointer"}/>
                <LuCirclePlus size={20} className={"cursor-pointer"}/>
            </div>
        </div>
        <span className={"text-sm opacity-50"}>{description}</span>
    </div>)
}