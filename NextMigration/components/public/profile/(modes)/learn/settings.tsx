"use client"
import {IoIosSettings} from "react-icons/io";
import {useEffect, useRef, useState} from "react";

export default function SettingsTrigger() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containerRef = useRef(null);

    const toggleOpen = () => setIsOpen(prev => !prev);

    return(
        <div className={"w-full h-fit relative"}>
            <div className={"relative w-full h-20 flex items-center justify-end flex-row"}>
                <div ref={containerRef} onClick={toggleOpen} className={'min-w-12 h-12 dark:text-white cursor-pointer border border-transparent transition-all rounded-full shadow-xl bg-studogrey/30 flex  items-center justify-center hover:border-studogrey'}>
                    <IoIosSettings size={25} className={'active:rotate-180 duration-300 transition-all'}/>
                </div>
            </div>
            <SettingsPopup
                containerRef={containerRef}
                settingsOpen={isOpen}
                setSettingsOpen={setIsOpen}
            />
        </div>
    )
}

interface SettingsPopupProps {
    settingsOpen: boolean,
    setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    containerRef: React.RefObject<HTMLDivElement | null>,
}

function SettingsPopup(props: SettingsPopupProps) {
    const {settingsOpen, setSettingsOpen, containerRef} = props
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setSettingsOpen(false);
            }
        };

        if (settingsOpen) {
            setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [settingsOpen, setSettingsOpen, containerRef]);

    return (   <div
        ref={popupRef}
        className={`absolute top-full right-0 mt-2
        z-[9999] w-56 p-2 truncate
        rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out origin-top
        ${settingsOpen
            ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"}
      `}
        onClick={(e) => e.stopPropagation()}
    >
        <div>
            <div className="checkbox-wrapper-7">
                <input className="tgl tgl-ios" id="cb2-7" type="checkbox"/>
                <label className="tgl-btn" htmlFor="cb2-7"></label>
            </div>
        </div>
    </div>)
}