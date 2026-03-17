import {LastStudied} from "@/types/types";
import Link from "next/link";
import {Progress} from "@/components/marketing/progress/progress";
import {useLocale, useTranslations} from "next-intl";

interface GridItemProps {
    items: LastStudied[];
}

export default function GridItems({items}: GridItemProps) {
    const t = useTranslations("y_f.your_sets");
    const locale = useLocale();

    return (<div className={`flex-1 overflow-y-scroll scroll-hidden h-full mb-10 z-10 grid grid-cols-4 gap-5 pb-15`}>
        {items.map((item, index) => (<GridItem set={item} key={index} index={index} t={t} locale={locale} />))}
    </div>)
}


interface SetItemProps {
    set: LastStudied;
    index: number;
    t: ReturnType<typeof useTranslations>;
    locale: string;
}

const COLORS = [
    "from-amber-500/5 to-amber-400/5",
    "from-purple-500/5 to-purple-400/5",
    "from-blue-500/5 to-blue-400/5",
    "from-emerald-500/5 to-emerald-400/5"
] as const;

function GridItem({ set, index, t, locale }: SetItemProps) {
    const date = new Date(set.last_studied).toLocaleDateString(locale);
    const iconSrc = set.type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg";
    const colorClass = COLORS[index % COLORS.length];



        return (
            <Link
                href={`/set/${set.set_id}`}
                className={` h-50 flex-col flex gap-3 shadow-2xl items-center w-full rounded-2xl dark:bg-studogrey/10 bg-white/50 border dark:border-studogrey/20 border-gray-200 hover:border-studogrey/40 transition-all duration-300 overflow-hidden`}
            >
                <div className={`h-0.5 w-full mb-3`} />

                <div className={`flex flex-row gap-3 items-center w-full px-7`}>
                    <img src={iconSrc} className="invert opacity-50 brightness-0 w-5 flex-shrink-0" alt="" />
                    <span className="dark:text-white text-studodarkblue font-bold text-base overflow-hidden truncate">
            {set.title}
        </span>
                </div>

                <div className={`w-full px-7 flex flex-col sm:flex-row items-center gap-2`}>
                    <Progress length={set.length} progress={set.progress} />
                    <span className={`flex text-white/30 text-sm`}>
            {set.progress}% {t("studied")}
        </span>
                </div>

                <div className={` w-full px-7 sm:w-auto"} flex flex-row justify-between sm:gap-6`}>
                    <span className={`text-white/30 text-sm`}>{date}</span>
                    <span className={"text-white/30 text-sm"}>
            {set.length} {set.type === "studyset" ? t("cards") : t("pins")}
        </span>
                </div>
            </Link>);


};