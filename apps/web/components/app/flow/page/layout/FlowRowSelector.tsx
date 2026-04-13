"use client"
import FlowRowSelectorItem from "@/components/app/flow/page/layout/FlowRowSelectorItem";
import {useTranslations} from "next-intl";
import TriggerFlowCourse from "@/components/app/flow/page/layout/TriggerFlowCourse";
import {useState} from "react";
import Link from "next/link";
import {usePathname} from "@/i18n/routing";
import {useAppLayout} from "@/components/context/AppLayoutContext";
import {useFlowBoard} from "@/components/context/FlowBoardContext";
import {FlowBoardResponse} from "@studo/types";

interface FlowRowSelectorProps {
    id: string;
    data: FlowBoardResponse;
}
const FlowRowSelector = (props: FlowRowSelectorProps) => {
    const {id, data} = props;
    const { toggleFlowBoard } = useFlowBoard();
    const pathName = usePathname()
    const isActive = pathName.endsWith("/overview")
    const t = useTranslations("flow")


    return <div className={"absolute bottom-20 gap-1 w-full h-10 flex flex-row items-center overflow-hidden rounded-full border border-studoborder/30 bg-studogrey/30 "}>
        <div className={"w-fit h-full"}>
            <Link href={"/flow/" + id + "/overview"} className={`w-fit min-h-full h-full flex dark:text-white text-studodarkblue items-center hover:bg-studogrey/30 border-r border-r-studoborder/30 transition-all duration-300 px-3 ${isActive && "font-bold bg-studogrey/30"}`}>
               <span>{t("overview")}</span>
            </Link>
        </div>
        <div className={"w-fit h-full flex flex-row gap-2 py-1"}>
            {data.courses.map((course, i) => (
                <FlowRowSelectorItem
                    key={i}
                    id={course.id}
                    page={course.title}
                    label={course.title}
                />
            ))}
        </div>
       <TriggerFlowCourse
           togglePopUp={toggleFlowBoard}

       />
    </div>
}

FlowRowSelector.displayName = 'FlowRowSelector';
export default FlowRowSelector;