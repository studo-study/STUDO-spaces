"use client";
import { useEffect, useState } from "react";
import { RiWifiOffLine } from "react-icons/ri";
import { useTranslations } from "next-intl";
import BaseToolTip from "@/components/ui/design_system/tooltip/BaseToolTip";

const OnlineScanner = () => {
  const [isOnline, setIsOnline] = useState(() =>
    typeof window !== "undefined" ? window.navigator.onLine : true,
  );
  const t = useTranslations("offline");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <BaseToolTip position={"bottom"} content={t("progress_explanation")}>
          <div
            className={
              "truncate dark:text-white px-2 py-1 rounded-full transition-all duration-300 select-none text-rose-700 font-semibold border border-transparent hover:bg-studogrey/30 hover:border-studogrey/30 text-sm flex flex-row gap-1 sm:gap-2 items-center"
            }
          >
            <RiWifiOffLine />
            <span className="hidden sm:inline">{t("offline")}</span>
          </div>
        </BaseToolTip>
      )}
    </>
  );
};

OnlineScanner.displayName = "OnlineScanner";
export default OnlineScanner;
