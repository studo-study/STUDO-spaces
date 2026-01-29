// components/app/app_header/burger.tsx
"use client"
import Link from "next/link";
import {HiOutlineMenuAlt2} from "react-icons/hi";
import {FaHouse} from "react-icons/fa6";
import {PiBooks} from "react-icons/pi";
import {IoFolderOpenOutline, IoSchoolOutline, IoSearch} from "react-icons/io5";
import {useTranslations} from "next-intl";
import {GoHome} from "react-icons/go";
import {IoIosAdd} from "react-icons/io";
import {usePathname} from "next/navigation";
import UserPopup from "@/components/app/app_header/user";
import {useUser} from "@/components/providers/UserProvider";

interface BurgerProps {
    burgerOpen: boolean,
    toggleSearch: () => void,
    toggleCreate: () => void,
}

const main = [
    {icon: <GoHome />, iconSelect: <FaHouse />, link:"/home", label:"home"},
    {icon: <HiOutlineMenuAlt2 />, link:"/your-files/sets", label:"sets"},
    {icon: <PiBooks />, link:"/your-files/courses", label:"courses"},
]

const folders = [
    {icon: <IoFolderOpenOutline />, link:"/your-files/folders", label:"folders"},
]

const classrooms = [
    {icon: <IoSchoolOutline />, link:"/classrooms", label:"classrooms"},
]

export default function Burger({burgerOpen, toggleSearch, toggleCreate}: BurgerProps) {
    const t = useTranslations("header")
    const pathname = usePathname();
    const isActive = (link: string) => {
        const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|de)/, '');
        return pathWithoutLocale === link || pathWithoutLocale.startsWith(link + '/');
    };
    const { user } = useUser();
    const isMod = user?.verified ?? false;

    return (
        <div className={`h-full border-r select-none dark:border-studoborder/30 border-gray-300 
            transition-[width] duration-300 flex flex-col gap-3 py-10 pb-20
            ${burgerOpen ? "w-57" : "w-30"}`}>

            {main.map((item, index) => (
                <Link href={item.link} key={index} className={`w-full h-10 ${isActive(item.link) ? "opacity-75": "opacity-50"} px-5`}>
                    <div className={`transition-colors duration-200 flex gap-5 rounded-4xl dark:hover:bg-studogrey hover:bg-slate-200 ${isActive(item.link) ? "dark:bg-studogrey bg-slate-200" : ""} flex-row justify-baseline px-5 items-center w-full h-10`}>
                        <div className="flex items-center min-w-10 justify-center cursor-pointer text-2xl dark:text-white">
                            {item.icon}
                        </div>
                        <span className={`dark:text-white select-none whitespace-nowrap transition-[opacity,transform] duration-200
                            ${burgerOpen ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4 pointer-events-none"}`}>
                            {t(item.label)}
                        </span>
                    </div>
                </Link>
            ))}

            <div className="w-full px-10 my-3 opacity-30">
                <div className="w-full h-0.5 rounded-4xl dark:bg-white bg-studodarkblue"/>
            </div>

            {folders.map((item, index) => (
                <Link href={item.link} key={index} className={`w-full h-10 ${isActive(item.link) ? "opacity-75": "opacity-50"} px-5`}>
                    <div className={`transition-colors duration-200 flex gap-5 rounded-4xl dark:hover:bg-studogrey hover:bg-slate-200 ${isActive(item.link) ? "dark:bg-studogrey bg-slate-200" : ""} flex-row justify-baseline px-5 items-center w-full h-10`}>
                        <div className="flex items-center min-w-10 justify-center cursor-pointer text-2xl dark:text-white">
                            {item.icon}
                        </div>
                        <span className={`dark:text-white select-none whitespace-nowrap transition-[opacity,transform] duration-200
                            ${burgerOpen ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4 pointer-events-none"}`}>
                            {t(item.label)}
                        </span>
                    </div>
                </Link>
            ))}

            <div className="w-full h-10 px-5">
                <div onClick={toggleCreate}
                     className="transition-colors duration-200 flex gap-5 select-none rounded-4xl opacity-50 cursor-pointer dark:hover:bg-studogrey hover:bg-slate-200 flex-row justify-baseline px-5 items-center w-full h-10">
                    <div className="flex items-center min-w-10 justify-center cursor-pointer text-2xl dark:text-white">
                        <IoIosAdd />
                    </div>
                    <span className={`dark:text-white select-none whitespace-nowrap transition-[opacity,transform] duration-200
                        ${burgerOpen ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4 pointer-events-none"}`}>
                        {t("create")}
                    </span>
                </div>
            </div>

            <div className="w-full px-10 my-3 opacity-30">
                <div className="w-full h-0.5 rounded-4xl dark:bg-white bg-studodarkblue"/>
            </div>

            {classrooms.map((item, index) => (
                <Link href={item.link} key={index} className={`w-full h-10 ${isActive(item.link) ? "opacity-75": "opacity-50"} px-5`}>
                    <div className={`transition-colors duration-200 flex gap-5 select-none rounded-4xl dark:hover:bg-studogrey hover:bg-slate-200 ${isActive(item.link) ? "dark:bg-studogrey bg-slate-200" : ""} flex-row justify-baseline px-5 items-center w-full h-10`}>
                        <div className="flex items-center min-w-10 justify-center cursor-pointer text-2xl dark:text-white">
                            {item.icon}
                        </div>
                        <span className={`dark:text-white whitespace-nowrap select-none transition-[opacity,transform] duration-200
                            ${burgerOpen ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4 pointer-events-none"}`}>
                            {t(item.label)}
                        </span>
                    </div>
                </Link>
            ))}

            <div onClick={toggleSearch} className="w-full h-10 aria-selected:opacity-100 px-5 opacity-50 cursor-pointer">
                <div className="transition-colors duration-200 flex gap-5 select-none rounded-4xl dark:hover:bg-studogrey hover:bg-slate-200 flex-row justify-baseline px-5 items-center w-full h-10">
                    <div className="flex items-center min-w-10 justify-center cursor-pointer text-2xl dark:text-white">
                        <IoSearch />
                    </div>
                    <span className={`dark:text-white select-none whitespace-nowrap transition-[opacity,transform] duration-200
                        ${burgerOpen ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4 pointer-events-none"}`}>
                        {t("search")}
                    </span>
                </div>
            </div>

            <div className="w-full h-full flex flex-col gap-3 justify-end items-baseline">
                <UserPopup isMod={isMod} burgerOpen={burgerOpen}/>
            </div>
        </div>
    )
}