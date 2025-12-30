import Plus from "../../../assets/icons/plus.svg";
import { useTranslation } from "react-i18next";
import FolderItem from "./FolderItem.jsx";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import useSWR from "swr";

export default function SavePopUp({ toggled, toggleSave, saved, selectedFolder, setPopUpToggle }) {
  const { t } = useTranslation();
  const popupRef = useRef(null);

  const {
    data: foldersData = { folders: [] },
    isLoading,
    error
  } = useSWR("folders/me");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopUpToggle(false);
      }
    };

    if (toggled) {
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      document.body.style.overflow = "hidden";

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "unset";
      };
    }
  }, [toggled, setPopUpToggle]);

  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  const folders = foldersData?.folders || [];

  return (
    <>

      <div
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300
          ${toggled ? "opacity-100 visible md:hidden flex" : "opacity-0 invisible"}`}
        onClick={() => setPopUpToggle(false)}
      />


      <div
        ref={popupRef}
        onClick={handlePopupClick}
        className={`fixed z-[9999] flex flex-col justify-start items-center p-4 sm:p-5
          rounded-t-3xl sm:rounded-4xl md:top-65 md:right-159
          w-full sm:w-80 max-h-[80vh] sm:max-h-80 min-h-[400px] sm:min-h-80
          shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
          bg-[rgba(224,224,224,0.2)] backdrop-blur-md
          dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
          transition-all duration-300 ease-out gap-3
          
          bottom-0 left-0 right-0
          sm:bottom-auto sm:left-auto sm:right-10 sm:top-28
          
          ${toggled
          ? "translate-y-0 sm:translate-y-0 opacity-100 visible pointer-events-auto"
          : "translate-y-full sm:translate-y-0 opacity-0 invisible pointer-events-none"
        }`}>
        <span className="text-xl sm:text-2xl font-atrament font-semibold dark:text-white text-center">
          {t("Save in folder").toUpperCase()}
        </span>

        <Link to="/create-folder" className="w-full" onClick={() => setPopUpToggle(false)}>
          <div className="flex items-center w-full p-3 sm:p-4 px-4 sm:px-5 font-atrament text-sm sm:text-base text-[#2a3a42]
            bg-studogrey rounded-xl shadow-md
            border-solid border-2 border-studogrey gap-2
            cursor-pointer select-none transition-transform duration-300 ease-out hover:scale-[1.02]">
            <img src={Plus} alt="plus" className="h-5 sm:h-6 dark:invert dark:brightness-0 flex-shrink-0" />
            <span className="font-sfpro text-sm sm:text-base dark:text-white truncate">
              {t("Create new folder")}
            </span>
          </div>
        </Link>

        <div className="w-full flex-1 overflow-y-auto flex flex-col gap-2
          scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
          rounded-xl pr-1 scroll-hidden">

          {isLoading && (
            <div className="w-full p-4 text-center text-xs sm:text-sm opacity-60 dark:text-gray-400">
              {t("Loading folders...")}
            </div>
          )}

          {error && (
            <div className="w-full p-4 text-center text-xs sm:text-sm text-red-500">
              {t("Error loading folders")}
            </div>
          )}

          {!isLoading && !error && folders.length === 0 && (
            <div className="w-full p-4 text-center text-xs sm:text-sm opacity-60 dark:text-gray-400">
              {t("No folders yet. Create one to organize your sets!")}
            </div>
          )}

          {!isLoading && !error && folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              isSelected={selectedFolder === folder.id}
              onToggle={() => toggleSave(folder.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}