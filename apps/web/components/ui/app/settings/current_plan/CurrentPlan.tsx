"use client"

import {Link} from "@/i18n/routing";
import {useTranslations} from "next-intl";

export default function CurrentPlan() {
    const t = useTranslations("settings")
    return( <section className={"flex flex-col gap-5 w-full min-h-fit"}>
        <span className={"w-full text-base font-bold h-fit"}>{t("subscription")}</span>
        <div className={"w-full h-fit rounded-3xl border dark:border-studoborder border-zinc-300"}>
            <div className={"w-full gap-4 px-10 py-8 flex flex-col"}>
                <div className={"w-full flex flex-row justify-between items-center"}>
                    <span className={"w-full text-base font-bold h-fit"}>{t("free")}</span>
                    <Link href={"/select"}
                          className={"font-bold cursor-pointer px-5 py-2 rounded-4xl bg-blue-500"}>{t("upgrade")}</Link>
                </div>
            </div>
        </div>
    </section>)
}