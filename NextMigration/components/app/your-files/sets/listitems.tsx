import {LastStudied} from "@/types/types";
import {useLocale, useTranslations} from "next-intl";
import Link from "next/link";
import {Progress} from "@/components/marketing/progress/progress";

interface ListItemProps {
    items: LastStudied[];
}
export default function ListItems({items}:ListItemProps) {
    const t = useTranslations("y_f.your_sets");
    const locale = useLocale();
    return (<div className={`flex-1 overflow-y-scroll scroll-hidden h-full mb-10 -z-10 flex flex-col gap-5`}>
        {items.map((item, index) => (<ListItem set={item} key={index} index={index} t={t} locale={locale} />))}
    </div>)
}

const COLORS = [
    "from-amber-500/5 to-amber-400/5",
    "from-purple-500/5 to-purple-400/5",
    "from-blue-500/5 to-blue-400/5",
    "from-emerald-500/5 to-emerald-400/5"
] as const;

interface SetItemProps {
    set: LastStudied;
    t: ReturnType<typeof useTranslations>;
    locale: string;
    index: number;
}


function ListItem({ set, index, t, locale }: SetItemProps) {
    const date = new Date(set.last_studied).toLocaleDateString(locale);
    const iconSrc = set.type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg";
    const colorClass = COLORS[index % COLORS.length];


        return (
            <Link
                href={`/set/${set.set_id}`}
                className={`
                     max-h-22 h-22 flex-col sm:flex-row px-10 py-4 sm:py-0 max-w-full min-w-full
                 flex gap-3 shadow-2xl items-center w-full rounded-full bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 overflow-hidden`}
            >

                <div className={`flex flex-row gap-3 items-center "w-full sm:w-1/2 sm:flex-1`}>
                    <img src={iconSrc} className="invert opacity-50 brightness-0 w-5 flex-shrink-0" alt="" />
                    <span className="dark:text-white text-studodarkblue font-bold text-base overflow-hidden truncate">
            {set.title}
        </span>
                </div>

                <div className={`w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2`}>
                    <Progress length={set.length} progress={set.progress} />
                    <span className={`flex sm:hidden text-studogrey text-sm`}>
            {set.progress}% {t("studied")}
        </span>
                </div>

                <div className={`min-w-40 w-full sm:w-auto flex flex-row justify-between sm:gap-6`}>
                    <span className={`text-white/30 text-sm`}>{date}</span>
                    <span className={"text-white/30 text-sm"}>
            {set.length} {set.type === "studyset" ? t("cards") : t("pins")}
        </span>
                </div>
            </Link>);
};