"use client";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { StudoUser } from "@/types/types";
import Avatar from "@studo/ui/design_system/avatar/Avatar";
import { useToast } from "@/components/providers/app/ToastProvider";
import Verified from "@/components/ui/overige/icons/Verified";
import {
  ChevronRight,
  HatGlasses,
  LogOut,
  Settings,
  ShieldCheck,
} from "lucide-react";
interface ProfileTriggerPopupProps {
  ProfileIsOpen: boolean;
  setProfileIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: StudoUser | null;
}

export default function TriggerProfile({
  ProfileIsOpen,
  setProfileIsOpen,
  user,
}: ProfileTriggerPopupProps) {
  const containerRef = useRef(null);
  const togglePopUp = () => {
    setProfileIsOpen((prev) => !prev);
  };
  return (
    <div
      ref={containerRef}
      onClick={togglePopUp}
      className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300"
    >
      <Avatar size={40} id={user?.id} displayName={user?.displayName} />

      <ProfilePopup
        ProfileIsOpen={ProfileIsOpen}
        setProfileIsOpen={setProfileIsOpen}
        containerRef={containerRef}
        user={user}
      />
    </div>
  );
}

interface ProfilePopupProps {
  ProfileIsOpen: boolean;
  setProfileIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  user: StudoUser | null;
}

function ProfilePopup({
  ProfileIsOpen,
  setProfileIsOpen,
  containerRef,
  user,
}: ProfilePopupProps) {
  const t = useTranslations("header");
  const popupRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const Items = [
    {
      link: "/settings/account",
      label: "settings",
      icon: <Settings size={15} />,
      color: "from-orange-500 to-amber-500",
      gradient: "to-amber-500",
    },
    {
      link: "/privacy",
      label: "privacy",
      icon: <HatGlasses size={15} />,
      color: "from-emerald-500 to-studogreen",
      gradient: "to-emerald-500",
    },
  ];
  const logout = {
    link: "/logout",
    label: "logout",
    icon: <LogOut size={15} />,
    color: "from-cyan-500 to-cyan-600",
    gradient: "to-cyan-500",
  };

  const mod = {
    link: "/backoffice/stats",
    label: "ad",
    icon: <ShieldCheck size={15} />,
    color: "from-violet-500 to-purple-600",
    gradient: "to-violet-500",
  };
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setProfileIsOpen(false);
      }
    };

    if (ProfileIsOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ProfileIsOpen, setProfileIsOpen, containerRef]);

  return (
    <div
      ref={popupRef}
      className={`absolute top-full right-0 mt-4
        z-9999 w-75 truncate h-fit
        rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out origin-top
        ${
          ProfileIsOpen
            ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
        }
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={"w-full h-full flex flex-col overflow-hidden"}>
        <div className={"w-full h-fit flex flex-col "}>
          <Link
            href={"/account"}
            className={
              "px-5 flex justify-center items-baseline flex-col w-full glass-rgb h-20 border-b border-studoborder/30"
            }
          >
            <div
              className={
                "w-full h-full flex flex-col items-baseline justify-center"
              }
            >
              <div
                className={
                  "text-studodarkblue dark:text-white text-start flex flex-row gap-2 items-center font-bold text-xl truncate overflow-hidden w-full"
                }
              >
                <span className={"truncate"}>{user?.displayName}</span>
                {user?.verified && (
                  <Verified
                    variant={user?.publicRole === "owner" ? "gold" : "blue"}
                    size={18}
                  />
                )}
              </div>
              <span className={"text-zinc-400 truncate"}>{user?.email}</span>
            </div>
          </Link>

          {user?.publicRole === "admin" || user?.publicRole === "owner" ? (
            <Link
              href={mod.link}
              className={`group p-2 flex w-full items-center h-18
                                    transition-all duration-200 ease-out
                         ${ProfileIsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
              style={{
                transitionDelay: ProfileIsOpen ? `${1 * 50}ms` : "0ms",
              }}
            >
              <div
                className={
                  "w-full rounded-xl px-3 flex flex-row gap-3 h-full transition-all " +
                  `duration-100 hover:bg-linear-to-r from-transparent ${mod.gradient} text-sm dark:text-white items-center justify-baseline`
                }
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg
                                  bg-gradient-to-br ${mod.color}
                                  shadow-md shadow-black/10
                                  group-hover:scale-110 text-white group-hover:shadow-lg
                                  transition-all duration-200`}
                >
                  {mod.icon}
                </div>
                <span>{t(mod.label)}</span>

                <ChevronRight className="w-4 h-4 text-white ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </div>
            </Link>
          ) : null}

          {Items.map((item, index) => {
            return (
              <Link
                href={item.link}
                key={index}
                className={`group p-2 flex w-full items-center h-18
                                    transition-all duration-200 ease-out
                         ${ProfileIsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
                style={{
                  transitionDelay: ProfileIsOpen
                    ? `${user?.verified ? (index + 1) * 50 : index * 50}ms`
                    : "0ms",
                }}
              >
                <div
                  className={
                    "w-full rounded-xl px-3 flex flex-row gap-3 h-full transition-all " +
                    `duration-100 hover:bg-linear-to-r from-transparent ${item.gradient} text-sm dark:text-white text-studodarkblue items-center justify-baseline`
                  }
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg
                                  bg-gradient-to-br ${item.color}
                                  shadow-md shadow-black/10
                                  group-hover:scale-110 group-hover:shadow-lg
                                  transition-all duration-200`}
                  >
                    {item.icon}
                  </div>
                  <span>{t(item.label)}</span>

                  <svg
                    className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
          <button
            onClick={() => {
              signOut({ callbackUrl: "/" });
              toast.success("logged out");
            }}
            className={`group p-2 flex cursor-pointer w-full items-center h-18
                                    transition-all duration-200 ease-out
                         ${ProfileIsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
            style={{
              transitionDelay: ProfileIsOpen
                ? `${user?.verified ? 4 * 50 : 4 * 50}ms`
                : "0ms",
            }}
          >
            <div
              className={
                "w-full rounded-xl px-3 flex flex-row gap-3 h-full transition-all " +
                `duration-100 hover:bg-linear-to-r from-transparent ${logout.gradient} text-sm dark:text-white text-studodarkblue items-center justify-baseline`
              }
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg
                                  bg-linear-to-br ${logout.color}
                                  shadow-md shadow-black/10
                                  group-hover:scale-110 group-hover:shadow-lg
                                  transition-all duration-200`}
              >
                {logout.icon}
              </div>
              <span>{t(logout.label)}</span>

              <svg
                className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
