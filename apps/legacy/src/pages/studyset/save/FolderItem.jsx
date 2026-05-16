import Folder from "../../../assets/icons/folder.svg";
import { useTranslation } from "react-i18next";

export default function FolderItem({ folder, isSelected, onToggle }) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onToggle}
      className={`flex items-center w-full p-3 pl-4 pr-4 max-h-15 min-h-15
        rounded-xl shadow-sm cursor-pointer select-none
        transition-all duration-300 gap-3
             border-2
             ease-out
        ${
          isSelected
            ? "bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-400  dark:border-emerald-600"
            : "border-solid border-2 border-studogrey hover:bg-gray-50 dark:hover:bg-gray-600"
        }`}
    >
      <img
        src={Folder}
        alt=""
        className={`h-5 ${isSelected ? "" : "opacity-60"} dark:invert dark:brightness-0`}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <span
          className={`text-sm truncate dark:text-white ${isSelected ? "font-medium" : ""}`}
        >
          {folder.name || folder.title || t("Unnamed folder")}
        </span>
        {folder.set_count !== undefined && (
          <span className="text-xs opacity-50 dark:text-gray-400">
            {folder.set_count} {folder.set_count === 1 ? t("set") : t("sets")}
          </span>
        )}
      </div>
    </div>
  );
}
