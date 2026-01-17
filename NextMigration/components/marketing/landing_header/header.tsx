"use client";
import {useEffect, useRef, useState} from "react";
import {Link} from "@/i18n/routing";

import {useLocale, useTranslations} from 'next-intl';
import { FiMenu, FiX } from "react-icons/fi";
import TriggerTools from "@/components/marketing/landing_header/dropdowntools";
import TriggerMethods from "@/components/marketing/landing_header/dropdownmethods";
import Image from "next/image";


const menuItems = [
    { to: "/about-studosets", icon: "/icons/studyset.svg", label: "ss", color: "from-emerald-400 to-teal-500" },
    { to: "/about-visualsets", icon: "icons/visualset.svg", label: "vs", color: "from-blue-400 to-indigo-500" },
    { to: "/about-ai", icon: "/icons/sparkle.svg", label: "ai", color: "from-violet-400 to-purple-500" },
];

const toolCategories = [
    { to: "/learn", icon: "/icons/pencil.svg", label: "learn", gradient: "from-emerald-400 to-emerald-500" },
    { to: "/speedy", icon: "/icons/clock.svg", label: "speedy", gradient: "from-amber-400 to-orange-500" },
    { to: "/flashcards", icon: "/icons/cards.svg", label: "flashcards", gradient: "from-blue-400 to-blue-500" },
    { to: "/identify", icon: "/icons/pin-icon.svg", label: "identify", gradient: "from-rose-400 to-red-500" },
    { to: "/point", icon: "/icons/point.svg", label: "point", gradient: "from-violet-400 to-purple-500" },
];

export default function LandingHeader() {
    const [MethodsOpen, setMethodsOpen] = useState<boolean>(false);
    const [ToolsOpen, setToolsOpen] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const locale = useLocale();



    const popupRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const currentIndex = 0;
    const catIndex = 0;
    const ref = useRef<HTMLDivElement>(null);
    const t = useTranslations("landing.header");
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mobileMenuOpen, setMobileMenuOpen]);

    return (<>
        <header
            className={`w-screen h-20 md:h-20 fixed top-0 left-0 right-0 z-[999] border-b border-transparent transition-all duration-300
      bg-transparent ${scrolled ? "backdrop-blur-2xl border-b border-studoborder" : null}
      flex items-center justify-between px-4 sm:px-8 lg:px-20`}
        >
            <div className="flex items-center justify-start gap-6 md:gap-10 flex-1">
                <Link
                    href={`/welcome`}
                    className="group relative font-akira text-3xl md:text-4xl whitespace-nowrap"
                >
          <span className={`relative z-10 bg-gradient-to-r ${specialeDag()} bg-clip-text text-transparent transition-all duration-300`}>
            STUDO
          </span>

                </Link>

                <nav className="hidden md:flex flex-row gap-10 items-center">
                    <TriggerMethods MethodsOpen={MethodsOpen} setMethodsOpen={setMethodsOpen} />
                    <TriggerTools ToolsOpen={ToolsOpen} setToolsOpen={setToolsOpen} />
                </nav>
            </div>

            <div className="flex items-center justify-end gap-4 md:gap-5 flex-1">
                <div className="hidden md:flex items-center gap-5">
                    <Link
                        href={"/login"}
                        className="inline-flex font-semibold text-white
            flex-row gap-2 justify-center items-center p-2 pl-7 pr-7 rounded-4xl cursor-pointer
            active:scale-105 transition-transform z-[2]
            border-[0.5px] border-solid border-[#8181812f]
            shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
            dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
            bg-emerald-400 dark:bg-white dark:text-studodarkblue"
                    >
                        {t("LogIn")}
                    </Link>
                    <Link
                        href={"/register"}
                        className="font-semibold text-studodarkblue dark:text-white hover:underline"
                    >
                        {t("CreateAccount")}
                    </Link>
                </div>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-studodarkblue dark:text-white p-2"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                </button>
            </div>


        </header>
        {(
            <div className={`fixed inset-0 z-[99999] flex flex-col justify-end md:hidden
					bg-black/50 transition-opacity duration-300
					${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
				  `}
            >
                <div ref={popupRef} className={` ${mobileMenuOpen
                    ? "translate-y-0 sm:translate-y-0 opacity-100 visible pointer-events-auto"
                    : "translate-y-full sm:translate-y-0 opacity-0 invisible pointer-events-none"}
						transition-all duration-500 ease-out origin-bottom
					h-3/4w-screen z-50 bg-white dark:bg-[#182536] rounded-tl-4xl rounded-tr-4xl md:hidden flex flex-col
					border-t border-l border-r border-studoborder`}>
                    <div className={"flex flex-col gap-8 p-7 w-full h-fit"}>
                        <div className={"flex flex-col gap-3"}>
                            <span className={"font-bold dark:text-white"}>{t("lm")}:</span>
                            <div className={"w-full h-fit grid grid-cols-2 gap-3"}>
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={item.to}
                                        href={item.to}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
												  text-studodarkblue dark:text-white
												  bg-studodarkblue/5 dark:bg-white/5
												  transition-all duration-200 ease-out
												  ${mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                    `}
                                        style={{
                                            transitionDelay: MethodsOpen ? `${(currentIndex + 1) * 50 + catIndex * 50}ms` : "0ms",
                                        }}
                                    >
                                        {/* Icon Container */}
                                        <div className={`flex items-center justify-center min-w-9 h-9 rounded-xl
												bg-gradient-to-br ${item.color}
												shadow-md shadow-black/10 overflow-hidden
												transition-all duration-200`}
                                        >
                                            <Image src={item.icon} alt={item.label + " icon"} width={12} height={12} className="h-3 w-3 brightness-0 invert"/>
                                        </div>

                                        {/* Label */}
                                        <span className="font-medium text-sm">
											  {t(item.label)}
											</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className={"flex flex-col gap-3"}>
                            <span className={"font-bold dark:text-white"}>{t("st")}:</span>
                            <div className={"w-full h-fit grid grid-cols-2 gap-3 "}>
                                {toolCategories.map((item) => {
                                    return (
                                        <Link
                                            key={item.to}
                                            href={item.to}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
												  text-studodarkblue dark:text-white max-h-15
												  bg-studodarkblue/5 dark:bg-white/5 overflow-hidden
												  transition-all duration-200 ease-out
												  ${mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                    `}
                                            style={{
                                                transitionDelay: MethodsOpen ? `${(currentIndex + 1) * 50 + catIndex * 50}ms` : "0ms",
                                            }}
                                        >
                                            {/* Icon Container */}
                                            <div className={`flex items-center justify-center min-w-9 min-h-9 rounded-xl
													  bg-gradient-to-br ${item.gradient}
													  shadow-md shadow-black/10 overflow-hidden
													  transition-all duration-200`}
                                            >
                                                <Image
                                                    src={item.icon}
                                                    alt={item.label + " icon"}
                                                    width={16}
                                                    height={16}
                                                    className="h-4 w-4 brightness-0 invert"
                                                />
                                            </div>

                                            {/* Label */}
                                            <div className="flex flex-col">
													  <span className="font-medium w-full truncate overflow-hidden text-sm group-hover:text-studodarkblue dark:group-hover:text-white transition-colors">
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
                                })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pt-10 pb-8 flex flex-col gap-4">
                        <Link
                            href={"/login"}
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full inline-flex font-semibold text-white justify-center items-center py-4 rounded-4xl cursor-pointer
				  active:scale-105 transition-transform
				  border-[0.5px] border-solid border-[#8181812f]
				  shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
				  dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
				  bg-emerald-400 dark:bg-white dark:text-studodarkblue"
                        >
                            {t("LogIn")}
                        </Link>
                        <Link
                            href={"/register"}
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full text-center font-semibold text-studodarkblue dark:text-white py-4 hover:underline"
                        >
                            {t("CreateAccount")}
                        </Link>
                    </div>
                </div>
            </div>
        )}
      </>
    )
}



function specialeDag() {
    const date: Date = new Date();
    const dag = date.getDate();
    const maand = date.getMonth();
    const jaar = date.getFullYear();
    const locale = useLocale();
    const feestdagen = {
        christmas: "from-rose-600 via-rose-500 to-rose-400 dark:from-white dark:to-rose-200",
        christmasDay: "from-red-600 via-red-500 to-red-400 dark:from-white dark:to-red-200",
        newYear: "from-yellow-700 via-amber-500 to-yellow-400 dark:from-white dark:to-amber-200",
        threeKings: "from-amber-600 via-amber-500 to-yellow-500 dark:from-white dark:to-yellow-200",
        labour: "from-red-600 via-red-500 to-red-400 dark:from-white dark:to-red-200",
        valentine: "from-pink-600 via-pink-500 to-pink-400 dark:from-white dark:to-pink-200",
        halloween: "from-orange-600 via-orange-500 to-orange-400 dark:from-white dark:to-orange-200",
        easter: "from-violet-500 via-violet-400 to-purple-400 dark:from-white dark:to-violet-200",
        stPatricks: "from-green-600 via-green-500 to-green-400 dark:from-white dark:to-green-200",
        mothersDay: "from-pink-500 via-pink-400 to-rose-400 dark:from-white dark:to-pink-200",
        fathersDay: "from-sky-600 via-sky-500 to-sky-400 dark:from-white dark:to-sky-200",
        carnival: "from-fuchsia-600 via-fuchsia-500 to-fuchsia-400 dark:from-white dark:to-fuchsia-200",
        kingsDay: "from-orange-500 via-orange-400 to-amber-400 dark:from-white dark:to-orange-200",
        midsummer: "from-blue-400 via-green-300 to-amber-300 dark:from-white dark:to-sky-200",
        belgie: "from-zinc-900 via-amber-300 to-rose-700 dark:from-zinc-900 dark:via-amber-400 dark:to-rose-600",
        vs: "from-blue-600 to-red-700 dark:from-blue-600 dark:to-red-400",
        nederland: "from-orange-400 via-amber-500 to-orange-300 dark:from-orange-400 dark:via-amber-500 dark:to-orange-300",
    };

    const pasen = berekenPasen(jaar);
    const pasenDatum = new Date(jaar, pasen.maand - 1, pasen.dag);

    const carnaval = new Date(pasenDatum);
    carnaval.setDate(carnaval.getDate() - 49);

    if (dag === pasen.dag && maand === pasen.maand - 1) {
        return feestdagen.easter;
    }
    if (dag === carnaval.getDate() && maand === carnaval.getMonth()) {
        return feestdagen.carnival;
    }

    // Vaste feestdagen
    const key: string = `${dag}/${maand}`;
    const vasteDagen: Record<string, string>
        = {
        "1/0": feestdagen.newYear,
        "6/0": feestdagen.threeKings,
        "14/1": feestdagen.valentine,
        "17/2": feestdagen.stPatricks,
        "1/4": feestdagen.labour,
        "21/5": feestdagen.midsummer,
        "31/9": feestdagen.halloween,
        "24/11": feestdagen.christmas,
        "25/11": feestdagen.christmasDay,
        "31/11": feestdagen.newYear,
    };
    if(locale === "nl" && key === "21/6") {
        return feestdagen.belgie;
    }

    if(locale === "nl" && key === "27/3") {
        return feestdagen.belgie;
    }


    return vasteDagen[key] || "from-emerald-500 to-emerald-400 dark:from-white dark:to-blue-200";
}

function berekenPasen(jaar: number) {
    const a = jaar % 19;
    const b = Math.floor(jaar / 100);
    const c = jaar % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);

    const maand = Math.floor((h + l - 7 * m + 114) / 31);
    const dag = ((h + l - 7 * m + 114) % 31) + 1;

    return { dag, maand };
}

