"use client"
import {useTranslations} from "next-intl";
import {HiLightningBolt} from "react-icons/hi";

export default function ChallengeGrid() {
    const t = useTranslations("classroom.challenges")
    return(<div className={"w-full h-full flex flex-col gap-3 overflow-y-auto pt-5"}>
        <div className={"w-full h-full grid grid-cols-6 grid-rows-5 gap-5"}>
            <div className={"w-full h-full rounded-2xl row-start-1 col-start-1 row-end-2 col-end-7"}>
                <span className={"text-studodarkblue dark:text-white flex items-center gap-2 font-bold"}>
                    <HiLightningBolt />
                    {t("running")}:
                </span>
                <div className={"w-full h-25 grid grid-cols-5 gap-5 py-3"}>
                    <ChallengeItem/>
                    <ChallengeItem/>
                    <ChallengeItem/>
                    <ChallengeItem/>
                    <ChallengeItem/>
                </div>
            </div>
            <div className={"w-full h-full rounded-2xl bg-studogrey/30 border-studoborder/10 border row-start-2 col-start-1 row-end-6 col-end-3"}></div>
            <div className={"w-full h-full rounded-2xl bg-studogrey/30 border-studoborder/10 border row-start-2 col-start-3 row-end-6 col-end-5"}></div>
            <div className={"w-full h-full rounded-2xl p-5 bg-studogrey/30 border-studoborder/10 border row-start-2 col-start-5 row-end-6 col-end-7"}>
                <span className={"text-studodarkblue dark:text-white font-bold"}>
                    {t("current_leaderboard")}:
                </span>
            </div>
        </div>
    </div>)
}

function ChallengeItem() {
    return (<div className={"w-full h-20 rounded-3xl bg-studogrey/10 flex items-center justify-center border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 shadow-2xl"}>
        <span>challenge</span>
    </div>)
}