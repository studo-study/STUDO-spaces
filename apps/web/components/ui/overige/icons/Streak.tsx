import { useRef } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import StreakPopup from "@/components/ui/app/private/app_header/StreakPopup";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";

interface StreakProps {
  size?: number;
  popup?: boolean;
  streak: number;
  StreakOpen?: boolean;
  setStreakOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Streak({
  streak,
  StreakOpen,
  setStreakOpen,
  popup = true,
}: StreakProps) {
  const config = getStreakConfig(streak);
  const containerRef = useRef(null);

  if (popup) {
    return (
      <Link
        href={"/streak"}
        ref={containerRef}
        onMouseEnter={() => setStreakOpen && setStreakOpen(true)}
        onMouseLeave={() => setStreakOpen && setStreakOpen(false)}
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
            loading={"eager"}
            height={0}
            className={`w-5 ${config.saturation}`}
          />
          <span className={`w-fit ${config.textColor}`}>{streak}</span>
        </div>
        {StreakOpen && setStreakOpen && (
          <StreakPopup
            Streak={streak}
            StreakOpen={StreakOpen}
            setStreakOpen={setStreakOpen}
            containerRef={containerRef}
          />
        )}
      </Link>
    );
  }

  return (
    <BaseTooltip content={streak}>
      <div className={"h-full w-fit min-h-0 flex-1 flex-row flex items-center"}>
        <Image
          src={config.icon}
          alt=""
          width={0}
          loading={"eager"}
          height={0}
          className={`w-5 mb-0 p-0 ${config.saturation}`}
        />
      </div>
    </BaseTooltip>
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
