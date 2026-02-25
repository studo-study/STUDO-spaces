"use client"
import {useTranslations} from "next-intl";
import {Link, usePathname} from "@/i18n/routing";

const header = [
    {url: "/search-result", label: "all"},
    {url: "/search-result/sets", label: "sets"},
    {url: "/search-result/classrooms", label: "classrooms"},
    {url: "/search-result/users", label: "users"}
]

interface SearchHeaderProps {
    query: string
}
export default function SearchHeader({query}: SearchHeaderProps) {
    const t = useTranslations("landing.search_result")
    const pathname = usePathname();
    const isActive = (link: string) => {
        return pathname === link || pathname.startsWith(link + '/');
    };
    return (
        <div className={"w-full h-20 flex flex-col justify-between items-center "}>
            <span className={"w-full font-bold dark:text-white text-xl"}>{t("title")} {" "}<span className={"font-normal"}>{query}</span></span>
            <div className={"relative w-full max-h-10 flex flex-col"}>
                <div className={"absolute z-20 bottom-0 w-full flex items-center justify-baseline gap-10 h-fit"}>
                    {header.map((item, i) => (
                        <div  key={i} className={`dark:text-white cursor-pointer h font-bold py-2 transition-all duration-400 hover:border-blue-500/75 border-b-2 ${isActive(item.url) ? " border-blue-500" : "border-transparent"}`}>{t(item.label)}</div>
                    ))}

                </div>
                <div className={"absolute z-10 bottom-0 w-full h-0.5 bg-studogrey"}/>
            </div>
        </div>)
}
