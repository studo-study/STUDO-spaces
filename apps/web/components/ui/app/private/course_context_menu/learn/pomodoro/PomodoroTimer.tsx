"use client";
import ContextMenuHeader from "@/components/ui/app/private/course_context_menu/ContextMenuHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { Pause, Play } from "lucide-react";
import { pomodoroStore } from "@/store/course_context_menu/PomodoroStore";
import Clock from "@/components/ui/app/private/course_context_menu/learn/pomodoro/Clock";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
const PomodoroTimer: React.FC = () => {
  const t = useTranslations("pomodoro");
  const isRunning = pomodoroStore((state) => state.isRunning);
  const start = pomodoroStore((state) => state.start);
  const pause = pomodoroStore((state) => state.pause);
  const toggleRunning = () => {
    if (isRunning) pause();
    else start();
  };

  return (
    <div className={"min-h-0 w-full flex flex-col flex-1"}>
      <ContextMenuHeader t={"pomodoro"} />
      <div className={"flex-1 min-h-0 flex items-center justify-center"}>
        <div className={"flex flex-col gap-15 items-center"}>
          <Clock>
            <Image
              src={"/vectors/pomodoro.png"}
              alt={"pomodoro icon"}
              width={200}
              height={200}
              className={"w-30"}
            />
          </Clock>
          <span className={"dark:text-white font-bold text-lg"}>
            {t("focus_mode")}
          </span>
          <div>
            <BaseTooltip content={isRunning ? t("pause") : t("play")}>
              <BaseButton
                size={"xs"}
                className={"max-w-15"}
                variant={"outline_link"}
                onClick={() => toggleRunning()}
                icon={isRunning ? <Pause size={17} /> : <Play size={17} />}
              />
            </BaseTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

PomodoroTimer.displayName = "PomodoroTimer";
export default PomodoroTimer;
