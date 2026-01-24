"use client"
import {BsGridFill} from "react-icons/bs";
import {HiOutlineViewList} from "react-icons/hi";
import {useState} from "react";
import {useTranslations} from "next-intl";
import {BiSort} from "react-icons/bi";
import {CgSortAz} from "react-icons/cg";

export default function Grid() {
    const [grid, setGrid] = useState<boolean>(true);
    const t = useTranslations("y_f.your_sets");
    return (
        <div className="w-full h-full flex flex-col gap-5 scroll-hidden">
        <div className={"w-full h-20 py-5 flex flex-row justify-end gap-3"}>
            <div className={"w-fit flex flex-row gap-5"}>
                <button
                    onClick={() => setGrid(!grid)}
                    className={`${grid ? "border-white text-white bg-studogrey" : "border-studogrey text-studogrey"} cursor-pointer w-8 h-8 rounded-lg border border-studogrey text-studogrey text-lg flex items-center justify-center`}
                >
                    <BsGridFill />
                </button>
                <button
                    onClick={() => setGrid(!grid)}
                    className={`${grid ? "border-studogrey text-studogrey" : "border-white text-white bg-studogrey"} cursor-pointer w-8 h-8 rounded-lg border border-studogrey text-studogrey text-lg flex items-center justify-center`}
                >
                    <HiOutlineViewList />
                </button>
            </div>

        </div>
        <div
            className={`flex-1 overflow-y-scroll scroll-hidden ${
                grid ? "grid grid-cols-4 gap-3 gap-y-3" : "flex flex-col gap-5"
            }`}
        >
            <div className={`${grid ? "h-45 w-full" : "min-h-30 w-full"} bg-rose-500`}/>
            <div className={`${grid ? "h-45 w-full" : "min-h-30 w-full"} bg-rose-500`}/>
            <div className={`${grid ? "h-45 w-full" : "min-h-30 w-full"} bg-rose-500`}/>
            <div className={`${grid ? "h-45 w-full" : "min-h-30 w-full"} bg-rose-500`}/>
            <div className={`${grid ? "h-45 w-full" : "min-h-30 w-full"} bg-rose-500`}/>
            <div className={`${grid ? "h-45 w-full" : "min-h-30 w-full"} bg-rose-500`}/>
            <div className={`${grid ? "h-45 w-full" : "min-h-30 w-full"} bg-rose-500`}/>
            <div className={`${grid ? "h-45 w-full" : "min-h-30 w-full"} bg-rose-500`}/>
            <div className={`${grid ? "h-45 w-full" : "min-h-30 w-full"} bg-rose-500`}/>
            <div className={`${grid ? "h-45 w-full" : "min-h-30 w-full"} bg-rose-500`}/>
            <div className={`${grid ? "h-45 w-full" : "min-h-30 w-full"} bg-rose-500`}/>
        </div>
    </div>);
}