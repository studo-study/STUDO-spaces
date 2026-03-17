"use client"
import { useEffect, useRef } from "react";
import {Link} from "@/i18n/routing";
import {useTranslations} from "next-intl";
import Image from "next/image";
interface TriggerToolsProps {
    ToolsOpen: boolean;
    setToolsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TriggerTools({ ToolsOpen, setToolsOpen }: TriggerToolsProps) {
        const t = useTranslations('landing.header');
        const containerRef = useRef<HTMLDivElement>(null);

        const togglePopUp = () => {
            setToolsOpen((prev) => !prev);
        };

        return (
            <div
                ref={containerRef}
                className={"relative w-fit min-w-fit h-fit flex flex-row gap-3 cursor-pointer"}
                onClick={togglePopUp}
            >
                <Image
                    width={49}
                    height={49}
                    src={"/icons/down.svg"}
                    className={`${ToolsOpen ? "rotate-180" : ""} transition-all duration-300 dark:brightness-0 dark:invert h-7`}
                    alt="go down icon"
                />
                <span className={"dark:text-white text-studodarkblue truncate"}>{t("tools")}</span>
                <ToolsPopup
                    MethodsOpen={ToolsOpen}
                    setMethodsOpen={setToolsOpen}
                    triggerRef={containerRef}
                />
            </div>
        );
}


const toolCategories = [
    {
        title: "ss",
        color: "emerald",
        items: [
            { to: "/tools/learn", icon: "/icons/pencil.svg", label: "learn", gradient: "from-emerald-400 to-emerald-500" },
            { to: "/tools/speedy", icon: "/icons/clock.svg", label: "speedy", gradient: "from-amber-400 to-orange-500" },
            { to: "/tools/flashcards", icon: "/icons/cards.svg", label: "flashcards", gradient: "from-blue-400 to-blue-500" },
        ],
    },
    {
        title: "vs",
        color: "violet",
        items: [
            { to: "/tools/identify", icon: "/icons/pin-icon.svg", label: "identify", gradient: "from-rose-400 to-red-500" },
            { to: "/tools/point", icon: "/icons/point.svg", label: "point", gradient: "from-violet-400 to-purple-500" },
        ],
    },
];

interface ToolsPopupProps {
    MethodsOpen: boolean;
    setMethodsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    triggerRef: React.RefObject<HTMLDivElement | null>;
}

function ToolsPopup({ MethodsOpen, setMethodsOpen, triggerRef }: ToolsPopupProps) {
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

    let itemIndex = 0;

    return (
        <div
            ref={popupRef}
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-4
        z-[9999] w-64 p-2
        rounded-2xl backdrop-blur-2xl
        bg-white/80 dark:bg-[#1e293b]/90
        glass-rgb
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out origin-top
        ${MethodsOpen
                ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"}
      `}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Categories */}
            <div className="relative flex flex-col gap-2">
                {toolCategories.map((category, catIndex) => (
                    <div key={category.title}>
                        {/* Category Header */}
                        <div
                            className={`flex items-center gap-2 px-3 py-2
                transition-all duration-300
                ${MethodsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
                            style={{ transitionDelay: MethodsOpen ? `${catIndex * 100}ms` : "0ms" }}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full bg-${category.color}-400`} />
                            <span className="text-xs font-semibold uppercase tracking-wider text-studodarkblue/40 dark:text-white/40">
                {t(category.title)}
              </span>
                        </div>

                        {/* Category Items */}
                        <div className="flex flex-col gap-1">
                            {category.items.map((item) => {
                                const currentIndex = itemIndex++;
                                return (
                                    <Link
                                        key={item.to}
                                        href={item.to}
                                        onClick={() => setMethodsOpen(false)}
                                        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                                      text-studodarkblue dark:text-white
                                      hover:bg-studodarkblue/5 dark:hover:bg-white/5
                                        transition-all duration-200 ease-out
                                        ${MethodsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                                        `}
                                        style={{
                                            transitionDelay: MethodsOpen ? `${(currentIndex + 1) * 50 + catIndex * 50}ms` : "0ms",
                                        }}
                                    >
                                        {/* Icon Container */}
                                        <div className={`flex items-center justify-center w-9 h-9 rounded-xl
                      bg-gradient-to-br ${item.gradient}
                      shadow-md shadow-black/10
                      group-hover:scale-110 group-hover:shadow-lg group-hover:-rotate-3
                      transition-all duration-200`}
                                        >
                                            <Image
                                                src={item.icon}
                                                alt={item.label + " icon"}
                                                className="h-4 w-4 brightness-0 invert"
                                                width={16}
                                                height={16}
                                            />
                                        </div>

                                        {/* Label */}
                                        <div className="flex flex-col">
                      <span className="font-medium text-sm group-hover:text-studodarkblue dark:group-hover:text-white transition-colors">
                        {t(item.label)}
                      </span>
                                        </div>

                                        {/* Hover Arrow */}
                                        <svg
                                            className="w-4 h-4 ml-auto text-studodarkblue/30 dark:text-white/30 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>

                                        {/* Hover Background Glow */}
                                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-200`} />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Separator between categories */}
                        {catIndex < toolCategories.length - 1 && (
                            <div className="mx-3 my-2 h-px bg-studodarkblue/10 dark:bg-white/10" />
                        )}
                    </div>
                ))}
            </div>

            {/* Footer hint */}
            <div
                className={`mt-2 pt-2 border-t border-studodarkblue/5 dark:border-white/5
          transition-all duration-300 delay-300
          ${MethodsOpen ? "opacity-100" : "opacity-0"}`}
            >
                <p className="text-[10px] text-center text-studodarkblue/30 dark:text-white/30">
                    {t("select")}
                </p>
            </div>
        </div>
    );
}