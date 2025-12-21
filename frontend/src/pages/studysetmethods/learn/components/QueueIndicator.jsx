import { useTranslation } from "react-i18next";

export default function QueueIndicator({ queueLength, nextCheckIn }) {
  const { t } = useTranslation();

  if (queueLength === 0) return null;

  return (
    <div className="w-full rounded-xl p-3 flex items-center justify-between
      bg-orange-50 border border-orange-200
      dark:bg-orange-900/10 dark:border-orange-800">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {queueLength}
        </div>
        <div className="text-sm">
          <p className="font-medium text-orange-900 dark:text-orange-400">
            {queueLength === 1 ? "1 kaart" : `${queueLength} kaarten`} moet herhaald
          </p>
          <p className="text-xs opacity-60">
            Over {nextCheckIn} {nextCheckIn === 1 ? "kaart" : "kaarten"}
          </p>
        </div>
      </div>
      <div className="text-xl">📚</div>
    </div>
  );
}