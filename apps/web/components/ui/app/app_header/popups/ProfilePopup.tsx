"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PiStudent } from "react-icons/pi";
import { MdOutlinePrivacyTip, MdOutlineVerifiedUser } from "react-icons/md";
import { LuLogOut, LuSettings } from "react-icons/lu";
import { signOut } from "next-auth/react";
import { StudoUser } from "@/types/types";
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
      <div
        className={"absolute bg-emerald-500/50 h-10 w-10 rounded-full blur-sm"}
      />
      {user?.img_url && user.img_url !== "default" ? (
        <div className="relative z-10 shadow-2xl overflow-hidden h-10 w-10 text-xl flex items-center justify-center text-white rounded-full border border-studoborder">
          <Image
            src={user?.img_url ?? ""}
            alt=""
            width={40}
            height={40}
            className={"object-cover h-10 w-10"}
          />
        </div>
      ) : (
        <div className="relative z-10 shadow-2xl bg-emerald-600 h-10 w-10 text-xl flex items-center justify-center text-white rounded-full border border-studoborder">
          <PiStudent />
        </div>
      )}

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
  const Items = [
    {
      link: "/settings",
      label: "settings",
      icon: <LuSettings />,
      color: "from-orange-500 to-amber-500",
      gradient: "to-amber-500",
    },
    {
      link: "/privacy",
      label: "privacy",
      icon: <MdOutlinePrivacyTip />,
      color: "from-emerald-500 to-studogreen",
      gradient: "to-emerald-500",
    },
  ];
  const logout = {
    link: "/logout",
    label: "logout",
    icon: <LuLogOut />,
    color: "from-cyan-500 to-cyan-600",
    gradient: "to-cyan-500",
  };

  const mod = {
    link: "/admin/stats",
    label: "ad",
    icon: <MdOutlineVerifiedUser />,
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
        z-[9999] w-56 truncate h-fit
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
              <span
                className={
                  "font-studodarkblue dark:text-white text-start font-bold text-xl truncate overflow-hidden w-full"
                }
              >
                {user?.displayName}
              </span>
              <span className={"text-studogrey"}>{user?.email}</span>
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
                  `duration-100 hover:bg-linear-to-r from-transparent ${mod.gradient} text-sm dark:text-white text-studodarkblue items-center justify-baseline`
                }
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg
                                  bg-gradient-to-br ${mod.color}
                                  shadow-md shadow-black/10
                                  group-hover:scale-110 group-hover:shadow-lg
                                  transition-all duration-200`}
                >
                  {mod.icon}
                </div>
                <span>{t(mod.label)}</span>

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
            onClick={() => signOut({ callbackUrl: "/" })}
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
                                  bg-gradient-to-br ${logout.color}
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
