"use client"
import {useTranslations} from "next-intl";
import Link from "next/link";
import {usePathname} from "next/navigation";
import TriggerClassroom from "@/components/app/classrooms/CreateClassroom";
import {useCallback, useRef, useState} from "react";
import CreateClassroom from "@/components/app/classrooms/CreateClassroomPopup";

const header = [
    {url: "/your-files/sets", label: "sets"},
    {url: "/your-files/courses", label: "courses"},
    {url: "/your-files/folders", label: "folders"}
]

export default function ClassroomsHeader() {
    const t = useTranslations("classrooms")
    const [classroomIsOpen, setClassroomIsOpen] = useState(false);
    const togglePopUp = () => {
        setClassroomIsOpen((prev) => !prev);
    };


    return (
        <div className={"w-full h-20 flex flex-col justify-between items-center max-h-100"}>
            <div className={"w-full h-fit flex items-center justify-between"}>
                <span className={"w-full font-bold dark:text-white text-3xl"}>{t("title")}</span>
                <TriggerClassroom
                    togglePopUp={togglePopUp}
                />

            </div>
                <div className={"w-full z-10 bottom-0 h-0.5 bg-studogrey"}/>
            <CreateClassroom
                createOpen={classroomIsOpen}
                setCreateOpen={setClassroomIsOpen}
            />
        </div>)
}