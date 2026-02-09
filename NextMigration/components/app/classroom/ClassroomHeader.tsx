"use client"
import {useTranslations} from "next-intl";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Classroom} from "@/types/types";
import {mockFullClassrooms} from "@/data/mocks/classroomsMock";
import {IoPersonAdd, IoSchoolOutline} from "react-icons/io5";
import {FaUserFriends} from "react-icons/fa";
import {TbWorld} from "react-icons/tb";
import {LiaUniversitySolid} from "react-icons/lia";
import {FaEllipsis} from "react-icons/fa6";
import {IoIosAdd} from "react-icons/io";
import {ImLink} from "react-icons/im";
import TriggerClassroom from "@/components/app/classrooms/create_classroom";
import {useState} from "react";
import TriggerInvite from "@/components/app/classroom/header/triggerInvite";

const classroom: Classroom = mockFullClassrooms[0];

export default function ClassroomHeader() {
    const t = useTranslations("classroom")
    const pathname = usePathname();
    const items = [
        {link: `/classroom/${classroom.id}/overview`, label:"overview"},
        {link: `/classroom/${classroom.id}/sets`, label:"sets"},
        {link: `/classroom/${classroom.id}/members`, label:"users"},
        {link: `/classroom/${classroom.id}/challenges`, label:"challenges"}
    ]

    const [invite, setInvite] = useState(false);
    const togglePopUp = () => {
        setInvite((prev) => !prev);
    };
    const copyText = "www.studo.study" + pathname;
    const copy = () => {
        navigator.clipboard.writeText(copyText);

    }

    return (
        <div className={"w-full min-h-20 flex flex-col justify-between items-center max-h-100"}>
            <div className={"w-full h-fit flex items-center justify-between dark:text-white text-studodarkblue"}>
                <div className={"min-w-fit truncate font-bold text-3xl flex flex-row gap-5 items-center"}>
                        <span> {classroom.name}</span>
                        <div>{getClassroomType(classroom.type)}</div>

                    </div>
                <div className={"w-fit flex flex-row items-center text-xl justify-center gap-5"}>
                    <button
                        className="relative flex z-10 items-center justify-center cursor-pointer active:scale-95 transition-all duration-300">
                        <div className="absolute bg-amber-500/50 h-7 w-7 rounded-full blur-sm"/>
                        <div
                            className="relative z-10 shadow-2xl bg-amber-500 min-h-7 min-w-7 text-xl flex items-center justify-center text-white rounded-full border border-studoborder">
                            <IoIosAdd/>
                        </div>
                    </button>
                    <div className={"min-h-7 min-w-7 dark:text-white active:scale-95 transition-all duration-300 cursor-pointer text-xl text-studodarkblue border border-studoborder flex items-center justify-center rounded-full"}>
                        <FaEllipsis/>
                    </div>

                </div>
            </div>
            <span className={"w-full dark:text-white opacity-50 text-base flex gap-2 items-center"}>
               <LiaUniversitySolid />
               <span>{classroom.school}</span>
            </span>
            <div className={"w-full flex flex-row items-center justify-between py-3 pt-7"}>
                <div className={"w-full flex flex-row items-center gap-5"}>
                    {items.map((item, i) =>
                        <Link key={i} className={`w-fit min-w-20 text-center ${isActive(item.link, pathname) ? "font-bold" : null} dark:text-white text-studodarkblue`} href={item.link}>{t(item.label)}</Link>)}

                </div>
                <div className={"w-full flex flex-row items-center justify-end gap-5"}>
                    <TriggerInvite
                        togglePopUp={togglePopUp}
                    />
                    <button
                        onClick={copy}
                        className={"w-fit px-7 py-2 rounded-full active:scale-95 transition-all duration-300 dark:bg-white cursor-pointer flex items-center gap-3 justify-center"}><ImLink />{t("copy")}</button>
                </div>
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
    console.log("vergelijking: ", );
    return pathWithoutLocale === link || pathWithoutLocale.startsWith(link + '/');
}