import {useLocale, useTranslations} from "next-intl";
import Link from "next/link";
import Image from "next/image";
import CourseIcons from "@/data";
import {StudySetItem} from "@/components/ui/app/your-files/sets/grid";
import Avatar from "@/components/ui/design_system/avatar/Avatar";
import {FiTrash2} from "react-icons/fi";
import ItemOptions from "@/components/ui/design_system/item_options/ItemOptions";
import {useCallback} from "react";
import {FaExternalLinkAlt} from "react-icons/fa";
import {MdEditNote} from "react-icons/md";

interface ListItemProps {
    items: StudySetItem[];
}

export default function ListItems({items}: ListItemProps) {
    const t = useTranslations("y_f.your_sets");
    const locale = useLocale();
    return (
        <div className="flex-1 scroll-hidden h-full mb-10 z-10 flex flex-col gap-5 pb-15">
            {items.map((item, index) => (
                <ListItem set={item} key={item.id} index={index} t={t} locale={locale}/>
            ))}
        </div>
    );
}


interface SetItemProps {
    set: StudySetItem;
    t: ReturnType<typeof useTranslations>;
    locale: string;
    index: number;
}

function ListItem({set, t, locale}: SetItemProps) {
    const date = new Date(set.last_updated).toLocaleDateString(locale).split("-").join("/")
    const iconSrc = set.type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg";
    const link = set.type === "studyset" ? `/studoset/${set.id}` : `/visualset/${set.id}`;

    const handleDelete = useCallback(() => {
        // TODO
    }, []);
    return (
        <Link
            href={link}
            className="max-h-22 h-22 flex-col sm:flex-row px-10 pl-2.5 py-3 sm:py-0 max-w-full min-w-full cursor-pointer
                flex gap-3 items-center w-full rounded-3xl bg-studogrey/30 border border-studoborder/30 hover:border-studoborder transition-all duration-300"
        >
            <div className="flex flex-row gap-3 items-center w-full sm:w-1/2 sm:flex-1">
                <div className="w-17 h-17 rounded-2xl dark:bg-studogrey/30 bg-white flex items-center justify-center">
                    <Image width={32} height={32} className="w-8" src={getCoverImage(set.course)} alt={set.course}/>
                </div>

                <div className={"w-fit flex flex-col gap-1"}>
                    <div className={"w-fit flex flex-row gap-2 items-center"}>
                        <Image src={iconSrc} width={20} height={20}
                               className="dark:invert dark:opacity-50 dark:brightness-0 w-5 flex-shrink-0" alt=""/>
                        <span
                            className="dark:text-white text-studodarkblue font-bold text-base overflow-hidden truncate">
                            {set.title}
                        </span>
                    </div>
                    <div className={"w-full flex flex-row gap-2 items-center opacity-50 dark:text-white text-xs"}>
                        <span>{set.course}</span>
                        <span>•</span>
                        <span>{date}</span>
                    </div>
                </div>
            </div>

            <div className="min-w-60 w-full sm:w-auto flex flex-row items-center justify-end sm:gap-6">
                <Avatar id={set.user_id} displayName={set.displayName} img_url={set.img_url}/>
                <div>
                    <ItemOptions options={[
                        {label: t("edit_set"), icon: <MdEditNote />, onClick: () => {}},
                        {label: t("external_window"), icon:<FaExternalLinkAlt size={10}/> , onClick: () => console.log("test")},
                        {label: t("delete"), icon: <FiTrash2 size={14}/>, onClick: () => handleDelete(), danger: true},
                    ]}/>
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