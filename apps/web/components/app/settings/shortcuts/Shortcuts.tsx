"use client"
import {FiCommand} from "react-icons/fi";
import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/routing";

const shortcuts = [
    {
        title: "Create new Studoset",
        command: false,
        letter: "s",
        premium: false,
        delete: false,
    },
    {
        title: "Create new Studoset",
        command: false,
        letter: "v",
        premium: false,
        delete: false,
    },
    {
        title: "Create new folder",
        command: false,
        letter: "f",
        premium: false,
        delete: false,
    },
    {
        title: "Toggle searchbar",
        command: true,
        letter: "m",
        premium: false,
        delete: false,
    },
    {
        title: "Add card",
        command: true,
        letter: "a",
        premium: false,
        delete: false,
    },
    {
        title: "Save set",
        command: true,
        letter: "s",
        premium: false,
        delete: false,
    },
    {
        title: "Use SVEN import",
        command: true,
        letter: "i",
        premium: true,
        delete: false,
    },
]
export default function Shortcuts() {
    const t = useTranslations("settings")
    const [isMac, setIsMac] = useState(false);

    useEffect(() => {
        setIsMac(navigator.platform.includes("Mac"));
    }, []);

    return (<section className={"flex flex-col gap-5 w-full min-h-50"}>
        <span className={"w-full text-base font-bold h-fit"}>{t("shortcuts")}</span>
        <div className="
                      w-full min-h-40 grid grid-cols-2 grid-flow-col grid-rows-4
                      divide-y divide-studoborder p-5 px-5 h-fit rounded-3xl border border-studoborder
                      [&>*:nth-child(4)]:border-b-0
                      [&>*:nth-child(8)]:border-b-0
                    ">
            {shortcuts.map((shortcut, i) => {
                return (
                    <div key={i} className={"w-full flex flex-row px-5 py-2 justify-between items-center"}>
                        <span className={"font-bold"}>{shortcut.title}</span>
                        <div className={"w-fit gap-2 items-center flex justify-center text-sm"}>
                            {shortcut.premium && (<Link href={"/select"} className={"px-3 rounded-3xl bg-studogrey/50"}><span className={"font-bold h-fit bg-clip-text text-transparent truncate bg-linear-to-r from-indigo-300 to-blue-300"}>select</span></Link>)}
                            {shortcut.command && (
                                <div
                                    className={`border border-studoborder max-h-5 opacity-50 h-5 min-w-5 ${isMac ? "max-w-5 w-5" : "max-w-7 w-7 px-2"} justify-center flex items-center rounded-md`}>
                                    {isMac ? <FiCommand/> : "ctrl"}
                                </div>
                            )}
                            <span
                                className="border border-studoborder opacity-50 max-h-5 px-1 min-w-5 justify-center flex items-center rounded-md">{shortcut.letter}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    </section>)
}
