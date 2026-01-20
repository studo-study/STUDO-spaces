"use client"

import {useState} from "react";
import {useTranslations} from "next-intl";

export default function PersonalInfo() {
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
    return(<section className={"flex flex-col gap-5 w-full min-h-50"}>
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
    )
}