"use client";
import LearnCard from "@/app/[locale]/(shared)/(modes)/learn/[id]/LearnCard";
import type { FullStudysetResponse } from "@studo/types";
import { useSideMenu } from "@/store/coursecontextmenu/CourseStore";
import { pomodoroStore } from "@/store/coursecontextmenu/PomodoroStore";
import Image from "next/image";
import classNames from "@/utils/classnames";

const Learncontroller = ({ data }: { data?: FullStudysetResponse }) => {
  const pomodoroOn = pomodoroStore((state) => state.isRunning);
  const finished = pomodoroStore((state) => state.finished);
  const clearFinished = pomodoroStore((state) => state.reset);
  const setMenu = useSideMenu((state) => state.setMenuInfo);
  void data;
  return (
    <div className={"w-full h-full flex justify-center items-center"}>
      <LearnCard />

      {(pomodoroOn || finished) && (
        <div
          onClick={() => {
            if (finished) clearFinished();
            setMenu({ isOpen: true, origin: "pomodoro" });
          }}
          className={classNames(
            "absolute bottom-7 right-30 h-10 w-10 cursor-pointer",
            finished && "animate-bounce",
          )}
        >
          <Image
            src={"/vectors/pomodoro.png"}
            alt={"pomodoro icon"}
            width={200}
            height={200}
            className={"w-8"}
          />
        </div>
      )}
    </div>
  );
};

Learncontroller.displayName = "Learncontroller";
export default Learncontroller;
