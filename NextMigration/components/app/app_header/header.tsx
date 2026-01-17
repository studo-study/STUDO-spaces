"use client"
import {useLocale, useTranslations} from "next-intl";
import {HiMenuAlt4} from "react-icons/hi";

import TriggerAddPopup from "@/components/app/app_header/add_popup";
import {useEffect, useRef, useState} from "react";
import TriggerNotif from "@/components/app/app_header/notif_popup";
import StreakPopup from "@/components/app/app_header/streak_popup";
import TriggerProfile from "@/components/app/app_header/profile_popup";
import {TbLayoutSidebarLeftCollapse} from "react-icons/tb";
import SearchBar from "@/components/app/app_header/search";
import CreateFolder from "@/components/app/create-folder/create_folder";
import Image from "next/image";

import {useUser} from "@/components/providers/UserProvider";
import {Link} from "@/i18n/routing";

interface user {
    displayName: string;
    email: string;
    id: string;
    img_url: string;
    joinNumber: number;
    join_date: string;
    lastTen: studyset[];
    publicRole:string;
    stats: {
        totalsets: number;
        timeLearned: number;
        cardsLearned: number;
    };
    streak_count: number;
    streak_last_update: string;
    totalSets: number;
    verified: boolean;
}

interface studyset {
    "set_id": string;
    "last_studied": string;
    "title": string;
    "Course": string;
    "type": string;
    "progress": number;
    "length": number
}

interface HeaderProps {
    burgerOpen: boolean;
    setBurgerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    Search: boolean;
    setSearch: React.Dispatch<React.SetStateAction<boolean>>;
    createOpen: boolean;
    setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleCreate: () => void;
}
 export default function AppHeader({burgerOpen, setBurgerOpen, Search, setSearch, createOpen, setCreateOpen, toggleCreate}: HeaderProps) {


     const { user, isLoading } = useUser();
    const [AddIsOpen, setAddIsOpen] = useState(false);
    const [NotifIsOpen, setNotifIsOpen] = useState(false);
    const [ProfileIsOpen, setProfileIsOpen] = useState(false);
    const [StreakOpen, setStreakOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const t = useTranslations("header");

    const toggleBurger = () => {
        setBurgerOpen(!burgerOpen);
    };

    const toggleSearch = () => {
        setSearch(true);
        if (searchRef.current) {
            searchRef.current.focus();
        }
    };



    useEffect(() => {
        if (Search && searchRef.current) {
            searchRef.current.focus();
        }
    }, [Search]);



    return (
        <div className={"h-fit z-[9999] top-0 w-screen flex flex-col"}>
            <div className={"w-screen h-0.5"}></div>
            <div className=" w-screen h-20 flex items-center justify-between px-10 py-2 backdrop-blur-2xl border-b border-studogrey/30 gap-5">
                {/* Left section */}
                <div className="flex items-center gap-8 min-w-1/4">
                    <button
                        onClick={toggleBurger}
                        className="flex items-center justify-center cursor-pointer text-2xl text-white min-w-10 min-h-10 rounded-full border border-studoborder/20 shadow-xl glass-rgb">
                        {burgerOpen ? <TbLayoutSidebarLeftCollapse className={"opacity-30"}/> : <HiMenuAlt4 className={"opacity-30"}/>}
                    </button>
                    <Link href={"/home"} className={`font-akira text-2xl truncate bg-gradient-to-r ${SpecialeDag()} bg-clip-text text-transparent transition-all duration-300`}>
                        STUDO
                    </Link>
                    <Link href={"/select"} className={"hover:scale-105 transition-all duration-300 px-5 py-1 text-sm font-bold shadow-2xl rounded-4xl border-studoborder bg-linear-to-r from-indigo-300 to-white backdrop-blur-2xl text-studodarkblue"}>upgrade to select</Link>

                </div>

                {/*center*/}
                <div className={"w-full h-fit flex justify-end items-center"}>
                    <SearchBar
                        searchRef={searchRef}
                        toggleSearch={toggleSearch}
                        setSearch={setSearch}
                        Search={Search}
                    />
                </div>

                {/* Right section */}
                <div className="flex items-center gap-5 ml-5 justify-end">
                    {/* Add button */}
                    <TriggerAddPopup
                        AddIsOpen={AddIsOpen}
                        setAddIsOpen={setAddIsOpen}
                        toggleCreate={toggleCreate}
                    />

                    {/* Notifications */}
                    <TriggerNotif
                        NotifIsOpen={NotifIsOpen}
                        setNotifIsOpen={setNotifIsOpen}
                    />

                    {/* Profile */}
                    {isLoading ? (
                        <div className="h-10 w-10 rounded-full bg-studogrey/30 animate-pulse" />
                    ) : (
                        <TriggerProfile
                            ProfileIsOpen={ProfileIsOpen}
                            setProfileIsOpen={setProfileIsOpen}
                            user={user}
                        />
                    )}

                    {/* Streak */}
                    <Streak
                        streak={user?.streak_count ?? 0}
                        StreakOpen={StreakOpen}
                        setStreakOpen={setStreakOpen}
                    />
                </div>
               <CreateFolder
                    createOpen={createOpen}
                    setCreateOpen={setCreateOpen}
                />

            </div>
        </div>
    );
}

interface StreakProps {
    streak: number;
    StreakOpen: boolean,
    setStreakOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

function Streak({ streak, StreakOpen, setStreakOpen  }: StreakProps) {
    const config = getStreakConfig(streak);
    const containerRef = useRef(null);
    const togglePopUp = () => {
        setStreakOpen((prev) => !prev);
    };

    return (
        <Link
            href={"/streak"}
            ref={containerRef}
            onMouseEnter={() => setStreakOpen(true)}
            onMouseLeave={() => setStreakOpen(false)}
            className="min-w-20 max-w-20 flex items-center cursor-pointer active:scale-95 transition-all duration-300 justify-center relative">
            {config.glow && (
                <div className="absolute z-0 flex justify-center min-w-20 h-8 blur-lg opacity-40 py-1 px-3 bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 rounded-4xl" />
            )}
                <div className={`${config.glow ? 'z-10 relative' : ''} min-w-fit flex justify-center py-1 px-3 ${config.bg} rounded-4xl gap-2 font-bold text-white items-center`}>
                    <Image
                        src={config.icon}
                        alt=""
                        width={0}
                        height={0}
                        className={`w-5 ${config.saturation}`}
                    />
                    <span className={`w-fit ${config.textColor}`}>{streak}</span>
                </div>
                <StreakPopup
                    Streak={streak}
                    StreakOpen={StreakOpen}
                    setStreakOpen={setStreakOpen}
                    containerRef={containerRef}/>
        </Link>
    );
}

function getStreakConfig(streak: number) {
    if (streak === 0) {
        return {
            bg: 'bg-studogrey/30',
            icon: '/streak/streak-03.svg',
            saturation: 'saturate-0',
            textColor: '',
            glow: false,
        };
    }

    if (streak === 67 || streak === 69 || streak >= 200) {
        return {
            bg: 'bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300',
            icon: '/images/streak/streak-02.svg',
            saturation: 'saturate-100',
            textColor: 'text-studodarkblue',
            glow: streak >= 200,
        };
    }

    if (streak <= 10) {
        return {
            bg: 'bg-studogrey/30',
            icon: '/images/streak/streak-03.svg',
            saturation: 'saturate-50',
            textColor: '',
            glow: false,
        };
    }

    if (streak <= 49) {
        return {
            bg: 'bg-studogrey/30',
            icon: '/images/streak/streak-03.svg',
            saturation: 'saturate-100',
            textColor: '',
            glow: false,
        };
    }

    if (streak <= 99) {
        return {
            bg: 'bg-studogrey/30',
            icon: '/images/streak/streak-02.svg',
            saturation: 'saturate-100',
            textColor: '',
            glow: false,
        };
    }

    return {
        bg: 'bg-gradient-to-r from-amber-300/30 via-amber-600/30 to-yellow-500/30',
        icon: '/images/streak/streak-03.svg',
        saturation: 'saturate-100',
        textColor: '',
        glow: false,
    };
}

function SpecialeDag() {
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

