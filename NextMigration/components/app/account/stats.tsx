import {useTranslations} from "next-intl";

export default function Stats() {
    const t = useTranslations("account.stats");
    return(<div className={"w-full flex flex-col gap-5"}>
        <span className={"font-bold text-lg dark:text-white text-studodarkblue"}>{t("subtitle_stats")}:</span>
        <div className={"w-full flex flex-row gap-5"}>
            <div className={"w-1/3 border border-studoborder/30 h-20 rounded-3xl bg-gray-700 px-10 py-5 flex items-center justify-center dark:text-white textstudodarkblue font-bold"}>
                <span>{t("total_cards")}:</span>
            </div>

            <div className={"w-1/3 border border-studoborder/30 h-20 rounded-3xl bg-gray-700 px-10 py-5 flex items-center justify-center dark:text-white textstudodarkblue font-bold"}>
                <span>{t("time_studied")}:</span>
            </div>

            <div className={"w-1/3 border border-studoborder/30 h-20 rounded-3xl bg-gray-700 px-10 py-5 flex items-center justify-center dark:text-white textstudodarkblue font-bold"}>
                <span>{t("cards_mastered")}:</span>
            </div>
        </div>
    </div>)
}