import {Metadata} from "next";
import {useTranslations} from "next-intl";
import QuickStats from "@/components/dashboard/stats/quick_stats/quickstats";
import {SlGraph} from "react-icons/sl";
import {VscGraphLine} from "react-icons/vsc";
import {MdOutlineQueryStats} from "react-icons/md";
import Overview from "@/components/dashboard/stats/overview/overview";

export const metadata:Metadata = {
    title:"Admin Dashboard | Studo"
}

export default function ModeratorPage() {
    const t = useTranslations("admin")
    return(<div className={"w-full h-full flex flex-col gap-12"}>
        <div className={"w-full h-45 flex flex-col items-center gap-5"}>
        <span className={"w-full h-fit font-bold text-xl dark:text-white text-studodarkblue flex gap-2 items-center"}><VscGraphLine />{t("subtitle_stats")}:</span>
            <QuickStats t={t}/>
        </div>
        <div className={"w-full h-full flex flex-col gap-5"}>
            <span className={"w-full h-fit font-bold text-xl dark:text-white text-studodarkblue flex gap-2 items-center"}><MdOutlineQueryStats />{t("subtitle_overview")}:</span>
            <Overview t={t}/>
        </div>
    </div>);
}