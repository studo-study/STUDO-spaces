"use client"
import {useEffect, useRef} from "react";
import Link from "next/link";
import {useTranslations} from "next-intl";

interface TriggerMethodsProps {
    MethodsOpen: boolean,
    setMethodsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}
export default function TriggerMethods({ MethodsOpen, setMethodsOpen }: TriggerMethodsProps) {
    const containerRef = useRef(null);

    const togglePopUp = () => {
        setMethodsOpen((prev) => !prev);
    };

    const t = useTranslations('landing.header');

    return (
        <div
            ref={containerRef}
            className={"relative w-fit h-fit flex flex-row gap-3 cursor-pointer"}
            onClick={togglePopUp}
        >
            <img
                src={"/icons/down.svg"}
                className={`${MethodsOpen ? "rotate-180" : ""} transition-all duration-300 dark:brightness-0 dark:invert h-7`}
                alt=""
            />
            <span className={"dark:text-white text-studodarkblue truncate"}>{t("modes")}</span>
            <MethodsPopUp
                MethodsOpen={MethodsOpen}
                setMethodsOpen={setMethodsOpen}
                triggerRef={containerRef}
            />
        </div>
    );
}


const menuItems = [
    { to: "/modes/studosets", icon: "/icons/studyset.svg", label: "ss", color: "from-emerald-400 to-teal-500" },
    { to: "/modes/visualsets", icon: "/icons/visualset.svg", label: "vs", color: "from-blue-400 to-indigo-500" },
    { to: "/modes/ai", icon: "/icons/sparkle.svg", label: "ai", color: "from-violet-400 to-purple-500" },
];

interface MethodsPopUpProps {
    MethodsOpen: boolean;
    setMethodsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    triggerRef: React.RefObject<HTMLDivElement | null>;
}
function MethodsPopUp({ MethodsOpen, setMethodsOpen, triggerRef }: MethodsPopUpProps) {
    const t = useTranslations('landing.header');
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setMethodsOpen(false);
            }
        };

        if (MethodsOpen) {
            setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [MethodsOpen, setMethodsOpen, triggerRef]);

    return (
        <div
            ref={popupRef}
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-4
        z-[9999] w-56 p-2 truncate
        rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out origin-top
        ${MethodsOpen
                ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"}
      `}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Arrow */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45
        bg-white/80 dark:bg-[#1e293b]/90  backdrop-blur-xl
        border-l border-t border-white/50 dark:border-white/10"
            />

            {/* Menu Items */}
            <div className="relative flex flex-col gap-1">
                {menuItems.map((item, index) => (
                    <Link
                        key={item.to}
                        href={item.to}
                        onClick={() => setMethodsOpen(false)}
                        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl
              text-studodarkblue dark:text-white
              hover:bg-gradient-to-r hover:${item.color} hover:text-white
              transition-all duration-200 ease-out
              ${MethodsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
            `}
                        style={{
                            transitionDelay: MethodsOpen ? `${index * 50}ms` : "0ms",
                        }}
                    >
                        {/* Icon Container */}
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg
              bg-gradient-to-br ${item.color}
              shadow-md shadow-black/10
              group-hover:scale-110 group-hover:shadow-lg
              transition-all duration-200`}
                        >
                            <img
                                src={item.icon}
                                alt=""
                                className="h-4 w-4 brightness-0 invert"
                            />
                        </div>

                        {/* Label */}
                        <span className="font-medium text-sm">
              {t(item.label)}
            </span>

                        {/* Hover Arrow */}
                        <svg
                            className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ))}
            </div>
        </div>
    );
}