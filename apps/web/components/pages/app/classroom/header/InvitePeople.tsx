import {useEffect, useRef} from "react";
import {useTranslations} from "next-intl";
import {IoIosClose} from "react-icons/io";
import {HiUserGroup} from "react-icons/hi";
import {IoPersonAdd, IoSchoolOutline} from "react-icons/io5";
import InviteItem from "@/components/pages/app/classroom/header/InviteItem";

interface InvitePeopleProps {
    inviteOpen: boolean;
    setInviteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InvitePeople({inviteOpen, setInviteOpen}: InvitePeopleProps) {
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const t = useTranslations("classroom.invitepeople")
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node)
            ) {
                setInviteOpen(false);
            }
        };

        if (inviteOpen) {
            setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [inviteOpen, setInviteOpen, popupRef]);


    useEffect(() => {
        if (inviteOpen) {
            inputRef.current?.focus();
        } else {
            inputRef.current?.blur();
        }
    }, [inviteOpen]);

    return (
        <div className={`fixed inset-0 flex items-baseline justify-center pt-70 w-full bg-black/50 h-full z-[9999] ${inviteOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}>

            <div ref={popupRef} className={`w-1/4 min-h-135
                      z-[9999] p-2 truncate rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
      transition-all duration-300 ease-out origin-top px-7 py-10 flex flex-col gap-3 justify-between items-center
      ${inviteOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-5" +
                "" +
                ""}`}
            >
                <div className={"w-full flex px-2 py-2 dark:text-white text-4xl text-studodarkblue items-center justify-end absolute top-0 left-0 z-10"}>
                    <div className={"h-8 w-8 rounded-full hover:bg-studogrey transition-all duration-300 justify-center items-center cursor-pointer active:scale-95 flex"}>
                        <IoIosClose  onClick={() => {setInviteOpen(false)}}/>
                    </div>
                </div>
                <div className={"w-full h-fit flex flex-col gap-7"}>
                    <div className="flex items-center justify-baseline text-lg px-2 dark:text-white text-studodarkblue">

                        <IoPersonAdd />
                        <span className="w-full text-lg select-none sm:text-xl md:text-2xl px-2 sm:px-5 font-bold text-studodarkblue dark:text-white">
                            {t("title")}:
                        </span>

                    </div>


                    <div className={"w-full h-fit flex flex-col gap-3"}>
                        <span className={"dark:text-white text-studodarkblue"}>{t("subtitle_title")}</span>
                        <div className="flex flex-col w-full gap-2 items-center justify-between">
                            <input
                                ref={inputRef}
                                placeholder={t("placeholder")}
                                type="text"
                                autoFocus={inviteOpen}
                                className={"h-12 px-5 gap-5 text-white w-full rounded-4xl glass-rgb transition-all duration-300 border border-studoborder/30 shadow-2xl focus:ring-0 outline-none flex justify-around"}/>
                        </div>
                    </div>

                    <div className={"w-full h-fit flex flex-col gap-3"}>
                        <span className={"dark:text-white text-studodarkblue"}>{t("subtitle_invited")}</span>
                        <div className="flex flex-col w-full gap-2 items-center">
                            <InviteItem/>
                        </div>
                    </div>

                </div>
                <button type="submit" className="bg-gradient-to-br from-yellow-400 to-amber-500 w-full cursor-pointer h-12 text-xl text-white border-studoborder border
                    rounded-4xl font-bold active:scale-95 transition-all duration-300 shadow-3xl">
                    {t("button")}
                </button>
            </div>
        </div>
    );
}