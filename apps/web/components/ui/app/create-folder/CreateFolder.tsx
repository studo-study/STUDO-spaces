import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { IoIosClose } from "react-icons/io";
import {useKeyboardShortcut} from "@/hooks/useKeyboardShortcut";
import PopupBackdrop from "@/components/ui/design_system/popup/PopupBackdrop";

interface CreateFolderProps {
    createOpen: boolean;
    setCreateOpen: (open: boolean) => void;
}

export default function CreateFolder({ createOpen, setCreateOpen }: CreateFolderProps) {
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const t = useTranslations("createfolder");
    const [mounted, setMounted] = useState(false);
    useKeyboardShortcut("Escape", () => {
        setCreateOpen(false);
        if(inputRef.current) inputRef.current.value = "";
    }, {always: true});

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!createOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setCreateOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [createOpen, setCreateOpen]);

    useEffect(() => {
        createOpen ? inputRef.current?.focus() : inputRef.current?.blur();
    }, [createOpen]);


    const isOpen = mounted && createOpen;
    const close = () => setCreateOpen(false);

    return (
        <PopupBackdrop
        isOpen={isOpen}
        setIsOpen={setCreateOpen}>
            <div
                ref={popupRef}
                className={`relative w-1/5 p-7 rounded-2xl bg-white/80 dark:bg-[#1e293b] border border-white/50 dark:border-white/10 shadow-xl transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}
            >
                <button onClick={close} className="absolute top-2 right-2 p-1 rounded-full hover:bg-studogrey transition-colors cursor-pointer">
                    <IoIosClose className="text-3xl text-studodarkblue dark:text-white" />
                </button>

                <div className="flex items-center gap-2 mb-5">
                    <img src="/icons/folder.svg" alt="" className="h-5 w-5 brightness-0 dark:invert" />
                    <span className="text-xl font-bold text-studodarkblue dark:text-white">{t("title")}:</span>
                </div>

                <input
                    ref={inputRef}
                    placeholder={t("placeholder")}
                    className="w-full h-12 px-5 mb-5 rounded-full glass-rgb border border-studoborder/30 text-white outline-none"
                />

                <button className="w-full h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 text-white font-bold border border-studoborder active:scale-95 transition-transform">
                    {t("button")}
                </button>
            </div>
        </PopupBackdrop>
    );
}