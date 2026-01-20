import {useEffect, useRef} from "react";
import {IoIosAdd, IoIosClose} from "react-icons/io";
import {useTranslations} from "next-intl";
import Link from "next/link";

interface TriggerClassroomProps {
    ClassroomIsOpen: boolean,
    setClassroomIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    toggleClassroom: () => void,
}
export default function TriggerClassroom({ClassroomIsOpen, setClassroomIsOpen, toggleClassroom}: TriggerClassroomProps) {
    const containerRef = useRef(null);
    const togglePopUp = () => {
        setClassroomIsOpen((prev) => !prev);
    };

    return(
        <button
            onClick={togglePopUp}
            ref={containerRef}
            className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300">
            <div className="absolute bg-blue-500/50 h-7 w-7 rounded-full blur-sm"/>
            <div
                className="relative z-10 shadow-2xl bg-blue-500 min-h-7 min-w-7 text-xl flex items-center justify-center text-white rounded-full border border-studoborder">
                <IoIosAdd/>
            </div>
            <CreateClassroom
                createOpen={ClassroomIsOpen}
                setCreateOpen={setClassroomIsOpen}
            />
        </button>
    )
}

interface CreateClassroomProps {
    createOpen: boolean;
    setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function CreateClassroom({createOpen, setCreateOpen}: CreateClassroomProps) {
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const t = useTranslations("createfolder")
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node)
            ) {
                setCreateOpen(false);
            }
        };

        if (createOpen) {
            setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [createOpen, setCreateOpen, popupRef]);


    useEffect(() => {
        if (createOpen) {
            inputRef.current?.focus();
        } else {
            inputRef.current?.blur();
        }
    }, [createOpen]);

    return (
        <div className={`fixed z-[9999] -top-1 left-0 w-screen h-screen bg-black/30 
  flex items-baseline justify-center pt-50
  transition-opacity duration-300 ease-out
  ${createOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"}`}
        >
            <div
                ref={popupRef}
                className={`w-1/4 min-h-200
                      z-[9999] p-2 truncate
        rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
      transition-all duration-300 ease-out origin-top px-7 py-10 flex flex-col gap-3 justify-between items-center
      ${createOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-5" +
                    "" +
                    ""}`}
            >
                <div className={"w-full flex px-2 py-2 dark:text-white text-4xl text-studodarkblue items-center justify-end absolute top-0 left-0 z-10"}>
                    <div className={"h-8 w-8 rounded-full hover:bg-studogrey transition-all duration-300 justify-center items-center cursor-pointer active:scale-95 flex"}>
                        <IoIosClose  onClick={() => {setCreateOpen(false)}}/>
                    </div>
                </div>
                <div className={"w-full h-fit flex flex-col gap-5"}>
                    <div className="flex items-center justify-baseline px-2">

                        <img
                            src={"/icons/folder.svg"}
                            alt=""
                            className="h-5 w-5 brightness-0 invert"
                        />
                        <span className="w-full text-lg select-none sm:text-xl md:text-2xl px-2 sm:px-5 font-bold text-studodarkblue dark:text-white">
                            {t("title")}:
                        </span>

                    </div>


                    <div className="flex flex-col w-full gap-2 items-center justify-between">
                        <input
                            ref={inputRef}
                            placeholder={t("placeholder")}
                            type="text"
                            autoFocus={createOpen}
                            className={"h-12 px-5 gap-5 text-white w-full rounded-4xl glass-rgb transition-all duration-300 border border-studoborder/30 shadow-2xl focus:ring-0 outline-none flex justify-around"}/>
                    </div>
                </div>
                <button type="submit" className="bg-gradient-to-br from-violet-400 to-purple-500 w-full cursor-pointer h-12 text-xl text-white border-studoborder border
                    rounded-4xl font-bold active:scale-95 transition-all duration-300 shadow-3xl">
                    {t("button")}
                </button>
            </div>
        </div>
    );
}