"use client"
import {useTranslations} from "next-intl";
import Link from "next/link";
import {usePathname} from "next/navigation";
import TriggerClassroom from "@/components/app/classrooms/create_classroom";
import {useCallback, useState} from "react";

const header = [
    {url: "/your-files/sets", label: "sets"},
    {url: "/your-files/courses", label: "courses"},
    {url: "/your-files/folders", label: "folders"}
]

export default function ClassroomHeader() {
    const t = useTranslations("classrooms")
    const pathname = usePathname();
    const isActive = (link: string) => {
        const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|de)/, '');
        return pathWithoutLocale === link || pathWithoutLocale.startsWith(link + '/');
    };
    const [classroomIsOpen, setClassroomIsOpen] = useState(false);
    const toggleClassroom = () => {
        setClassroomIsOpen(!classroomIsOpen)
    };

    return (
        <div className={"w-full h-20 flex flex-col justify-between items-center max-h-100"}>
            <div className={"w-full h-fit flex items-center justify-between"}>
                <span className={"w-full font-bold dark:text-white text-3xl"}>{t("title")}</span>
                <TriggerClassroom
                    ClassroomIsOpen={classroomIsOpen}
                    setClassroomIsOpen={setClassroomIsOpen}
                    toggleClassroom={toggleClassroom}
                />
            </div>

                <div className={"w-full z-10 bottom-0 h-0.5 bg-studogrey"}/>
        </div>)
}