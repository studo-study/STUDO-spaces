"use client";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface TriggerNotifProps {
  NotifIsOpen: boolean;
  setNotifIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function TriggerNotif({
  NotifIsOpen,
  setNotifIsOpen,
}: TriggerNotifProps) {
  const containerRef = useRef(null);
  const togglePopUp = () => {
    setNotifIsOpen((prev) => !prev);
  };

  const notifications = { notifications: [] };

  return (
    <button
      onClick={() => {
        togglePopUp();
      }}
      ref={containerRef}
      className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300"
    >
      <div className="flex items-center justify-center bg-slate-200 dark:bg-gray-700/50 text-2xl dark:text-white/30 min-w-10 min-h-10 rounded-full border dark:border-studoborder/20 border-gray-300 shadow-xl">
        <IoMdNotificationsOutline />
      </div>
      {notifications.notifications.length > 0 && (
        <div className="absolute top-0.5 right-0.5 rounded-full border-studoborder border bg-rose-500 w-2 h-2" />
      )}
      <NotifPopup
        NotifIsOpen={NotifIsOpen}
        setNotifIsOpen={setNotifIsOpen}
        containerRef={containerRef}
        data={notifications}
      />
    </button>
  );
}

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: string;
  date: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
}

interface notifications {
  notifications: Notification[];
}

interface NotifPopupProps {
  NotifIsOpen: boolean;
  setNotifIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  data: notifications;
}

function NotifPopup({
  NotifIsOpen,
  setNotifIsOpen,
  containerRef,
  data,
}: NotifPopupProps) {
  const t = useTranslations("header");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setNotifIsOpen(false);
      }
    };

    if (NotifIsOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [NotifIsOpen, setNotifIsOpen, containerRef]);

  return (
    <div
      ref={popupRef}
      className={`absolute top-full right-0 mt-4
        z-[9999] w-56 truncate
        rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out origin-top
        ${
          NotifIsOpen
            ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
        }
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Arrow */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45
        bg-white/80 dark:bg-[#1e293b]/90  backdrop-blur-xl
        border-l border-t border-white/50 dark:border-white/10"
      />
      <div className={"w-full h-full flex flex-col"}>
        <div
          className={
            "w-full flex text-sm items-center dark:text-white/30 h-10 border-b border-studoborder/30 px-5 "
          }
        >
          {t("notifs")}:
        </div>
        <div className={"w-full h-50"}>
          {!data && (
            <span
              className={
                "w-full dark:text-white/30 text-sm text-studodarkblue h-full flex items-center justify-center"
              }
            >
              {t("Loading")}
            </span>
          )}
          {data && data.notifications.length === 0 && (
            <div
              className={`w-full h-full flex flex-col gap-2 items-center justify-center transition-all duration-200 ease-out
                         ${NotifIsOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
              style={{
                transitionDelay: NotifIsOpen ? `${1 * 50}ms` : "0ms",
              }}
            >
              <span
                className={
                  "dark:text-white/60 font-bold text-base text-studodarkblue"
                }
              >
                {t("nonotif")}
              </span>
              <span className={"dark:text-white/30 text-xs text-studodarkblue"}>
                {t("allup")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
