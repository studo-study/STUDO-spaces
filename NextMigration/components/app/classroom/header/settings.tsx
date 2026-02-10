"use client"
import {IoIosAdd, IoIosNotificationsOff} from "react-icons/io";
import {useEffect, useRef} from "react";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {FaEllipsis} from "react-icons/fa6";
import {IoExitOutline} from "react-icons/io5";

interface TriggerSettingsProps {
    SettingsIsOpen: boolean,
    setSettingsIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    toggleSettings: () => void,
}
export default function TriggerSettings({SettingsIsOpen, setSettingsIsOpen, toggleSettings}: TriggerSettingsProps) {
    const containerRef = useRef(null);
    const togglePopUp = () => {
        setSettingsIsOpen((prev) => !prev);
    };

    return(
        <button
            onClick={togglePopUp}
            ref={containerRef}
            className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300">
            <div className={"min-h-7 min-w-7 dark:text-white active:scale-95 transition-all duration-300 cursor-pointer text-xl text-studodarkblue border border-studoborder flex items-center justify-center rounded-full"}>
                <FaEllipsis/>
            </div>
            <SettingsPopup
                SettingsIsOpen={SettingsIsOpen}
                setSettingsIsOpen={setSettingsIsOpen}
                containerRef={containerRef}
                toggleSettings={toggleSettings}/>
        </button>
    )
}

interface SettingsPopupProps {
    SettingsIsOpen: boolean,
    setSettingsIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    toggleSettings: () => void,
    containerRef: React.RefObject<HTMLDivElement | null>,
}

const menuItems = [
    { to: "/create-studoset", icon: "/icons/studyset.svg", label: "create_ss", color: "from-emerald-400 to-teal-500" },
    { to: "/create-visualset", icon: "/icons/visualset.svg", label: "create_vs", color: "from-blue-400 to-indigo-500" },
];

function SettingsPopup({SettingsIsOpen, setSettingsIsOpen, containerRef, toggleSettings}: SettingsPopupProps) {
    const t = useTranslations("classroom.settings");
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setSettingsIsOpen(false);
            }
        };

        if (SettingsIsOpen) {
            setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [SettingsIsOpen, setSettingsIsOpen, containerRef]);

    return (
        <div
            ref={popupRef}
            className={`absolute top-full right-0 mt-4
        z-[9999] w-56 p-2 truncate
        rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out origin-top
        ${SettingsIsOpen
                ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"}
      `}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Arrow */}

            <span className={"w-full h-fit py-2 text-base px-4 flex-col flex items-baseline gap-2 justify-center"}>
                {t("title")}
                <hr className={"w-full h-0.5 rounded-full"}/>
            </span>
            {/* Menu Items */}
            <div className="relative flex flex-col gap-2">
                <button
                    className={`group relative flex items-center px-4 py-3 rounded-xl
              text-xs sm:text-sm font-medium text-white min-h-15
              hover:bg-gradient-to-r hover:from-red-400 to-rose-500 hover:text-white
              transition-all duration-200 ease-out gap-3 cursor-pointer
              ${SettingsIsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
            `}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg
              bg-gradient-to-br from-red-500 to-rose-500
              shadow-md shadow-black/10
              group-hover:scale-110 group-hover:shadow-lg
              transition-all duration-200`}
                    >
                        <IoIosNotificationsOff />
                    </div>
                    {t("mute")}
                </button>
                <button
                    onClick={() => { toggleSettings(); setSettingsIsOpen(false); }}
                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl
              text-studodarkblue dark:text-white min-h-15
              hover:bg-gradient-to-r hover:from-red-400 to-rose-500 hover:text-white
              transition-all duration-200 ease-out
              ${SettingsIsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
            `}
                    style={{
                        transitionDelay: SettingsIsOpen ? `${3 * 50}ms` : "0ms",
                    }}
                >
                    {/* Icon Container */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg
              bg-gradient-to-br from-red-500 to-rose-500
              shadow-md shadow-black/10
              group-hover:scale-110 group-hover:shadow-lg
              transition-all duration-200`}
                    >
                        <IoExitOutline />
                    </div>

                    {/* Label */}
                    <span className="font-medium text-sm">
              {t("leave")}
            </span>
                </button>
            </div>
        </div>
    );
}