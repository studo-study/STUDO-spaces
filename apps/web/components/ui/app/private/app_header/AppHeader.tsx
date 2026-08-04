// components/app/app_header/header.tsx
"use client";
import { useLocale } from "next-intl";
import TriggerAddPopup from "@/components/ui/app/private/app_header/popups/AddPopup";
import { useEffect, useRef, useState } from "react";
import TriggerNotif from "@/components/ui/app/private/app_header/popups/NotificationsPopup";
import StreakPopup from "@/components/ui/app/private/app_header/StreakPopup";
import TriggerProfile from "@/components/ui/app/private/app_header/popups/ProfilePopup";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { StudoUser } from "@/types/types";
import { useAppStore } from "@/store/useAppStore";
import OnlineScanner from "@/components/ui/app/private/app_header/SocialSection";
import AppSearchbar from "@/components/ui/app/private/search/SearchBar";
import { ArrowRight, PanelRightOpen } from "lucide-react";
import { HiMenuAlt4 } from "react-icons/hi";
import {
  SpecialeDag,
  SpecialeDagTitel,
} from "@/components/ui/app/private/app_header/SpecialeDag";

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
  const premium = process.env.NEXT_PUBLIC_PREMIUM === "true";

  useEffect(() => {
    if (Search && searchRef.current) {
      searchRef.current.focus();
    }
  }, [Search]);

  return (
    <div className={"h-fit z-100 top-0 w-screen flex flex-col"}>
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
            for free <ArrowRight size={18} />
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
              <PanelRightOpen className={"dark:opacity-30"} />
            ) : (
              <HiMenuAlt4 className={"dark:opacity-30"} />
            )}
          </button>
          <Link
            href={"/home"}
            title={SpecialeDagTitel()}
            className={"w-fit flex flex-row gap-1"}
          >
            {premium ? (
              <span
                className={
                  "font-georgia text-3xl font-bold truncate flex flex-row gap-1 bg-linear-to-r bg-clip-text text-transparent transition-all duration-300 from-indigo-300 to-blue-300"
                }
              >
                Studo Select
              </span>
            ) : (
              <span
                className={`font-georgia text-3xl font-bold truncate flex flex-row gap-1 bg-linear-to-r ${SpecialeDag()} bg-clip-text text-transparent transition-all duration-300`}
              >
                Studo
              </span>
            )}
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
          {!premium && !beta && (
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

        <div className={"w-full h-fit flex justify-end items-center gap-2"}>
          <OnlineScanner />
          <AppSearchbar />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-5 ml-5 justify-end">
          {/* Add button */}
          <TriggerAddPopup
            AddIsOpen={AddIsOpen}
            setAddIsOpen={setAddIsOpen}
            toggleCreate={toggleCreate}
          />

          <TriggerNotif
            NotifIsOpen={NotifIsOpen}
            setNotifIsOpen={setNotifIsOpen}
          />

          {isLoading ? (
            <div className="h-10 w-10 rounded-full bg-studogrey/30 animate-pulse" />
          ) : (
            <TriggerProfile
              ProfileIsOpen={ProfileIsOpen}
              setProfileIsOpen={setProfileIsOpen}
              user={user}
            />
          )}

          {isLoading ? (
            <div className="min-w-20 h-8 rounded-4xl bg-studogrey/30 animate-pulse" />
          ) : (
            <Streak
              streak={user?.streakCount ?? 0}
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
