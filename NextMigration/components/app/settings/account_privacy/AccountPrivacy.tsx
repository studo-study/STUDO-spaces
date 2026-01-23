"use client"

import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";

export default function AccountPrivacy() {
    const t = useTranslations("settings")
    const statusRef = useRef<HTMLSelectElement>(null);
    const [status, setStatus] = useState<string>("active");

    const toggleStatus = () => {
        if(statusRef.current) {
            setStatus(statusRef.current.value);
        }
    }
    return(<section className={"flex flex-col gap-5 w-full min-h-50"}>
        <span className={"w-full text-base font-bold h-fit"}>{t("account_privacy")}</span>
        <div className={"w-full min-h-40 h-fit rounded-3xl border border-studoborder"}>
            <div className={"w-full border-b gap-4 border-studoborder px-10 py-8 flex flex-col"}>
                <div className={"w-full flex flex-row justify-between items-center"}>
                    <span className={"w-full text-base font-bold h-fit"}>{t("private_allsets")}</span>
                    <div className="checkbox-wrapper-2">
                        <input type="checkbox" className="sc-gJwTLC ikxBAC"/>
                    </div>
                </div>
            </div>
            <div className={"w-full border-b gap-4 border-studoborder px-10 py-8 flex flex-col"}>
                <div className={"w-full flex flex-row justify-between items-center"}>
                    <span className={"w-full text-base font-bold h-fit"}>{t("status")}</span>
                    <div className="w-fit gap-3 flex flex-row items-center justify-center">
                        <div
                            className="
                                px-4 sm:px-6 py-2 sm:py-2.5 rounded-full
                                border border-studogrey/30
                                bg-white dark:bg-gray-700
                                text-studodarkblue dark:text-white
                                font-medium text-xs sm:text-sm
                                shadow-sm hover:shadow-md
                                transition-all duration-200 flex items-center justify-center flex-row gap-2
                                cursor-pointer w-30 text-center
                                focus:outline-none focus:ring-2 focus:ring-studogrey/50
                                appearance-none">
                            <div className={`w-3 h-3 rounded-full ${status === "inactive" ? "bg-rose-500" : status === "away" ? "bg-amber-300" : "bg-emerald-500"}`}></div>
                            <select onChange={toggleStatus} ref={statusRef} className={"w-fit appearance-none"}>
                                <option value="inactive">{t("inactive")}</option>
                                <option value="away">{t("away")}</option>
                                <option value="active" selected>{t("active")}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"w-full gap-4  px-10 py-8 flex flex-col"}>
                <div className={"w-full flex flex-row justify-between items-center"}>
                    <div className={"w-full h-fit flex flex-col gap-3"}>
                        <span className={"w-full text-base font-bold h-fit"}>{t("delete_title")}</span>
                        <span className={"text-sm"}>{t("delete_info")}</span>
                    </div>
                    <button
                        className={"font-bold cursor-pointer px-5 py-2 rounded-4xl bg-rose-500"}>{t("delete")}</button>
                </div>
            </div>
        </div>
    </section>)
}