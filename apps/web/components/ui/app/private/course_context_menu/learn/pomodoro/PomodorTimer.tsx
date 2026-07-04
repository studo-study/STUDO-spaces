"use client";
import ContextMenuHeader from "@/components/ui/app/private/course_context_menu/ContextMenuHeader";
import { useTranslations } from "next-intl";

const PomodorTimer: React.FC = () => {
  const t = useTranslations("pomodoro");

  return (
    <div className={"min-h-0 w-full flex flex-col flex-1"}>
      <ContextMenuHeader t={"pomodoro"} />
      <div className={"flex-1 min-h-0 flex items-center justify-center"}>
        <span className={""}>{t("")}</span>
      </div>
    </div>
  );
};

PomodorTimer.displayName = "PomodorTimer";
export default PomodorTimer;
