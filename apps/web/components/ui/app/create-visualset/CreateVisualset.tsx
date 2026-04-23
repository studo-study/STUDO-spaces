"use client"
import {useTranslations} from "next-intl";
import {SetStateAction, useEffect, useLayoutEffect, useRef, useState} from "react";
import SetImporter from "@/components/ui/app/create-studoset/SetImporter";
import CardItem from "@/components/ui/app/create-studoset/CardItem";
import Sortable from "sortablejs";
import ImportButton from "@/components/ui/app/create-studoset/importButton";
import {CardData} from "@/types/types";

const LANGUAGES = [
    {code: "en", name: "English"},
    {code: "nl", name: "Dutch"},
    {code: "fr", name: "French"},
    {code: "de", name: "German"},
    {code: "es", name: "Spanish"}
];

export default function CreateVisualSetForm() {
    const t = useTranslations("createvisualset");
    const [showImporter, setShowImporter] = useState(false);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const isMutating = false;


    useEffect(() => {
        if (!cardsContainerRef.current) return;

        const sortable = new Sortable(cardsContainerRef.current, {
            animation: 300,
        });

        return () => sortable.destroy();
    }, [cardsContainerRef]);


    return (
        <>
            <form
                className="w-full scroll-hidden h-fit mt-10 md:mt-0 flex text-sm sm:text-base flex-col items-center justify-baseline pt-20 px-10"
                data-cy="studyset_form">
                <div className="flex w-full flex-col items-center justify-center gap-3">
                  <span className="w-full text-2xl sm:text-3xl flex flex-col justify-center items-baseline
                    text-studodarkblue font-bold dark:text-white">
                    {t("title")}
                  </span>

                    <div className="w-full gap-3 sm:gap-4 md:gap-5 flex-col flex">
                        <div className="flex flex-col gap-1">
                            <input
                                type="text"
                                className="w-full h-12 px-5 rounded-full glass-rgb border border-studoborder/30 text-white outline-none"
                                autoComplete="off"
                                placeholder={t("title_placeholder")}
                                data-cy="title_input"
                            />
                            <div className="h-5">
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
                            <div className="w-full sm:w-1/2 gap-1 flex flex-col h-fit">
                                <input
                                    type="text"
                                    autoComplete="off"
                                    placeholder={t("course_placeholder")}
                                    className="w-full h-12 px-5 rounded-full glass-rgb border border-studoborder/30 text-white outline-none"
                                    data-cy="course_input"
                                />
                                <div className="h-5">
                                </div>
                            </div>

                            <div className="w-full sm:w-1/2 gap-1 flex flex-col h-fit">
                                <select
                                    className={"h-12 px-5 gap-5 text-white cursor-pointer w-full rounded-4xl glass-rgb transition-all duration-300 border appearance-none border-studoborder/30 shadow-2xl focus:ring-0 outline-none flex justify-around"}
                                    data-cy="folder_select">
                                    <option value="">{t("folder_placeholder")}</option>
                                </select>

                                <div className="h-5">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="w-full h-fit flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-end items-stretch sm:items-end mt-4">


                        <button
                            type="submit"
                            className="px-10 w-fit flex flex-row items-center shadow-2xl cursor-pointer justify-center gap-2 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold border border-studoborder active:scale-95 transition-transform"
                            data-cy="submit_studyset_top">
                            {isMutating ? t("saving...") : t("create")}
                        </button>
                    </div>


                    <div className="flex w-full mb-6 sm:mb-8 md:mb-10 flex-row justify-end">
                        <button
                            type="submit"
                            className="px-10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-row items-center shadow-2xl cursor-pointer justify-center gap-2 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold border border-studoborder active:scale-95 transition-transform"
                            data-cy="submit_studyset_bottom">
                            {isMutating ? t("saving...") : t("create")}
                        </button>
                    </div>
                </div>

                {showImporter && (
                    <SetImporter
                        onClose={() => setShowImporter(false)} cardArray={[]}
                        setCardArray={function (value: SetStateAction<CardData[]>): void {
                            throw new Error("Function not implemented.");
                        }}                    />
                )}
            </form>
        </>
    )
}