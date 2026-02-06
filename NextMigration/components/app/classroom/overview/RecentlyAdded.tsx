"use client"
import {useLocale, useTranslations} from "next-intl";
import Link from "next/link";
import {type FullClassroom, type FullClassroomSet, LastStudied} from "@/types/types";
import Image from "next/image";
import {Progress} from "@/components/marketing/progress/progress";
import CourseIcons from "@/data";

interface ListItemProps {
    items: FullClassroom;
}

export default function RecentlyAdded({items}: ListItemProps) {
    const t = useTranslations("classroom")
    const locale = useLocale();
    const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
    const thisWeek = items.sets.filter(item => new Date(item.created_at).getDate() >= ONE_WEEK_IN_MS);
    const lastWeek = items.sets.filter(item => new Date(item.created_at).getDate() << ONE_WEEK_IN_MS);
    const pinned = []
    return(
        <div className={"w-2/3 min-h-full h-full flex flex-col p-7 rounded-4xl gap-3"}>
            <span className={"font-bold text-studodarkblue dark:text-white"}>{t("pinned_sets")}:</span>
            <div className={"w-full h-1/3 flex flex-col gap-5"}>
                {pinned.length === 0 && <span className={"w-full h-full text-studodarkblue dark:text-white flex items-center justify-center"}>{t("no_pinned")}</span>}
            </div>
            <span className={"font-bold text-studodarkblue dark:text-white"}>{t("recent_sets")}:</span>
            <div className={"w-full h-2/3 flex flex-col gap-5"}>
                {/*sorry voor de spaghetti*/}
                {thisWeek.length ?
                    (<div className={"w-full flex flex-col gap-10"}>
                        <div className={"w-full h-fit flex flex-col gap-5"}>
                            <span className={"dark:text-white text-sm text-studodarkblue"}>{t("this_week")}</span>
                            {thisWeek.map((item, index) => (<ListItem set={item} key={index} index={index} t={t} locale={locale} />))}
                        </div>
                        {lastWeek.length != 0 ? ( <div className={"w-full h-fit flex flex-col gap-5"}>
                            <span className={"dark:text-white text-sm text-studodarkblue"}>{t("last_week")}</span>
                            {lastWeek.map((item, index) => (<ListItem set={item} key={index} index={index} t={t} locale={locale} />))}
                        </div>): null}
                    </div>)
                    : (
                        items.sets.map((item, index) => (
                            <ListItem
                                set={item}
                                key={index}
                                index={index}
                                t={t}
                                locale={locale}
                            />
                        ))
                    )
                }

                {items.sets.length != 0 &&
                    <Link href={"/classroom/" + items.id + "/sets"}
                          className={"w-full h-10 text-sm hover:underline " +
                              "transition-all duration-300 text-studodarkblue flex " +
                              "dark:text-white items-center justify-center"}>
                        {t("more")}
                    </Link>
                }
                {items.sets.length == 0 && <span className={"w-full h-full text-studodarkblue dark:text-white flex items-center justify-center"}>{t("no_sets")}</span>}
            </div>

        </div>
        )
}



const COLORS = [
    "from-amber-500/5 to-amber-400/5",
    "from-purple-500/5 to-purple-400/5",
    "from-blue-500/5 to-blue-400/5",
    "from-emerald-500/5 to-emerald-400/5"
] as const;

interface SetItemProps {
    set: FullClassroomSet;
    t: ReturnType<typeof useTranslations>;
    locale: string;
    index: number;
}


function ListItem({ set, index, t, locale }: SetItemProps) {
    const date = new Date(set.added_by).toLocaleDateString(locale);
    const iconSrc = set.set_type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg";
    const colorClass = COLORS[index % COLORS.length];

    const link = set.set_type === "studyset" ? "/studoset/" + set.set_id : "/visualset/" + set.set_id;
    return (
        <Link
            href={link}
            className={`
                     max-h-22 h-22 flex-col sm:flex-row px-10 pl-4 py-4 sm:py-0 max-w-full min-w-full cursor-pointer
                 flex gap-3 shadow-2xl items-center w-full rounded-full bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 overflow-hidden`}
        >

            <div className={`flex flex-row gap-3 items-center "w-full sm:w-1/2 sm:flex-1`}>
                <div className={"w-15 h-15 rounded-full bg-studogrey/30 flex items-center justify-center"}>
                    <Image width={0} height={0} className={"w-8"} src={getCoverImage(set.course)} alt={set.course} />
                </div>
                <div className={"w-fit flex flex-col pt-1"}>
                    <div className={"w-fit flex flex-row gap-3"}>
                        <Image src={iconSrc} width={0} height={0} className="invert opacity-50 brightness-0 w-5 flex-shrink-0" alt="" />
                        <span className="dark:text-white text-studodarkblue font-bold text-base overflow-hidden truncate">
                        {set.title}
                    </span>
                    </div>
                    <span className={"w-fit text-studodarkblue/30 dark:text-white/30 text-sm"}>{t("added_by")} {set.added_by}</span>
                </div>


            </div>


        </Link>);
};

function getCoverImage(course: string): string {
    const key = Object.keys(CourseIcons).find((k) =>
        course.toLowerCase().includes(k)
    ) as keyof typeof CourseIcons | undefined;

    return key ? `/icons/courses/${CourseIcons[key]}` : "/icons/courses/default.svg";
}