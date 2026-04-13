"use client"
import FlowRowSelectorItem from "@/components/app/flow/page/layout/FlowRowSelectorItem";
import {useTranslations} from "next-intl";
import TriggerFlowCourse from "@/components/app/flow/page/layout/TriggerFlowCourse";
import {useState} from "react";
import Link from "next/link";
import {usePathname} from "@/i18n/routing";

interface FlowRowSelectorProps {
    id: string;
}
const FlowRowSelector = (props: FlowRowSelectorProps) => {
    const {id} = props;
    const pathName = usePathname()
    const isActive = pathName.endsWith("/overview")
    const t = useTranslations("flow")
    const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
    const togglePopup = () => {
        setPopUpOpen(prev => !prev);
    }
    return <div className={"absolute bottom-20 gap-1 w-full h-10 flex flex-row items-center overflow-hidden rounded-full border border-studoborder/30 bg-studogrey/30 "}>
        <div className={"w-fit h-full"}>
            <Link href={"/flow/" + id + "/overview"} className={`w-fit min-h-full h-full flex dark:text-white text-studodarkblue items-center hover:bg-studogrey/30 border-r border-r-studoborder/30 transition-all duration-300 px-3 ${isActive && "font-bold bg-studogrey/30"}`}>
               <span>{t("overview")}</span>
            </Link>
        </div>
        <div>
            <FlowRowSelectorItem
            id={id}
            page={"test"}
            label={"test"}
            />
        </div>
       <TriggerFlowCourse
           togglePopUp={togglePopup}

       />
    </div>
}

FlowRowSelector.displayName = 'FlowRowSelector';
export default FlowRowSelector;