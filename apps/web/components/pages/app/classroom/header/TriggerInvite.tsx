import {useEffect, useRef} from "react";
import {IoIosAdd, IoIosClose} from "react-icons/io";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {IoPersonAdd} from "react-icons/io5";

interface TriggerClassroomProps {
    togglePopUp: () => void,
}

export default function TriggerInvite({togglePopUp}: TriggerClassroomProps) {
    const t = useTranslations("classroom");

    return(
        <button
            onClick={togglePopUp}
            className={"w-fit px-7 py-2 rounded-full active:scale-95 transition-all duration-300 dark:bg-white cursor-pointer flex items-center gap-3 justify-center"}>
            <IoPersonAdd />
            {t("invite")}
        </button>
    )
}


