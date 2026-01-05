"use client";

import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaArrowDownLong, FaArrowRightLong } from "react-icons/fa6";
import learn from "@/public/icons/start/learn.svg";
import flash from "@/public/icons/start/flashcards.svg";
import speedy from "@/public/icons/start/speedy.svg";
import pin from "@/public/icons/start/point.svg";
import point from "@/public/icons/start/hero-pin.svg";
import {useTranslations} from "next-intl";
import Link from "next/link";
import Image from "next/image";

const studyModes = [
    { to: "/learn", label: "Learn", icon: learn, color: "from-emerald-500 to-emerald-400", shadow: "shadow-emerald-500/30" },
    { to: "/flashcards", label: "Flashcards", icon: flash, color: "from-blue-500 to-blue-400", shadow: "shadow-blue-500/30" },
    { to: "/speedy", label: "Speedy", icon: speedy, color: "from-amber-500 to-orange-400", shadow: "shadow-amber-500/30" },
    { to: "/pin", label: "Identify", icon: pin, color: "from-rose-500 to-red-400", shadow: "shadow-rose-500/30" },
    { to: "/point", label: "Point", icon: point, color: "from-violet-500 to-purple-400", shadow: "shadow-violet-500/30" },
];

export default function Hero() {
    const t = useTranslations('landing');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const features = [
        t("CreateCustom"),
        t("TextVisualLearning"),
        t("AnywhereAnytime")
    ];

    return (
        <header
            role="banner"
            aria-label={t("HeroSection")}
            className="relative w-full max-w-screen overflow-visible h-fit xxl:h-3/4 flex flex-col items-center justify-start pt-8 px-4"
        >
            {/* Background - decorative, hidden from screen readers */}
            <div
                className="absolute max-w-screen w-full inset-0 hidden dark:flex select-none pointer-events-none z-0"
                aria-hidden="true"
            >
            </div>

            <div className="relative z-10 flex flex-col 3xl:min-h-screen items-center text-center pt-5 3xl:pt-20 overflow-visible gap-8 3xl:w-2/3 max-w-screen">

                {/* Badge */}
                <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full 
            bg-emerald-400/20 dark:bg-studoblue/20 
            border border-emerald-400 dark:border-studoblue/30
            transition-all duration-700 delay-100
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
                >
          <span className="text-sm font-medium text-emerald-400 dark:text-studoblue">
            {t("NewStudyTool")}
          </span>
                </div>

                {/* Main heading */}
                <h1
                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight
            transition-all duration-700 delay-200
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
                >
          <span className="block text-studodarkblue dark:text-white">
            {t("Quote1")}
          </span>
                    <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 dark:from-studoblue dark:via-blue-400 dark:to-studoblue bg-clip-text text-transparent">
            {t("Quote2")}
          </span>
                </h1>

                {/* Subheading */}
                <p
                    className={`text-lg text-xl md:text-2xl text-studodarkblue/70 dark:text-white/70 max-w-2xl
            transition-all duration-700 delay-300
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
                >
                    {t("Subtitle")}
                </p>

                {/* Feature list */}
                <ul
                    className={`flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-sm sm:text-base text-studodarkblue/60 dark:text-white/60
            transition-all duration-700 delay-400 list-none
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
                    aria-label={t("KeyFeatures")}
                >
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-emerald-500 dark:text-studoblue">
                            <FaCheck aria-hidden="true" />
                            <span className="text-studodarkblue/60 dark:text-white/60">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA buttons */}
                <nav
                    className={`grid grid-cols-1 md:grid-cols-2 grid-rows-1 gap-4 md:mt-6 md:w-full max-w-150
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
            transition-all duration-700 delay-500`}
                    aria-label={t("CTA")}
                >
                    <Link href="/register"
                        className="px-8 py-4 text-lg flex flex-row items-center justify-center gap-2 font-bold text-white bg-emerald-400 dark:bg-studoblue rounded-full border-2 border-emerald-400 dark:border-studoblue hover:bg-emerald-500 dark:hover:bg-studoblue/90 transition"
                    >
                        {t("SignUp")}
                        <FaArrowRightLong aria-hidden="true" />
                    </Link>

                    <Link
                        href="/welcome#info"
                        className="px-8 py-4 text-lg flex flex-row items-center justify-center gap-2 font-bold text-emerald-400 dark:text-studoblue rounded-full border-2 border-emerald-400 dark:border-studoblue bg-transparent hover:bg-emerald-400/10 dark:hover:bg-studoblue/10 transition backdrop-blur-sm"
                    >
                        {t("LearnMore")}
                        <FaArrowDownLong aria-hidden="true" />
                    </Link>
                </nav>

                {/* Study modes grid */}
                <nav
                    className={`flex flex-wrap justify-center gap-5 mt-12 w-full px-4 sm:px-3 md:px-0
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
            transition-all duration-700`}
                    aria-label={t("Methods")}
                >
                    {studyModes.map((item, index) => (
                        <Link
                            key={index}
                            href={item.to}
                            style={{ transitionDelay: `${index * 200}ms` }}
                            className={`
                group relative overflow-hidden rounded-3xl
                bg-gradient-to-br ${item.color}
                ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                transition-all duration-700
                flex flex-col justify-between 
                w-full h-full sm:w-48 sm:h-64 md:w-52 md:h-72 lg:w-56 lg:h-80
                hover:scale-105
              `}
                            aria-label={t("LearnMoreAbout", { mode: item.label })}
                        >
              <span className="text-xl sm:text-2xl md:text-2xl font-bold text-studodarkblue text-center pt-5 sm:pt-6">
                {t(item.label)}
              </span>
                            <Image
                                src={item.icon}
                                alt=""
                                aria-hidden="true"
                                className="w-full object-cover object-bottom"
                            />
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}