"use client"
import Link from "next/link";
import {HiOutlineMenuAlt2} from "react-icons/hi";
import {FaHouse} from "react-icons/fa6";
import {PiBooks} from "react-icons/pi";
import {IoFolderOpenOutline, IoSchoolOutline, IoSearch} from "react-icons/io5";
import {useTranslations} from "next-intl";
import {GoHome} from "react-icons/go";
import {IoIosAdd} from "react-icons/io";
import {MdAccountCircle} from "react-icons/md";
import {FaChevronDown} from "react-icons/fa";
import {usePathname} from "next/navigation";

interface BurgerProps {
    burgerOpen: boolean,
    toggleSearch: () => void,
    toggleCreate: () => void,
}

const main = [
    {testicon: <img src={"/house.png"} className={"h-8"}/>, icon: <GoHome />, iconSelect: <FaHouse />, link:"/home", label:"home"},
    {testicon: <img src={"/studyset.webp"} className={"h-9"}/>, icon: <HiOutlineMenuAlt2 />, link:"/your-files/sets", label:"sets"},
    {testicon: <img src={"/books.webp"} className={"h-9"}/>, icon: <PiBooks />, link:"/your-files/courses", label:"courses"},
]

const folders = [
    {testicon: <img src={"/folders.webp"} className={"h-9"}/>, icon: <IoFolderOpenOutline />, link:"/your-files/folders", label:"folders"},
]

const classrooms = [
    {testicon: <img src={"/school.webp"} className={"h-9"}/>, icon: <IoSchoolOutline />, link:"/classrooms", label:"classrooms"},
]

const account = [
    {icon: <MdAccountCircle />, iconSelect: <FaHouse />, link:"/account", label:"account"},
]

export default function Burger({burgerOpen, toggleSearch, toggleCreate}: BurgerProps) {
    const t = useTranslations("header")
    const pathname = usePathname();
    const isActive = (link: string) => {
        const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|de)/, '');
        return pathWithoutLocale === link || pathWithoutLocale.startsWith(link + '/');
    };




    return(<div className={`h-full border-r border-studoborder/30
    transition-all duration-300 flex flex-col gap-3 py-10 pb-20
    ${burgerOpen ? " w-57 px-" : "w-30"}`}>
        {main.map((item, index) => {
            return (<Link href={item.link} key={index} className={`w-full h-10 ${isActive(item.link) ? "opacity-75": "opacity-50"} px-5 `}>
                <div className={`transition-all duration-200 flex gap-5 rounded-4xl hover:bg-studogrey ${isActive(item.link) ? "bg-studogrey" : null} flex-row justify-baseline px-5 items-center w-full h-10`}>
                    <div className={`flex items-center min-w-10 justify-center cursor-pointer text-2xl text-white`}>
                        {item.icon}
                    </div>
                    <span className={`text-white whitespace-nowrap transition-all duration-200
                            ${burgerOpen ? "opacity-100 translate-x-0 delay-150" : "opacity-0 -translate-x-4"}`}>{t(item.label)}
                    </span>
                </div>
            </Link>);
        })}

        <div className={"w-full px-10 my-3 opacity-30"}>
            <div className={"w-full h-0.5 rounded-4xl bg-white"}/>
        </div>

        {folders.map((item, index) => {
            return (<Link href={item.link} key={index} className={`w-full h-10 ${isActive(item.link) ? "opacity-75": "opacity-50"} px-5 `}>
                <div className={`transition-all duration-200 flex gap-5 rounded-4xl hover:bg-studogrey ${isActive(item.link) ? "bg-studogrey" : null} flex-row justify-baseline px-5 items-center w-full h-10`}>
                    <div className={`flex items-center min-w-10 justify-center cursor-pointer text-2xl text-white`}>
                        {item.icon}
                    </div>
                    <span className={`text-white whitespace-nowrap transition-all duration-200
                            ${burgerOpen ? "opacity-100 translate-x-0 delay-150" : "opacity-0 -translate-x-4"}`}>{t(item.label)}
                    </span>
                </div>
            </Link>);
        })}
        <div className={`w-full h-10 px-5 `}>
            <div onClick={toggleCreate}
                className={`transition-all duration-200 flex gap-5 rounded-4xl opacity-50 cursor-pointer hover:bg-studogrey flex-row justify-baseline px-5 items-center w-full h-10`}>
                <div className={`flex items-center min-w-10 justify-center cursor-pointer text-2xl text-white`}>
                    <IoIosAdd />
                </div>
                <span className={`text-white whitespace-nowrap transition-all duration-200
                            ${burgerOpen ? "opacity-100 translate-x-0 delay-150" : "opacity-0 -translate-x-4"}`}>{t("create")}
                    </span>
            </div>
        </div>


        <div className={"w-full px-10 my-3 opacity-30"}>
            <div className={"w-full h-0.5 rounded-4xl bg-white"}/>
        </div>


        {classrooms.map((item, index) => {
            return (<Link href={item.link} key={index} className={`w-full h-10 ${isActive(item.link) ? "opacity-75": "opacity-50"} px-5 `}>
                <div className={`transition-all duration-200 flex gap-5 rounded-4xl hover:bg-studogrey ${isActive(item.link) ? "bg-studogrey" : null} flex-row justify-baseline px-5 items-center w-full h-10`}>
                    <div className={`flex items-center min-w-10 justify-center cursor-pointer text-2xl text-white`}>
                        {item.icon}
                    </div>
                    <span className={`text-white whitespace-nowrap transition-all duration-200
                            ${burgerOpen ? "opacity-100 translate-x-0 delay-150" : "opacity-0 -translate-x-4"}`}>{t(item.label)}
                    </span>
                </div>
            </Link>);
        })}

        <div onClick={toggleSearch}  className={`w-full h-10 aria-selected:opacity-100 px-5 opacity-50 cursor-pointer `}>
            <div className={`transition-all duration-200 flex gap-5 rounded-4xl hover:bg-studogrey flex-row justify-baseline px-5 items-center w-full h-10`}>
            <div className={`flex items-center min-w-10 justify-center cursor-pointer text-2xl text-white`}>
                <IoSearch />
            </div>
                <span className={`text-white whitespace-nowrap transition-all duration-200
                            ${burgerOpen ? "opacity-100 translate-x-0 delay-150" : "opacity-0 -translate-x-4"}`}>{t("search")}
                </span>
            </div>
        </div>

        <div className={"w-full h-full flex flex-col gap-3 justify-end items-baseline px-4"}>
            {account.map((item, index) => {
                return (<Link href={item.link} key={index} className={`w-full h-10 aria-selected:opacity-100 rounded-4xl bg-studogrey px-5 opacity-50 transition-all duration-100 flex gap-3 flex-row justify-around items-center`}>
                    <div className={"w-full flex flex-row items-center  justify-around gap-3 "}>
                        <div className={`flex items-center min-w-6 justify-center cursor-pointer text-2xl text-white`}>
                            {item.icon}
                        </div>
                        {burgerOpen ? <span className={`text-white ${burgerOpen ? "delay-100 opacity-100" : "opacity-0"} transition-a:l duration-300`}>{t(item.label)}</span> : null}
                    </div>
                    {burgerOpen ? <div className={`text-white w-full flex items-center justify-end ${burgerOpen ? "delay-100 opacity-100" : "opacity-0"} transition-a:l duration-300`}><FaChevronDown /></div> : null}
                </Link>);
            })}
        </div>
    </div>)
}