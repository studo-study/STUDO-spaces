interface ProgressProps {
  length: number;
  progress: number;
  height?: number;
}

export function Progress({ length, progress, height = 56 }: ProgressProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const prog: number = Math.min(100, Math.floor((progress / length) * 100));
  const offset: number = circumference - (prog / 100) * circumference;

  return (
    <div
      className="rounded-full flex justify-center items-center relative overflow-hidden"
      style={{ height, width: height }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 110 110"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="55"
          cy="55"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
          className={
            prog === 100
              ? "stroke-emerald-500"
              : "dark:stroke-studogrey stroke-gray-300"
          }
        />
        <circle
          cx="55"
          cy="55"
          r="45"
          fill="none"
          strokeLinecap="round"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all ${progress == 0 && "opacity-0"} duration-500 ease-out ${getStrokeColor({ prog })}`}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>

      <span
        className="relative z-10 font-bold text-gray-700 dark:text-gray-200"
        style={{ fontSize: height * 0.22 }}
      >
        {prog}%
      </span>
    </div>
  );
}

interface strokeProps {
  prog: number;
}

function getStrokeColor({ prog }: strokeProps) {
  if (prog === 100) return "stroke-emerald-500";
  if (prog >= 95) return "stroke-green-500";
  if (prog >= 85) return "stroke-green-400";
  if (prog >= 75) return "stroke-green-300";
  if (prog >= 65) return "stroke-amber-500";
  if (prog >= 50) return "stroke-red-200";
  if (prog > 0) return "stroke-red-400";
  return "stroke-studoblue";
}
