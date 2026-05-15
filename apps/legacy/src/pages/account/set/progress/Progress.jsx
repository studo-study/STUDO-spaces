export function Progress({ length, progress }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const prog = Math.min(100, Math.floor((progress / (length * 2)) * 100));
  const offset = circumference - (prog / 100) * circumference;

  return (
    <div className="h-14 w-14 rounded-full flex justify-center items-center relative overflow-hidden">
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
          className={`transition-all duration-500 ease-out ${getStrokeColor(prog)}`}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>

      <span className="relative z-10 text-xs font-bold text-gray-700 dark:text-gray-200">
        {prog}%
      </span>
    </div>
  );
}

function getStrokeColor(prog) {
  if (prog === 100) return "stroke-emerald-500";
  if (prog >= 95) return "stroke-green-500";
  if (prog >= 85) return "stroke-green-400";
  if (prog >= 75) return "stroke-green-300";
  if (prog >= 65) return "stroke-amber-500";
  if (prog >= 50) return "stroke-red-200";
  if (prog > 0) return "stroke-red-400";
  return "stroke-studoblue";
}
