"use client"
import {IoIosAdd} from "react-icons/io";
import {useAppLayout} from "@/components/context/AppLayoutContext";


export default function FolderTopBar() {
    const { toggleCreate } = useAppLayout();
    return (
        <div className="w-full h-full flex flex-col gap-5 scroll-hidden">
            <div className={"w-full h-20 z-20bg-gray-800 py-8 flex flex-row justify-end gap-3"}>
                <button
                    onClick={toggleCreate}
                    className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300">
                    <div className="absolute bg-purple-500/50 h-8 w-8 rounded-full blur-sm"/>
                    <div
                        className="relative z-10 shadow-2xl bg-purple-500 h-8 min-w-8 text-3xl flex items-center justify-center text-white rounded-full border border-studoborder">
                        <IoIosAdd/>
                    </div>
                </button>
            </div>
        </div>
    )
}