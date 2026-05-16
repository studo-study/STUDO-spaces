interface SmallProgressProps {
  progress: number;
  length: number;
}
const SmallProgress = (props: SmallProgressProps) => {
  const { progress, length } = props;
  const prog = Math.min(100, Math.floor((progress / (length * 2)) * 100));
  return (
    <div className={"flex flex-row gap-2 w-full items-center"}>
      <div
        className={
          "w-3/4 flex items-center min-h-1.5 rounded-full bg-studogrey/30"
        }
      >
        <div
          className={`${getStrokeColor(prog)} rounded-full h-1.5`}
          style={{ width: prog + "%" }}
        ></div>
      </div>
      <span
        className={"w-1/4 text-xs dark:text-white text-studodarkblue font-bold"}
      >
        {prog}%
      </span>
    </div>
  );
};

function getStrokeColor(prog: number) {
  if (prog === 100) return "bg-emerald-500";
  if (prog >= 95) return "bg-green-500";
  if (prog >= 85) return "bg-green-400";
  if (prog >= 75) return "bg-green-300";
  if (prog >= 65) return "bg-green-300";
  if (prog >= 50) return "bg-amber-500";
  if (prog >= 30) return "bg-orange-500";
  if (prog > 0) return "bg-red-400";
  return "stroke-studoblue";
}

SmallProgress.displayName = "SmallProgress";
export default SmallProgress;
