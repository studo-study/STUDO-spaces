"use client";
import { useEffect, useState } from "react";
import classNames from "@/utils/classnames";

interface IntermezzoBarProps {
  completedCards: number;
  setLength: number;
}

const INTERVAL = 5;

const IntermezzoBar: React.FC<IntermezzoBarProps> = ({
  completedCards,
  setLength,
}) => {
  const count = Math.ceil(setLength / INTERVAL);
  // segment waar de zojuist voltooide kaart in valt → vult op mount.
  // werkt ook voor de laatste partiële batch (bv 28 kaarten → segment 5).
  const justCompleted = Math.ceil(completedCards / INTERVAL) - 1;

  const [fill, setFill] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setFill(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={"flex flex-row w-full gap-3"}>
      {Array.from({ length: count }, (_, i) => {
        const done = i < justCompleted;
        const animating = i === justCompleted;
        const width = done ? "100%" : animating && fill ? "100%" : "0%";
        return (
          <div
            key={i}
            className={"w-full h-2 rounded-full bg-studogrey overflow-hidden"}
          >
            <div
              className={classNames(
                "h-full rounded-full bg-linear-90 from-emerald-400 to-emerald-500 transition-[width] duration-700 ease-out",
              )}
              style={{ width }}
            />
          </div>
        );
      })}
    </div>
  );
};

IntermezzoBar.displayName = "IntermezzoBar";
export default IntermezzoBar;
