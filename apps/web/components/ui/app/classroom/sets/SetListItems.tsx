import {FullStudyset} from "@/types/types";
import {useLocale, useTranslations} from "next-intl";
import Link from "next/link";
import Image from "next/image";
import CourseIcons from "@/data";
import {HiLightningBolt} from "react-icons/hi";

interface ListItemProps {
    items: FullStudyset[];
}
export default function SetListItems({items}:ListItemProps) {
    const t = useTranslations("classroom.sets");
    const locale = useLocale();
    return (<div className={`flex-1 overflow-y-scroll scroll-hidden h-full mb-10 z-10 flex flex-col gap-5 pb-15`}>
        {items.map((item, index) => (<ListItem set={item} key={index} index={index} t={t} locale={locale} />))}
    </div>)
}
interface SetItemProps {
    set: FullStudyset;
    t: ReturnType<typeof useTranslations>;
    locale: string;
    index: number;
}


function ListItem({ set, t, locale }: SetItemProps) {
    const date = new Date(set.created_at).toLocaleDateString(locale);
    const iconSrc = set.cards ? "/icons/studyset.svg" : "/icons/visualset.svg";
    const challenged = true;

    const link = set.cards ? "/studoset/" + set.id : "/visualset/" + set.id;
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
                    <div>
                        <div className={"w-fit flex items-center gap-3"}>
                            <Image src={iconSrc} width={0} height={0} className="invert opacity-50 brightness-0 w-5 flex-shrink-0" alt="" />
                              <span className="dark:text-white text-studodarkblue font-bold text-base overflow-hidden truncate">
                                {set.title}
                            </span>
                        </div>
                        <div className={"w-full dark:text-white/50 text-studodarkblue/50 text-sm flex items-center gap-1"}>
                            <span>
                            {t("added by")}
                        </span>
                            <Link href={"/profile/" + set.user_id} className={"hover:underline"}>{set.displayName}</Link>
                        </div>

                    </div>

                </div>


                <div className={`min-w-40 w-full sm:w-auto flex flex-row justify-between sm:gap-3 items-center`}>
                    <div className={`w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2 mr-2`}>
                        {challenged && inChallenge(t)}
                    </div>
                    <span className={`text-white/30 text-sm min-w-20 max-w-20 text-center`}>{date}</span>
                    <span className={"text-white/30 text-sm min-w-20 max-w-20 text-end"}>
                     {set.cards.length} {set.cards ? set.cards.length === 1 ? t("card") : t("cards") : t("pins")}
                    </span>
                </div>
            </Link>);
};

function getCoverImage(course: string): string {
    const key = Object.keys(CourseIcons).find((k) =>
        course.toLowerCase().includes(k)
    ) as keyof typeof CourseIcons | undefined;

    return key ? `/icons/courses/${CourseIcons[key]}` : "/icons/courses/default.svg";
}

function inChallenge(t: ReturnType<typeof useTranslations>) {
    return (<div className={"w-fit px-5 pr-7 py-2 rounded-full bg-studoblue/30 hover:bg-studoblue/40 transition-all duration-300" +
        " text-blue-200 flex items-center gap-2 font-bold border-2 border-studoblue"}>
        <HiLightningBolt />{t("challenge")}</div>)
}
