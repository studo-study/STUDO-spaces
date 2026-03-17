import {LastStudied} from "@/types/types";
import {useTranslations} from "next-intl";
import {memo} from "react";
import Link from "next/link";
import {Progress} from "@/components/marketing/progress/progress";

const COLORS = [
    "from-amber-500/5 to-amber-400/5",
    "from-purple-500/5 to-purple-400/5",
    "from-blue-500/5 to-blue-400/5",
    "from-emerald-500/5 to-emerald-400/5"
] as const;


interface SetItemProps {
    set: LastStudied;
    index: number;
    t: ReturnType<typeof useTranslations>;
    locale: string;
}
export default function SetItem({ set, index, t, locale }: SetItemProps) {
    const date = new Date(set.last_studied).toLocaleDateString(locale);
    const iconSrc = set.type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg";
    const colorClass = COLORS[index % COLORS.length];
    const perc = Math.min(100, Math.floor((set.progress / (set.length * 2)) * 100));
    return (
        <Link
            href={`/set/${set.set_id}`}
            className={`flex flex-col gap-3 shadow-2xl  justify-baseline items-baseline w-full h-50 rounded-2xl bg-white/50
            dark:bg-studogrey/10 border dark:border-studogrey/20 border-gray-200 hover:border-studogrey/40 transition-all duration-300 overflow-hidden`}
        >
            <div className={`h-0.5 w-full mb-3`} />
            <div className="w-full h-full px-7 flex flex-col gap-3">
                <div className="w-full flex flex-col justify-center gap-2">
                    <div className="w-full h-full flex items-center justify-center">
                        <Progress length={set.length} progress={set.progress} />
                    </div>
                    <div className="w-full flex justify-center flex-row gap-3">
                        <span className="w-fit dark:text-studogrey text-gray-400 text-sm">{perc}% {t("studied")}</span>
                    </div>
                </div>
                <div className="w-full flex flex-row gap-3 h-fit items-center">
                    <img src={iconSrc} className="invert opacity-50 brightness-0 w-5" alt="" />
                    <span className="w-full dark:text-white text-studodarkblue h-fit inline-block align-middle font-bold text-base overflow-hidden truncate">
                        {set.title}
                    </span>
                </div>
                <div className="w-full h-fit flex flex-row justify-between">
                    <span className="w-fit dark:text-studogrey text-gray-400 text-sm">{date}</span>
                    <span className="w-fit dark:text-studogrey text-gray-400 text-sm">
                        {set.length} {set.type === "studyset" ? t("cards") : t("pins")}
                    </span>
                </div>
            </div>
        </Link>
    );
}
