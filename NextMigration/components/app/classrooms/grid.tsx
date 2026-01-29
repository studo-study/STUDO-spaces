"use client"

import {useRef, useState} from "react";
import {LastStudied} from "@/types/types";
import {useLocale, useTranslations} from "next-intl";
import SetSearch from "@/components/app/your-files/sets/search";
import {HiOutlineViewList} from "react-icons/hi";
import {BsGridFill} from "react-icons/bs";
import {IoIosAdd} from "react-icons/io";
import SetItem from "@/components/app/SetItem";

export default function ClassroomGrid() {
    const [grid, setGrid] = useState<boolean>(false);
    const containerRef = useRef(null);
    const selectionRef = useRef<HTMLSelectElement>(null);
    const [AddIsOpen, setAddIsOpen] = useState(false);
    const togglePopUp = () => {
        setAddIsOpen((prev) => !prev);
    };

    const toggleCreate = () => {
        setAddIsOpen((prev) => !prev);
    }


    const t = useTranslations("y_f.your_sets");
    const locale = useLocale();

    return (
        <div className="w-full h-full flex flex-col gap-5 scroll-hidden">
            <div className={"w-full h-20 z-20 bg-gray-800 py-8 flex flex-row items-center justify-between gap-3"}>
                <div className={"w-fit flex flex-row gap-5 items-center"}>
                    <select
                        name="sort sets"
                        ref={selectionRef}
                        defaultValue="all"
                        className="
                                px-4 sm:px-6 py-2 sm:py-2.5 rounded-full
                                border border-studogrey/30
                                bg-white dark:bg-gray-700
                                text-studodarkblue dark:text-white
                                font-medium text-xs sm:text-sm
                                shadow-sm hover:shadow-md
                                transition-all duration-200
                                cursor-pointer w-45 text-center
                                focus:outline-none focus:ring-2 focus:ring-studogrey/50
                                appearance-none">
                        <option value="all">{t("all")}</option>
                        <option value="recent">{t("recent")}</option>
                        <option value="studied">{t("full_studied")}</option>
                        <option value="created">{t("created")}</option>

                    </select>
                </div>
                <div className={"w-fit flex flex-row gap-5 items-center"}>
                    <SetSearch/>
                    <button
                        onClick={() => setGrid(!grid)}
                        className={`${grid ? "border-studogrey text-studogrey" : "border-white text-white bg-studogrey"} cursor-pointer w-8 h-8 rounded-lg border border-studogrey text-studogrey text-lg flex items-center justify-center`}
                    >
                        <HiOutlineViewList />
                    </button>
                    <button
                        onClick={() => setGrid(!grid)}
                        className={`${grid ? "border-white text-white bg-studogrey" : "border-studogrey text-studogrey"} cursor-pointer w-8 h-8 rounded-lg border border-studogrey text-studogrey text-lg flex items-center justify-center`}
                    >
                        <BsGridFill />
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
                        </button>
                </div>
            </div>
        </div>);

}