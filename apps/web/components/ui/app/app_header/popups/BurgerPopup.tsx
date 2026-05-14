"use client"
import Link from "next/link";
import {MdAccountCircle, MdOutlineVerifiedUser} from "react-icons/md";
import {useTranslations} from "next-intl";
import {useState} from "react";
import {FaAngleDown} from "react-icons/fa";
import {IoSettingsOutline} from "react-icons/io5";
import {useUser} from "@/components/providers/UserProvider";

interface UserPopupProps {
    burgerOpen: boolean;
}

const menuItems = {
    account: {icon: <MdAccountCircle />, link: "/account", label: "account"},
    settings: {icon: <IoSettingsOutline />, link: "/settings", label: "settings"},
    moderator: {icon: <MdOutlineVerifiedUser />, link: "/admin/stats", label: "ad"},
};

export default function UserPopup({ burgerOpen }: UserPopupProps) {
    const t = useTranslations("header");
    const [isOpen, setIsOpen] = useState(false);
    const { isModerator } = useUser();


    const MenuItem = ({ item, showText }: { item: typeof menuItems.account, showText: boolean }) => (
        <div className="w-full h-10 flex flex-row items-center">
            <div className="flex items-center min-w-10 justify-center text-2xl dark:text-white">
                {item.icon}
            </div>
            <span className={`dark:text-white whitespace-nowrap transition-all duration-200
                ${showText ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}>
                <Link href={item.link} className="hover:underline">{t(item.label)}</Link>
            </span>
        </div>
    );

    const getHeight = () => {
        if (!isOpen) return "h-10";
        return isModerator ? "h-[8.3rem]" : "h-[5.3rem]"; // 40px per item + 20px gaps
    };

    return (
        <div className="w-full px-5 relative h-10 opacity-50">
            {burgerOpen ? (
                <div className={`absolute bottom-0 left-5 right-5 transition-all duration-300 ease-out
                    flex flex-col-reverse gap-2 rounded-4xl dark:bg-studogrey/50 bg-slate-200 overflow-hidden px-5 py-2
                    ${getHeight()}`}>

                    {/* Account - altijd onderaan */}
                    <div className="w-full flex flex-row items-center">
                        <div className="flex items-center min-w-10 justify-center text-2xl dark:text-white">
                            {menuItems.account.icon}
                        </div>
                        <div className="w-full flex flex-row justify-between dark:text-white items-center">
                            <span className={`whitespace-nowrap transition-all duration-200 delay-150
                                ${burgerOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}>
                                <Link href={menuItems.account.link} className="hover:underline">
                                    {t(menuItems.account.label)}
                                </Link>
                            </span>
                            <FaAngleDown
                                onClick={() => setIsOpen(!isOpen)}
                                className={`cursor-pointer transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            />
                        </div>
                    </div>

                    <div className={`flex flex-col gap-2 transition-all duration-300 ease-out
                        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                        <MenuItem item={menuItems.settings} showText={burgerOpen && isOpen} />
                        {isModerator && <MenuItem item={menuItems.moderator} showText={burgerOpen && isOpen} />}
                    </div>
                </div>
            ) : (
                <Link href={menuItems.account.link}
                      className="flex items-center h-10 gap-5 rounded-4xl dark:bg-studogrey/50 bg-slate-200 px-5 w-full">
                    <div className="flex items-center min-w-10 justify-center text-2xl dark:text-white">
                        {menuItems.account.icon}
                    </div>
                </Link>
            )}
        </div>
    );
}