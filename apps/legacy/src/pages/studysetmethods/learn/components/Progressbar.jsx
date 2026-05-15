import { useTranslation } from "react-i18next";

export default function Progressbar({ current, total, accuracy }) {
  const { t } = useTranslation();
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium opacity-70">Voortgang</span>
        <span className="opacity-50">
          {current} / {total}
        </span>
      </div>

      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {accuracy !== undefined && (
        <div className="flex justify-end">
          <span
            className={`text-xs font-medium ${
              accuracy >= 80
                ? "text-green-600 dark:text-green-400"
                : accuracy >= 60
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-red-600 dark:text-red-400"
            }`}
          >
            {accuracy}% correct
          </span>
        </div>
      )}
    </div>
  );
}
