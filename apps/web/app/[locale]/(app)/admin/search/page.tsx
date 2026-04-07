import {Metadata} from "next";
import {useTranslations} from "next-intl";
import QuickStats from "@/components/pages/dashboard/stats/quick_stats/quickstats";
import {SlGraph} from "react-icons/sl";
import {VscGraphLine} from "react-icons/vsc";

export const metadata:Metadata = {
    title:"Admin Dashboard | Studo"
}

export default function SearchPage() {
    const t = useTranslations("admin")
    return(<div className={"w-full h-full flex flex-col gap-5"}>

    </div>);
}