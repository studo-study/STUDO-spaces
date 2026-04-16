import {useEffect, useRef} from "react";
import {IoIosAdd, IoIosClose} from "react-icons/io";
import {useTranslations} from "next-intl";
import Link from "next/link";

interface TriggerClassroomProps {
    togglePopUp: () => void,
}

export default function TriggerClassroom({togglePopUp}: TriggerClassroomProps) {


    return(
        <button
            type={"button"}
            onClick={togglePopUp}
            className="relative flex z-10 items-center justify-center cursor-pointer active:scale-95 transition-all duration-300">
            <div className="absolute bg-amber-500/50 h-7 w-7 rounded-full blur-sm"/>
            <div
                className="relative z-10 shadow-2xl bg-amber-500 min-h-7 min-w-7 text-xl flex items-center justify-center text-white rounded-full border border-studoborder">
                <IoIosAdd/>
            </div>
        </button>
    )
}


