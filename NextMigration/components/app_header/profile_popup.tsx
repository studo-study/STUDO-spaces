"use client"
import {IoIosAdd, IoMdNotificationsOutline} from "react-icons/io";
import {useEffect, useRef} from "react";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {PiStudent} from "react-icons/pi";

interface ProfileTriggerPopupProps{
    ProfileIsOpen: boolean,
    setProfileIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}
export default function TriggerProfile({ProfileIsOpen, setProfileIsOpen}: ProfileTriggerPopupProps) {
    const containerRef = useRef(null);
    const togglePopUp = () => {
        setProfileIsOpen((prev) => !prev);
    };

    return(
        <button
            ref={containerRef}
            onClick={togglePopUp}
            className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300">
            <div className="absolute bg-emerald-500/50 h-10 w-10 rounded-full blur-sm"/>
            <div
                className="relative z-10 shadow-2xl bg-emerald-600 h-10 w-10 text-xl flex items-center justify-center text-white rounded-full border border-studoborder">
                <PiStudent/>
            </div>
            <ProfilePopup
                ProfileIsOpen={ProfileIsOpen}
                setProfileIsOpen={setProfileIsOpen}
                containerRef={containerRef}
            />
        </button>
    )
}

interface ProfilePopupProps {
    ProfileIsOpen: boolean,
    setProfileIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    containerRef: React.RefObject<HTMLDivElement | null>,
}


function ProfilePopup({ProfileIsOpen, setProfileIsOpen, containerRef}: ProfilePopupProps) {
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
                setProfileIsOpen(false);
            }
        };

        if (ProfileIsOpen) {
            setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ProfileIsOpen, setProfileIsOpen, containerRef]);

    return (
        <div
            ref={popupRef}
            className={`absolute top-full right-0 mt-4
        z-[9999] w-56 truncate
        rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out origin-top
        ${ProfileIsOpen
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
            <div className={"w-full h-full flex flex-col"}>
                <div className={"w-full flex text-sm items-center dark:text-white/30 h-10 border-b border-studoborder/30 px-5 "}>
                    {t("notifs")}:
                </div>
                <div className={"w-full h-50"}></div>
            </div>

        </div>
    );
}