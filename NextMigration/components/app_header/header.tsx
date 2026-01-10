import {useLocale} from "next-intl";
import {HiMenuAlt4} from "react-icons/hi";
import {LuUser} from "react-icons/lu";
import {IoIosAdd, IoMdNotificationsOutline} from "react-icons/io";
import {PiStudent} from "react-icons/pi";
import {IoSearch} from "react-icons/io5";

export default function AppHeader() {
    return (
        <div className={"h-fit fixed top-0 w-screen flex flex-col "}>
            <div className={"w-screen h-0.5"}></div>
            <div className=" w-screen h-20 flex items-center justify-between px-10 py-2 backdrop-blur-2xl border-b border-studogrey/30 gap-5">
                {/* Left section */}
                <div className="flex items-center gap-8 min-w-1/4">
                    <button
                        className="flex items-center justify-center cursor-pointer text-2xl text-white/30 min-w-10 min-h-10 rounded-full border border-studoborder/20 shadow-xl glass-rgb">
                        <HiMenuAlt4/>
                    </button>
                    <span className={`font-akira text-2xl truncate bg-gradient-to-r ${specialeDag()} bg-clip-text text-transparent transition-all duration-300`}>
                        STUDO
                    </span>

                </div>

                {/*center*/}
                <div className={"w-full h-fit flex justify-end items-center"}>
                    <div className={"h-10 gap-5 text-white w-1/3 rounded-4xl glass-rgb border-studoborder/30 border focus:border-white shadow-2xl flex justify-around"}>
                        <input placeholder={"search..."} type="text" className={" w-full h-full outline-none focus:ring-0"}/>
                        <button className={"w-fit cursor-pointer"}>
                            <IoSearch />
                        </button>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-5 ml-5 justify-end">
                    {/* Add button */}
                    <button className="relative flex items-center justify-center cursor-pointer">
                        <div className="absolute bg-blue-500/50 h-10 w-10 rounded-full blur-sm"/>
                        <div
                            className="relative z-10 shadow-2xl bg-blue-500 h-10 min-w-10 text-3xl flex items-center justify-center text-white rounded-full border border-studoborder">
                            <IoIosAdd/>
                        </div>
                    </button>

                    {/* Notifications */}
                    <button className="relative flex items-center justify-center cursor-pointer">
                        <div
                            className="flex items-center justify-center text-2xl text-white/30 min-w-10 min-h-10 rounded-full border border-studoborder/20 shadow-xl glass-rgb">
                            <IoMdNotificationsOutline/>
                        </div>
                        <div
                            className="absolute top-0.5 right-0.5 rounded-full border-studoborder border bg-rose-500 w-2 h-2"/>
                    </button>

                    {/* Profile */}
                    <button className="relative flex items-center justify-center cursor-pointer">
                        <div className="absolute bg-emerald-500/50 h-10 w-10 rounded-full blur-sm"/>
                        <div
                            className="relative z-10 shadow-2xl bg-emerald-600 h-10 w-10 text-xl flex items-center justify-center text-white rounded-full border border-studoborder">
                            <PiStudent/>
                        </div>

                    </button>
                    <div className={"flex justify-center min-w-fit py-1 px-3 bg-studogrey/30 rounded-4xl gap-2 text-bold font-bold text-white items-center"}>
                        <img src="/icons/streak2.svg" alt="" className={"w-5 saturate-100"} />
                        <span className={"w-fit"}>100</span>
                    </div>
                </div>
            </div>
        </div>
    );
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

