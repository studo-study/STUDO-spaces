"use client"
import FlowRowSelectorItem from "@/components/app/flow/page/FlowRowSelectorItem";
import {useTranslations} from "next-intl";
import TriggerFlowCourse from "@/components/app/flow/page/TriggerFlowCourse";
import {useState} from "react";

interface FlowRowSelectorProps {
    id: string;
}
const FlowRowSelector = (props: FlowRowSelectorProps) => {
    const {id} = props;
    const t = useTranslations("flow")
    const [popUpOpen, setPopUpOpen] = useState<boolean>(false);
    const togglePopup = () => {
        setPopUpOpen(prev => !prev);
    }
    return <div className={"absolute bottom-20 gap-2 w-full h-10 flex flex-row items-centrer rounded-full border border-studoborder/30 bg-studogrey/30 px-2 py-2 "}>
        <div className={"w-fit"}>
            <FlowRowSelectorItem
            id={id}
            label={t("overview")}
            page={"overview"}/>
        </div>
        <div></div>
       <TriggerFlowCourse
           togglePopUp={togglePopup}

       />
    </div>
}

FlowRowSelector.displayName = 'FlowRowSelector';
export default FlowRowSelector;