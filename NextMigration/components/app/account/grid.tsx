"use client"
import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {BsGridFill} from "react-icons/bs";
import {HiOutlineViewList} from "react-icons/hi";
import {IoIosAdd} from "react-icons/io";
import Link from "next/link";

export default function AccountGrid() {
    const [grid, setGrid] = useState<boolean>(true);
    const t = useTranslations("account");
    const containerRef = useRef(null);
    const [AddIsOpen, setAddIsOpen] = useState(false);
    const togglePopUp = () => {
        setAddIsOpen((prev) => !prev);
    };

    const toggleCreate = () => {
        setAddIsOpen((prev) => !prev);
    }

    return (
    <div className={"w-full h-fit flex flex-col gap-5"}>
        <div className={"w-full h-20 py-5 flex flex-row justify-between gap-3"}>
            <span className={"font-bold text-lg dark:text-white text-studodarkblue"}>{t("subtitle_sets")}:</span>
            <div className={"w-fit flex flex-row gap-5"}>
                <button
                    onClick={() => setGrid(!grid)}
                    className={`${grid ? "border-white text-white bg-studogrey" : "border-studogrey text-studogrey"} cursor-pointer w-8 h-8 rounded-lg border border-studogrey text-studogrey text-lg flex items-center justify-center`}
                >
                    <BsGridFill />
                </button>
                <button
                    onClick={() => setGrid(!grid)}
                    className={`${grid ? "border-studogrey text-studogrey" : "border-white text-white bg-studogrey"} cursor-pointer w-8 h-8 rounded-lg border border-studogrey text-studogrey text-lg flex items-center justify-center`}
                >
                    <HiOutlineViewList />
                </button>
                <button
                    onClick={togglePopUp}
                    ref={containerRef}
                    className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300">
                    <div className="absolute bg-blue-500/50 h-8 w-8 rounded-full blur-sm"/>
                    <div
                        className="relative z-10 shadow-2xl bg-blue-500 h-8 min-w-8 text-3xl flex items-center justify-center text-white rounded-full border border-studoborder">
                        <IoIosAdd/>
                    </div>
                    <AddPopUp
                        AddIsOpen={AddIsOpen}
                        setAddIsOpen={setAddIsOpen}
                        containerRef={containerRef}
                        toggleCreate={toggleCreate}/>
                </button>
            </div>

        </div>
        <div className={"w-full h-fit gap-2 flex flex-col"}>
            <div className={`flex-1 overflow-y-scroll scroll-hidden min-h-95 max-h-95
        ${grid ? "grid grid-cols-4 gap-3 gap-y-3" : "flex flex-col gap-5"}`}
            >
                <div className={`${grid ? "h-45 w-full" : "min-h-20 w-full"} bg-rose-500`}/>
                <div className={`${grid ? "h-45 w-full" : "min-h-20 w-full"} bg-rose-500`}/>
                <div className={`${grid ? "h-45 w-full" : "min-h-20 w-full"} bg-rose-500`}/>
                <div className={`${grid ? "h-45 w-full" : "min-h-20 w-full"} bg-rose-500`}/>
            </div>
        </div>

        <div className={"w-full h-15 flex justify-between"}>
            <button className={"w-fit px-5 py-2 h-10 rounded-full bg-blue-500 border border-studoborder/50 text-white"}>{t("log_out")}</button>
            <button className={"w-fit px-5 py-2 h-10 rounded-full bg-rose-500 border border-studoborder/50 text-white"}>{t("delete")}</button>
        </div>
    </div>)
}

interface AddPopupProps {
    AddIsOpen: boolean,
    setAddIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    containerRef: React.RefObject<HTMLDivElement | null>,
    toggleCreate: () => void,
}

const menuItems = [
    { to: "/create-studoset", icon: "/icons/studyset.svg", label: "create_ss", color: "from-emerald-400 to-teal-500" },
    { to: "/create-visualset", icon: "/icons/visualset.svg", label: "create_vs", color: "from-blue-400 to-indigo-500" },
];

function AddPopUp({AddIsOpen, setAddIsOpen, containerRef, toggleCreate}: AddPopupProps) {
    const t = useTranslations("header");
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setAddIsOpen(false);
            }
        };

        if (AddIsOpen) {
            setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [AddIsOpen, setAddIsOpen, containerRef]);

    return (
        <div
            ref={popupRef}
            className={`absolute top-full right-0 mt-4
        z-[9999] w-55 p-2 truncate
        rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out origin-top
        ${AddIsOpen
                ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"}
      `}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Arrow */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45
        bg-white/80 dark:bg-[#1e293b]/90  backdrop-blur-xl
        border-l border-t border-white/50 dark:border-white/10"
            />

            {/* Menu Items */}
            <div className="relative flex flex-col gap-1">
                {menuItems.map((item, index) => (
                    <Link
                        key={item.to}
                        href={item.to}
                        onClick={() => setAddIsOpen(false)}
                        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl
              text-studodarkblue dark:text-white
              hover:bg-gradient-to-r hover:${item.color} hover:text-white
              transition-all duration-200 ease-out
              ${AddIsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
            `}
                        style={{
                            transitionDelay: AddIsOpen ? `${index * 50}ms` : "0ms",
                        }}
                    >
                        {/* Icon Container */}
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg
              bg-gradient-to-br ${item.color}
              shadow-md shadow-black/10
              group-hover:scale-110 group-hover:shadow-lg
              transition-all duration-200`}
                        >
                            <img
                                src={item.icon}
                                alt=""
                                className="h-4 w-4 brightness-0 invert"
                            />
                        </div>

                        {/* Label */}
                        <span className="font-medium text-sm">
              {t(item.label)}
            </span>

                        {/* Hover Arrow */}
                        <svg
                            className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ))}
            </div>
        </div>
    );
}