import Classroom from "../../../assets/icons/classroom.svg";
import { useTranslation } from "react-i18next";

export default function ClassroomItem({ classroom, isSelected, onToggle }) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onToggle}
      className={`flex items-center w-full p-3 pl-4 pr-4 max-h-15 min-h-15
        rounded-xl shadow-sm cursor-pointer select-none
        transition-all duration-300 gap-3
        border-2 ease-out
        ${isSelected
        ? "bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600"
        : "border-solid border-2 border-studogrey hover:bg-gray-50 dark:hover:bg-gray-600"
      }`}
    >
      <img
        src={Classroom}
        alt=""
        className={`h-5 ${isSelected ? "" : "opacity-60"} dark:invert dark:brightness-0`}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <span className={`text-sm truncate dark:text-white ${isSelected ? "font-medium" : ""}`}>
          {classroom.name || classroom.title || t("Unnamed classroom")}
        </span>
        {classroom.member_count !== undefined && (
          <span className="text-xs opacity-50 dark:text-gray-400">
            {classroom.member_count} {classroom.member_count === 1 ? t("member") : t("members")}
          </span>
        )}
      </div>
    </div>
  );
}