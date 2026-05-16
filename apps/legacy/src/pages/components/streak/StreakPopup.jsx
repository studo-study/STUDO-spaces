import { t } from "i18next";

export default function StreakPopup({ hovering, streak }) {
  return (
    <div
      className={`${
        hovering
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      } transition-all duration-300 ease-out
      min-w-fit text-center whitespace-nowrap
      backdrop-blur-xl  bg-gray-800/90
      text-gray-100
      font-sfpro text-sm px-3 py-1.5 rounded-xl`}
    >
      {t("{{streak}} day streak", { streak: streak })}
    </div>
  );
}
