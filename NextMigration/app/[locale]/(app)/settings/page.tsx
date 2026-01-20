"use client"
import {useTranslations} from "next-intl";
import {useState} from "react";
import {Link} from "@/i18n/routing";

export default function SettingsPage() {
    const t = useTranslations("settings")
    const [editName, setEditName] = useState<boolean>(false);
    const [editMail, setEditMail] = useState<boolean>(false);
    const [editRole, setEditRole] = useState<boolean>(false)

    const toggleEditName = () => {
        setEditName(!editName)
    }
    const toggleEditMail = () => {
        setEditMail(!editMail)
    }
    const toggleEditRole = () => {
        setEditRole(!editRole)
    }

    return(
        <div className="w-full h-fit py-15 flex flex-col dark:text-white text-studodarkblue gap-15 scroll-hidden">
            <span className={"w-full h-10 font-bold text-3xl"}>{t("title")}:</span>
            <section className={"flex flex-col gap-5 w-full min-h-50"}>
                <span className={"w-full text-base font-bold h-fit"}>{t("personal info")}</span>
                <div className={"w-full min-h-40 h-fit rounded-3xl border border-studoborder"}>
                    <div className={"w-full border-b gap-4 border-studoborder p-10 flex flex-col"}>
                        <span className={"w-full text-base font-bold h-fit"}>{t("username")}</span>
                        <div className={"w-full flex flex-row justify-between"}>
                            {editName ? <input value={"username"} autoFocus={editName} className={"w-3/5 outline-none"} type="text"/> : <span>username</span>}
                            <button
                                onClick={toggleEditName}
                                className={"font-bold text-blue-500 cursor-pointer"}
                            >{t("edit")}</button>
                        </div>
                    </div>
                    <div className={"w-full border-b gap-4 border-studoborder p-10 flex flex-col"}>
                        <span className={"w-full text-base font-bold h-fit"}>{t("email")}</span>
                        <div className={"w-full flex flex-row justify-between"}>
                            {editMail ? <input value={"email"} autoFocus={editMail} className={"w-3/5 outline-none"} type="text"/> : <span>email</span>}
                            <button
                                onClick={toggleEditMail}
                                className={"font-bold text-blue-500 cursor-pointer"}
                            >{t("edit")}</button>
                        </div>
                    </div>
                    <div className={"w-full gap-4  p-10 flex flex-col"}>
                        <span className={"w-full text-base font-bold h-fit"}>{t("role")}</span>
                        <div className={"w-full flex flex-row justify-between"}>
                            {editRole ? <select className={"w-4/5"} name="role" id="role">
                                <option>{t("student")}</option>
                                <option>{t("teacher")}</option>
                                <option>{t("professor")}</option>
                            </select> : <span>student</span>}
                            <button
                                onClick={toggleEditRole}
                                className={"font-bold text-blue-500 cursor-pointer"}
                            >{t("edit")}</button>
                        </div>
                    </div>
                </div>
            </section>
            <section className={"flex flex-col gap-5 w-full min-h-50"}>
                <span className={"w-full text-base font-bold h-fit"}>{t("subscription")}</span>
                <div className={"w-full h-fit rounded-3xl border border-studoborder"}>
                    <div className={"w-full gap-4 px-10 py-8 flex flex-col"}>
                        <div className={"w-full flex flex-row justify-between items-center"}>
                            <span className={"w-full text-base font-bold h-fit"}>{t("free")}</span>
                            <Link href={"/select"}
                                className={"font-bold cursor-pointer px-5 py-2 rounded-4xl bg-blue-500"}>{t("upgrade")}</Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className={"flex flex-col gap-5 w-full min-h-50"}>
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
            </section>
            <section className={"flex flex-col gap-5 w-full min-h-50"}>
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
            </section>

        </div>
    )
}