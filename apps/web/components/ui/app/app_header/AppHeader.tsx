// components/app/app_header/header.tsx
"use client";
import { useLocale } from "next-intl";
import { HiMenuAlt4 } from "react-icons/hi";
import TriggerAddPopup from "@/components/ui/app/app_header/popups/AddPopup";
import { useEffect, useRef, useState } from "react";
import TriggerNotif from "@/components/ui/app/app_header/popups/NotificationsPopup";
import StreakPopup from "@/components/ui/app/app_header/StreakPopup";
import TriggerProfile from "@/components/ui/app/app_header/popups/ProfilePopup";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { FaArrowRight } from "react-icons/fa";
import { StudoUser } from "@/types/types";
import { useAppStore } from "@/store/useAppStore";
import AppSearchbar from "@/components/ui/app/search/SearchBar";
import OnlineScanner from "@/components/ui/app/app_header/SocialSection";

interface HeaderProps {
  burgerOpen: boolean;
  Search: boolean;
  setSearch: React.Dispatch<React.SetStateAction<boolean>>;
  createOpen: boolean;
  setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCreate: () => void;
  user: StudoUser | null; // <- nieuw
  isLoading: boolean; // <- nieuw
}

export default function AppHeader({
  burgerOpen,
  Search,
  toggleCreate,
  user,
  isLoading,
}: HeaderProps) {
  const [AddIsOpen, setAddIsOpen] = useState(false);
  const [NotifIsOpen, setNotifIsOpen] = useState(false);
  const [ProfileIsOpen, setProfileIsOpen] = useState(false);
  const [StreakOpen, setStreakOpen] = useState(false);
  const openbrein = process.env.NEXT_PUBLIC_OPENBREIN === "true";
  const beta = process.env.NEXT_PUBLIC_BETA === "true";
  const searchRef = useRef<HTMLInputElement>(null);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const premium = false;

  useEffect(() => {
    if (Search && searchRef.current) {
      searchRef.current.focus();
    }
  }, [Search]);

  return (
    <div
      className={
        "h-fit z-[9999] top-0 w-screen flex flex-col dark:border-none border-b border-b-studoborder/30"
      }
    >
      <div className={"w-screen h-0.5"}></div>
      {openbrein && (
        <div
          className={"w-screen h-7 bg-white  flex items-center justify-center "}
        >
          <span
            className={"w-full flex flex-row items-center justify-center gap-1"}
          >
            try{" "}
            <Link
              target={"_blank"}
              href={"https://openbrein.org/"}
              className={
                "font-montserrat hover:opacity-75 underline font-black"
              }
            >
              OPENBREIN
            </Link>{" "}
            for free <FaArrowRight size={12} />
          </span>
        </div>
      )}
      <div className=" w-screen h-20 flex items-center justify-between px-10 py-2 backdrop-blur-2xl border-gray-300 gap-5">
        {/* Left section */}
        <div className="flex items-center gap-8 min-w-1/4">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center cursor-pointer text-2xl dark:text-white text-studodarkblue min-w-10 min-h-10 rounded-full border dark:border-studoborder/20 border-gray-300 shadow-xl glass-rgb"
          >
            {burgerOpen ? (
              <TbLayoutSidebarLeftCollapse className={"dark:opacity-30"} />
            ) : (
              <HiMenuAlt4 className={"dark:opacity-30"} />
            )}
          </button>
          <Link
            href={"/home"}
            title={SpecialeDagTitel()}
            className={"w-fit flex flex-row gap-1"}
          >
            <span
              className={`font-georgia text-3xl font-bold truncate bg-gradient-to-r ${SpecialeDag()} bg-clip-text text-transparent transition-all duration-300`}
            >
              Studo
            </span>
            {beta && (
              <span
                className={
                  "text-emerald-800 dark:text-blue-400 text-xs font-georgia"
                }
              >
                beta
              </span>
            )}
          </Link>
          {premium && (
            <Link
              href={"/select"}
              className={
                "hover:scale-105 transition-all duration-300 px-5 py-1 text-sm font-bold shadow-2xl rounded-4xl border-studoborder bg-white backdrop-blur-2xl text-studodarkblue"
              }
            >
              upgrade to select
            </Link>
          )}
        </div>

        {/*center*/}
        {/*
        <div className={"w-full h-fit flex justify-end items-center"}>
          <AppSearchbar />
        </div>*/}

        {/* Right section */}
        <div className="flex items-center gap-5 ml-5 justify-end">
          <OnlineScanner />
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
          {isLoading ? (
            <div className="min-w-20 h-8 rounded-4xl bg-studogrey/30 animate-pulse" />
          ) : (
            <Streak
              streak={user?.streak_count ?? 0}
              StreakOpen={StreakOpen}
              setStreakOpen={setStreakOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface StreakProps {
  streak: number;
  StreakOpen: boolean;
  setStreakOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Streak({ streak, StreakOpen, setStreakOpen }: StreakProps) {
  const config = getStreakConfig(streak);
  const containerRef = useRef(null);

  return (
    <Link
      href={"/streak"}
      ref={containerRef}
      onMouseEnter={() => setStreakOpen(true)}
      onMouseLeave={() => setStreakOpen(false)}
      className="min-w-20 max-w-20 max-h-8 flex items-center cursor-pointer active:scale-95 transition-all duration-300 justify-center relative"
    >
      {config.glow && (
        <div className="absolute z-0 flex justify-center min-w-20 min-h-8 max-h-8 blur-lg opacity-40 py-1 px-3 bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 rounded-4xl" />
      )}
      <div
        className={`${config.glow ? "z-10 relative" : ""} min-w-fit flex justify-center py-1 px-3 ${config.bg} rounded-4xl gap-2 font-bold dark:text-white items-center`}
      >
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
        containerRef={containerRef}
      />
    </Link>
  );
}

function getStreakConfig(streak: number) {
  if (streak === 0) {
    return {
      bg: "dark:bg-studogrey/30 bg-slate-200",
      icon: "/images/streak/streak-03.svg",
      saturation: "saturate-0",
      textColor: "",
      glow: false,
    };
  }

  if (streak === 67 || streak === 69 || streak >= 200) {
    return {
      bg: "bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300",
      icon: "/images/streak/streak-02.svg",
      saturation: "saturate-100",
      textColor: "text-studodarkblue",
      glow: streak >= 200,
    };
  }

  if (streak <= 10) {
    return {
      bg: "dark:bg-studogrey/30 bg-slate-200",
      icon: "/images/streak/streak-03.svg",
      saturation: "saturate-50",
      textColor: "",
      glow: false,
    };
  }

  if (streak <= 49) {
    return {
      bg: "dark:bg-studogrey/30 bg-slate-200",
      icon: "/images/streak/streak-03.svg",
      saturation: "saturate-100",
      textColor: "",
      glow: false,
    };
  }

  if (streak <= 99) {
    return {
      bg: "dark:bg-studogrey/30 bg-slate-200",
      icon: "/images/streak/streak-02.svg",
      saturation: "saturate-100",
      textColor: "",
      glow: false,
    };
  }

  return {
    bg: "bg-gradient-to-r from-amber-300/30 via-amber-600/30 to-yellow-500/30",
    icon: "/images/streak/streak-03.svg",
    saturation: "saturate-100",
    textColor: "",
    glow: false,
  };
}

function SpecialeDag() {
  const date: Date = new Date();
  const dag = date.getDate();
  const maand = date.getMonth();
  const jaar = date.getFullYear();
  const feestdagen = {
    christmas:
      "from-rose-600 via-rose-500 to-rose-400 dark:from-white dark:to-rose-200",
    christmasDay:
      "from-red-600 via-red-500 to-red-400 dark:from-white dark:to-red-200",
    newYear:
      "from-yellow-700 via-amber-500 to-yellow-400 dark:from-white dark:to-amber-200",
    threeKings:
      "from-amber-600 via-amber-500 to-yellow-500 dark:from-white dark:to-yellow-200",
    labour:
      "from-red-600 via-red-500 to-red-400 dark:from-white dark:to-red-200",
    valentine:
      "from-pink-600 via-pink-500 to-pink-400 dark:from-pink-300 dark:via-pink-300 dark:to-pink-400",
    halloween:
      "from-orange-600 via-orange-500 to-orange-400 dark:from-white dark:to-orange-200",
    easter:
      "from-violet-500 via-violet-400 to-purple-400 dark:from-white dark:to-violet-200",
    stPatricks:
      "from-green-600 via-green-500 to-green-400 dark:from-white dark:to-green-200",
    mothersDay:
      "from-pink-500 via-pink-400 to-rose-400 dark:from-white dark:to-pink-200",
    fathersDay:
      "from-sky-600 via-sky-500 to-sky-400 dark:from-white dark:to-sky-200",
    carnival:
      "from-fuchsia-600 via-fuchsia-500 to-fuchsia-400 dark:from-white dark:via-fuchsia-200 dark:to-fuchsia-200",
    kingsDay:
      "from-orange-500 via-orange-400 to-amber-400 dark:from-white dark:to-orange-200",
    midsummer:
      "from-blue-400 via-green-300 to-amber-300 dark:from-white dark:to-sky-200",
    vs: "from-blue-600 to-red-700 dark:from-blue-600 dark:to-red-400",
    nederland:
      "from-orange-400 via-amber-500 to-orange-300 dark:from-orange-400 dark:via-amber-500 dark:to-orange-300",
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

  const key: string = `${dag}/${maand}`;
  const vasteDagen: Record<string, string> = {
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

  return (
    vasteDagen[key] ||
    "from-emerald-500 to-emerald-400 dark:from-white dark:to-blue-200"
  );
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

function SpecialeDagTitel() {
  const date: Date = new Date();
  const dag = date.getDate();
  const maand = date.getMonth();
  const jaar = date.getFullYear();
  const locale = useLocale();
  const pasen = berekenPasen(jaar);
  const pasenDatum = new Date(jaar, pasen.maand - 1, pasen.dag);

  const carnaval = new Date(pasenDatum);
  carnaval.setDate(carnaval.getDate() - 49);

  if (dag === pasen.dag && maand === pasen.maand - 1) {
    return "easters";
  }
  if (dag === carnaval.getDate() && maand === carnaval.getMonth()) {
    return "Vrolijk Carnaval";
  }

  const key: string = `${dag}/${maand}`;
  const vasteDagen: Record<string, string> = {
    "1/0": "Happy New Year!",
    "6/0": "Happy Three Kings' Day",
    "14/1": "Happy Valentine's Day",
    "17/2": "Happy St. Patrick's Day",
    "1/4": "Happy Labour Day",
    "21/5": "Happy Midsummer",
    "31/9": "Happy Halloween",
    "24/11": "Merry Christmas",
    "25/11": "Merry Christmas",
    "31/11": "Happy New Year's Eve",
  };

  if (locale === "nl" && key === "21/6") {
    return "Nationale Feestdag";
  }

  if (locale === "nl" && key === "27/3") {
    return "Koningsdag";
  }

  return vasteDagen[key] || "Holiday";
}
