"use client"
import FlowTable from "@/components/ui/app/flow/page/overview/FlowTable";
import FlowProgress from "@/components/ui/app/flow/page/overview/FlowProgress";
import UrgentPoints from "@/components/ui/app/flow/page/overview/UrgentPoints";
import {useTranslations} from "next-intl";
import {useFlowStore} from "@/store/flowStore";

export default function Page() {
    const t = useTranslations("flow");
    const data = useFlowStore((s) => s.activeBoard);

    if (!data) return null;

    return (<div className={"w-full h-full pt-5 flex flex-col gap-2"}>
        <span className={"text-2x dark:text-white text-studodarkblue font-bold"}>{t("your_courses")}:</span>
        <div className={"flex flex-col gap-5"}>
            {data.total_length !== 0 && data.total_in_progress !== 0 &&
                <FlowProgress
                    total_done={data.total_done}
                    total_in_progress={data.total_in_progress}
                    total_length={data.total_length}
                />}
            <UrgentPoints/>
            <FlowTable data={data.courses}/>
        </div>
    </div>)
}
