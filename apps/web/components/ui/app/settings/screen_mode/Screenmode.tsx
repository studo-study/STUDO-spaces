"use client"

import {useTranslations} from "next-intl";

export default function Screenmode() {
    const t = useTranslations("settings")

    return(<section className={"flex flex-col gap-5 w-full min-h-50"}>
        <span className={"w-full text-base font-bold h-fit"}>{t("screen_mode")}</span>
        <div className={"w-full min-h-40 h-fit rounded-3xl border border-studoborder"}>
            <div className={"w-full border-b gap-4 border-studoborder px-10 py-8 flex flex-col"}>
                <div className={"w-full flex flex-row justify-between items-center"}>
                    <span className={"w-full text-base font-bold h-fit"}>{t("page_color")}</span>
                    <select
                        name="sort sets"
                        defaultValue="all"
                        className="
                                px-4 sm:px-6 py-2 sm:py-2.5 rounded-full
                                border border-studogrey/30
                                bg-white dark:bg-gray-700
                                text-studodarkblue dark:text-white
                                font-medium text-xs sm:text-sm
                                shadow-sm hover:shadow-md
                                transition-all duration-200
                                cursor-pointer w-30 text-center
                                focus:outline-none focus:ring-2 focus:ring-studogrey/50
                                appearance-none">
                        <option value="all">{t("auto")}</option>
                        <option value="studyset">{t("dark")}</option>
                        <option value="visualset">{t("light")}</option>
                    </select>
                </div>
            </div>
            <div className={"w-full gap-4  px-10 py-8 flex flex-col"}>
                <div className={"w-full flex flex-row justify-between items-center"}>
                    <span className={"w-full text-base font-bold h-fit"}>{t("language")}</span>
                    <select
                        name="sort sets"
                        defaultValue="all"
                        className="
                                px-4 sm:px-6 py-2 sm:py-2.5 rounded-full
                                border border-studogrey/30
                                bg-white dark:bg-gray-700
                                text-studodarkblue dark:text-white
                                font-medium text-xs sm:text-sm
                                shadow-sm hover:shadow-md
                                transition-all duration-200
                                cursor-pointer w-30 text-center
                                focus:outline-none focus:ring-2 focus:ring-studogrey/50
                                appearance-none">
                        <option value="all">English</option>
                        <option value="studyset">Nederlands</option>
                        <option value="visualset">Français</option>
                    </select>
                </div>
            </div>
        </div>
    </section>)
}