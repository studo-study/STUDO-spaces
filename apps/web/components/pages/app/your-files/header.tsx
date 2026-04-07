"use client"
import {useTranslations} from "next-intl";
import Link from "next/link";
import {usePathname} from "next/navigation";

const header = [
    {url: "/your-files/sets", label: "sets"},
    {url: "/your-files/courses", label: "courses"},
    {url: "/your-files/folders", label: "folders"}
]
export default function FileHeader() {
    const t = useTranslations("y_f")
    const pathname = usePathname();
    const isActive = (link: string) => {
        const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|de)/, '');
        return pathWithoutLocale === link || pathWithoutLocale.startsWith(link + '/');
    };
    return (
        <div className={"w-full h-30 flex flex-col justify-between items-center max-h-100"}>
            <span className={"w-full font-bold dark:text-white text-3xl"}>{t("title")}</span>
            <div className={"relative w-full max-h-10 flex flex-col"}>
                <div className={"absolute z-20 bottom-0 w-full flex items-center justify-baseline gap-10 h-fit"}>
                    {header.map((item, i) => (
                        <Link href={item.url}  key={i} className={`dark:text-white h font-bold py-2 transition-all duration-400 hover:border-blue-500/75 border-b-2 ${isActive(item.url) ? " border-blue-500" : "border-transparent"}`}>{t(item.label)}</Link>
                    ))}

                </div>
                <div className={"absolute z-10 bottom-0 w-full h-0.5 bg-gray-300 dark:bg-studogrey"}/>
            </div>
        </div>)
}