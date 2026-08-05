import classNames from "@/utils/classnames";
import { Phase } from "@/app/[locale]/(shared)/(modes)/learn/[id]/useLearnCard";

interface ProgressBarProps {
  cardIndex: number;
  cardLength: number;
  queueMode?: boolean;
  queueIndex?: number;
  queueLength?: number;
  subtle?: boolean;
  position?: "left" | "right" | "top" | "bottom";
  phase?: Phase;
  errorMode?: boolean;
}
export default function ProgressBar({
  cardIndex,
  cardLength,
  queueMode = false,
  queueLength = 0,
  queueIndex = 0,
  position = "right",
  subtle,
  errorMode = false,
}: ProgressBarProps) {
  const index = queueMode ? queueIndex : cardIndex;
  const length = queueMode ? queueLength : cardLength;
  const perc = length > 0 ? Math.floor((index / length) * 100) : 0;
  console.log(perc);
  return (
    <div
      className={classNames(
        `w-full gap-2 flex`,
        position === "left" && "flex-row items-center gap-5",
        position === "right" && "flex-row-reverse items-center gap-5",
        position === "top" && "flex-col justify-center gap-2",
        position === "bottom" && "flex-col-reverse justify-center gap-2",
      )}
    >
      {!subtle && (
        <div className={"flex items-center justify-between gap-1 "}>
          <span>{queueMode ? queueIndex + 1 : index + 1}</span>/
          <span>{queueMode ? queueLength : cardLength}</span>
        </div>
      )}

      <div
        className={
          "w-full bg-studogrey/30 shadow-2xl overflow-hidden flex flex-row items-center justify-baseline h-2 rounded-full border border-gray-300 dark:border-studoborder/30"
        }
      >
        <div
          style={{ width: `${perc}%` }}
          className={` h-full rounded-full bg-linear-90 ${errorMode ? "from-amber-500 to-orange-500" : "from-emerald-400 to-emerald-500"}`}
        />
      </div>
    </div>
  );
}
