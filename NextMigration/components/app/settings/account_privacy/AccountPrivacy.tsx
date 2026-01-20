"use client"

import {useState} from "react";
import {useTranslations} from "next-intl";

export default function AccountPrivacy() {
    const t = useTranslations("settings")

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