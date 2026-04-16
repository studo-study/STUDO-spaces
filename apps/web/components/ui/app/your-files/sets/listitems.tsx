import {useLocale, useTranslations} from "next-intl";
import Link from "next/link";
import Image from "next/image";
import CourseIcons from "@/data";
import {StudySetItem} from "@/components/ui/app/your-files/sets/grid";

interface ListItemProps {
    items: StudySetItem[];
}

export default function ListItems({items}: ListItemProps) {
    const t = useTranslations("y_f.your_sets");
    const locale = useLocale();
    return (
        <div className="flex-1 overflow-y-scroll scroll-hidden h-full mb-10 z-10 flex flex-col gap-5 pb-15">
            {items.map((item, index) => (
                <ListItem set={item} key={item.id} index={index} t={t} locale={locale} />
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
    t: ReturnType<typeof useTranslations>;
    locale: string;
    index: number;
}

function ListItem({set, index, t, locale}: SetItemProps) {
    const date = new Date(set.last_updated).toLocaleDateString(locale);
    const iconSrc = set.type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg";
    const link = set.type === "studyset" ? `/studoset/${set.id}` : `/visualset/${set.id}`;

    return (
        <Link
            href={link}
            className="max-h-22 h-22 flex-col sm:flex-row px-10 pl-4 py-4 sm:py-0 max-w-full min-w-full cursor-pointer
                flex gap-3 shadow-2xl items-center w-full rounded-full bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 overflow-hidden"
        >
            <div className="flex flex-row gap-3 items-center w-full sm:w-1/2 sm:flex-1">
                <div className="w-15 h-15 rounded-full bg-studogrey/30 flex items-center justify-center">
                    <Image width={32} height={32} className="w-8" src={getCoverImage(set.course)} alt={set.course} />
                </div>
                <Image src={iconSrc} width={20} height={20} className="invert opacity-50 brightness-0 w-5 flex-shrink-0" alt="" />
                <span className="dark:text-white text-studodarkblue font-bold text-base overflow-hidden truncate">
                    {set.title}
                </span>
            </div>

            <div className="min-w-60 w-full sm:w-auto flex flex-row items-center justify-between sm:gap-6">
                <span className="text-white/30 text-sm">{set.course}</span>
                <span className="text-white/30 text-sm">{date}</span>
                <div className="flex flex-row items-center gap-2">
                    <Image src={set.img_url} width={20} height={20} className="w-5 h-5 rounded-full" alt={set.displayName} />
                    <span className="text-white/30 text-sm">{set.displayName}</span>
                </div>
            </div>
        </Link>
    );
}

function getCoverImage(course: string): string {
    const key = Object.keys(CourseIcons).find((k) =>
        course.toLowerCase().includes(k)
    ) as keyof typeof CourseIcons | undefined;
    return key ? `/icons/courses/${CourseIcons[key]}` : "/icons/courses/default.svg";
}