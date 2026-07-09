"use client";
import { useEffect, useRef } from "react";
import {
  pomodoroStore,
  POMODORO_DURATION,
} from "@/store/coursecontextmenu/PomodoroStore";
import { useLearnStore } from "@/app/[locale]/(shared)/(modes)/learn/[id]/learnStore";

interface ClockProps {
  children: React.ReactNode;
}

const CIRCUMFERENCE = 2 * Math.PI * 90;
const Clock: React.FC<ClockProps> = (props) => {
  const { children } = props;
  const progressRef = useRef<SVGPathElement>(null);
  const isRunning = pomodoroStore((state) => state.isRunning);
  const reset = pomodoroStore((state) => state.reset);
  const isEnabled = useLearnStore((state) => state.learnSettings.pomodoro);

  useEffect(() => {
    if (!progressRef.current) return;
    const elapsed = pomodoroStore.getState().getElapsed();
    if (elapsed >= POMODORO_DURATION) {
      reset();
      return;
    }
    const animation = progressRef.current.animate(
      [{ strokeDashoffset: 0 }, { strokeDashoffset: CIRCUMFERENCE }],
      { duration: POMODORO_DURATION, fill: "forwards", easing: "linear" },
    );

    if (!isEnabled) {
      animation.cancel();
      reset();
      return;
    }

    animation.currentTime = elapsed;
    animation.onfinish = () => reset();
    if (isRunning) animation.play();
    else animation.pause();

    return () => animation.cancel();
  }, [isRunning, reset, isEnabled]);

  return (
    <div className="relative flex items-center justify-center w-full h-fit">
      <div className="absolute text-lg font-bold z-10">{children}</div>
      <svg
        viewBox="0 0 200 200"
        className="w-100 h-100"
        style={{ transform: "rotate(-90deg)" }}
      >
        <defs>
          <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#abd7c1" />
            <stop offset="100%" stopColor="#98c0cd" />
          </linearGradient>
        </defs>
        <path
          d="M 100 10 A 90 90 0 0 1 190 100 A 90 90 0 0 1 100 190 A 90 90 0 0 1 10 100 A 90 90 0 0 1 100 10"
          fill="none"
          className="stroke-studogrey/30 rounded-full"
          strokeWidth="3"
        />
        <path
          ref={progressRef}
          d="M 100 10 A 90 90 0 0 1 190 100 A 90 90 0 0 1 100 190 A 90 90 0 0 1 10 100 A 90 90 0 0 1 100 10"
          fill="none"
          strokeWidth="3"
          radius={500}
          className={`stroke-emerald-500 rounded-4xl`}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={0}
        />
      </svg>
    </div>
  );
};

Clock.displayName = "Clock";
export default Clock;
