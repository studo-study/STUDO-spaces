"use client";
import { useTranslations } from "next-intl";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { IoArrowBack, IoRefresh } from "react-icons/io5";
import { useSpeedyContext } from "./SpeedyContext";

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

interface SpeedyEndScreenProps {
  back: () => void;
}

const SpeedyEndScreen = ({ back }: SpeedyEndScreenProps) => {
  const t = useTranslations("speedy");
  const { state, elapsedMs, accuracy, restart } = useSpeedyContext();

  const stats = [
    { label: t("stat_rounds"), value: state.round },
    { label: t("stat_time"), value: formatTime(elapsedMs) },
    { label: t("stat_accuracy"), value: `${accuracy}%` },
  ];

  return (
    <div className="w-full max-w-xl h-fit rounded-4xl border border-gray-300 dark:border-neutral-200/30 bg-studogrey/30 shadow-xl p-8 gap-8 flex flex-col justify-between items-center font-sfpro dark:text-white text-studodarkblue">
      <div className="flex flex-col gap-2 items-center text-center">
        <span className="text-2xl font-bold">{t("finished_title")}</span>
        <p className="opacity-75">{t("finished_expl")}</p>
      </div>

      <div className="w-full flex flex-row gap-3 items-stretch justify-center">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex-1 flex flex-col gap-1 items-center rounded-3xl bg-gray-300/20 dark:bg-studogrey/20 py-5 px-3"
          >
            <span className="text-3xl font-bold">{s.value}</span>
            <span className="text-xs opacity-75 text-center">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-row gap-3 items-center justify-center">
        <BaseButton
          type="button"
          variant="submit"
          label={t("return")}
          iconLeft={<IoArrowBack />}
          onClick={back}
        />
        <BaseButton
          type="button"
          variant="primary"
          label={t("restart")}
          iconLeft={<IoRefresh />}
          onClick={restart}
        />
      </div>
    </div>
  );
};

SpeedyEndScreen.displayName = "SpeedyEndScreen";
export default SpeedyEndScreen;
