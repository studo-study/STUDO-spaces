import Link from "next/link";
import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";
import {StudySetItem} from "@/components/app/your-files/sets/grid";

interface GridItemProps {
    items: StudySetItem[];
}

export default function GridItems({items}: GridItemProps) {
    const t = useTranslations("y_f.your_sets");
    const locale = useLocale();

    return (
        <div className="flex-1 overflow-y-scroll scroll-hidden h-full mb-10 z-10 grid grid-cols-4 gap-5 pb-15">
            {items.map((item, index) => (
                <GridItem set={item} key={item.id} index={index} t={t} locale={locale} />
            ))}
        </div>
    );
}

const COLORS = [
    "from-amber-500/5 to-amber-400/5",
    "from-purple-500/5 to-purple-400/5",
    "from-blue-500/5 to-blue-400/5",
    "from-emerald-500/5 to-emerald-400/5"
] as const;

interface SetItemProps {
    set: StudySetItem;
    index: number;
    t: ReturnType<typeof useTranslations>;
    locale: string;
}

function GridItem({set, index, t, locale}: SetItemProps) {
    const date = new Date(set.last_updated).toLocaleDateString(locale);
    const iconSrc = set.type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg";
    const link = set.type === "studyset" ? `/studoset/${set.id}` : `/visualset/${set.id}`;

    return (
        <Link
            href={link}
            className="h-50 flex-col flex gap-3 shadow-2xl items-center w-full rounded-2xl dark:bg-studogrey/10 bg-white/50 border dark:border-studogrey/20 border-gray-200 hover:border-studogrey/40 transition-all duration-300 overflow-hidden"
        >
            <div className="h-0.5 w-full mb-3" />

            <div className="flex flex-row gap-3 items-center w-full px-7">
                <img src={iconSrc} className="invert opacity-50 brightness-0 w-5 flex-shrink-0" alt="" />
                <span className="dark:text-white text-studodarkblue font-bold text-base overflow-hidden truncate">
                    {set.title}
                </span>
            </div>

            <div className="w-full px-7 flex flex-col gap-1">
                <span className="text-white/30 text-sm">{set.course}</span>
            </div>

            <div className="w-full px-7 flex flex-row justify-between sm:gap-6">
                <span className="text-white/30 text-sm">{date}</span>
                <div className="flex flex-row items-center gap-2">
                    <Image src={set.img_url} width={16} height={16} className="w-4 h-4 rounded-full" alt={set.displayName} />
                    <span className="text-white/30 text-sm">{set.displayName}</span>
                </div>
            </div>
        </Link>
    );
}