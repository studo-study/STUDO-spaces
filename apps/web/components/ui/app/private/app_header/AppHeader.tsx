// components/app/app_header/header.tsx
"use client";
import TriggerAddPopup from "@/components/ui/app/private/app_header/popups/AddPopup";
import { useRef, useState } from "react";
import TriggerNotif from "@/components/ui/app/private/app_header/popups/NotificationsPopup";
import StreakPopup from "@/components/ui/app/private/app_header/StreakPopup";
import TriggerProfile from "@/components/ui/app/private/app_header/popups/ProfilePopup";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { StudoUser } from "@/types/types";
import { useAppStore } from "@/store/useAppStore";
import OnlineScanner from "@/components/ui/app/private/app_header/SocialSection";
import AppSearchbar from "@/components/ui/app/private/search/SearchBar";
import { ArrowRight, OctagonX, PanelRightOpen } from "lucide-react";
import { HiMenuAlt4 } from "react-icons/hi";
import BreadCrumbs from "@/components/ui/app/private/course/layout/BreadCrumbs";
import {
  SpecialeDag,
  SpecialeDagTitel,
} from "@/components/ui/app/private/app_header/SpecialeDag";
import { useImpersonation } from "@/hooks/app/auth/useImpersonation";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import Streak from "@/components/ui/overige/icons/Streak";

interface HeaderProps {
  burgerOpen: boolean;
  Search: boolean;
  setSearch: React.Dispatch<React.SetStateAction<boolean>>;
  createOpen: boolean;
  setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCreate: () => void;
  user: StudoUser | null;
  isLoading: boolean;
}

export default function AppHeader({
  burgerOpen,
  Search,
  setSearch,
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
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const premium = process.env.NEXT_PUBLIC_PREMIUM === "true";
  const { impersonating, stop } = useImpersonation();

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
        <div className="flex items-center gap-8 w-fit">
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
        <div className={"min-w-fit truncate flex-row flex items-center"}>
          <BreadCrumbs />
        </div>

        <div className={"w-full h-fit flex justify-end items-center gap-2"}>
          {impersonating && (
            <BaseButton
              label={"stop impersonating"}
              iconLeft={<OctagonX size={15} />}
              className={"max-h-10"}
              size={"sm"}
              variant={"danger"}
              onClick={() => stop()}
            />
          )}
          <OnlineScanner />
          <AppSearchbar
            focusSignal={Search}
            onFocused={() => setSearch(false)}
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
              StreakOpen={false}
              setStreakOpen={setStreakOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
}
