"use client";
import {useEffect, useState} from "react";
import Link from "next/link";
import {useTranslations} from "next-intl";

export default function LandingHeader() {
    const [scrolled, setScrolled] = useState(false);
    const t = useTranslations('landing');
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`w-screen h-20 md:h-20 fixed top-0 left-0 right-0 z-[999] border-b border-transparent transition-all duration-300
      bg-transparent ${scrolled ? "backdrop-blur-2xl border-b border-studoborder" : null}
      flex items-center justify-between px-4 sm:px-8 lg:px-20`}
        >
            <div className="flex items-center justify-start gap-6 md:gap-10 flex-1">
                <Link
                    href="/"
                    className="group relative font-akira text-3xl md:text-4xl whitespace-nowrap"
                >
          <span className={`relative z-10 bg-gradient-to-r ${specialeDag()} bg-clip-text text-transparent transition-all duration-300`}>
            STUDO
          </span>

                </Link>

                <nav className="hidden md:flex flex-row gap-10 items-center">
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

                    className="md:hidden text-studodarkblue dark:text-white p-2"
                    aria-label="Toggle menu"
                >

                </button>
            </div>


        </header>
    )
}



function specialeDag() {
    const date: Date = new Date();
    const dag = date.getDate();
    const maand = date.getMonth();
    const jaar = date.getFullYear();

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

