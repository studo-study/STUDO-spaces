"use client"
import {useTranslations} from "next-intl";
import Link from "next/link";
import {usePathname} from "next/navigation";
import TriggerClassroom from "@/components/app/classrooms/create_classroom";
import {useCallback, useRef, useState} from "react";
import CreateClassroom from "@/components/app/classrooms/create_classroompopup";
import {Classroom} from "@/types/types";
import {mockFullClassrooms} from "@/data/mocks/classroomsMock";
import {IoSchoolOutline} from "react-icons/io5";
import {FaUserFriends} from "react-icons/fa";
import {TbWorld} from "react-icons/tb";
import {LiaUniversitySolid} from "react-icons/lia";
import {FaEllipsis} from "react-icons/fa6";

const classroom: Classroom = mockFullClassrooms[0];

export default function ClassroomHeader() {
    const t = useTranslations("classroom")
    const pathname = usePathname();
    const items = [
        {link: `/classroom/${classroom.id}`, label:"overview"},
        {link: `/classroom/${classroom.id}/sets`, label:"sets"},
        {link: `/classroom/${classroom.id}/members`, label:"users"},
        {link: `/classroom/${classroom.id}/challenges`, label:"challenges"}
    ]


    return (
        <div className={"w-full min-h-20 flex flex-col justify-between items-center max-h-100"}>
            <div className={"w-full h-fit flex items-center justify-between dark:text-white text-studodarkblue"}>
                <div className={"min-w-fit truncate font-bold text-3xl flex flex-row gap-5 items-center"}>
                        <span> {classroom.name}</span>
                        <div>{getClassroomType(classroom.type)}</div>

                    </div>
                <div className={"w-fit flex flex-row items-center text-xl justify-center gap-5"}>
                    <FaEllipsis width={30}/>
                </div>
            </div>
            <span className={"w-full dark:text-white opacity-50 text-base flex gap-2 items-center"}>
               <LiaUniversitySolid />
               <span>{classroom.school}</span>
            </span>
            <div className={"w-full flex flex-row items-center gap-5 py-5 pt-7"}>
                {items.map((item, i) =>
                    <Link key={i} className={`w-fit min-w-20 text-center ${isActive(item.link, pathname) ? "font-bold" : null} dark:text-white text-studodarkblue`} href={item.link}>{t(item.label)}</Link>)}

            </div>
            <div className={"w-full z-10 bottom-0 h-0.5 bg-studogrey"}/>
        </div>)
}


function getClassroomType(type: string) {
    switch (type) {
        case "class_group": return <IoSchoolOutline />
        case "study_group": return <FaUserFriends />
        case "community_group": return <TbWorld />
    }
}

function isActive(link: string, pathname: string) {
    const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|de)/, '');
    return pathWithoutLocale === link || pathWithoutLocale.startsWith(link + '/');
}