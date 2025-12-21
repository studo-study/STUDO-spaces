import { useTranslation } from "react-i18next";
import ClassroomItem from "./ClassroomItem.jsx";
import { useRef, useEffect } from "react";
import useSWR from "swr";

export default function ClassroomPopup({ toggled, toggleSave, selectedClassrooms, setPopUpToggle }) {
  const { t } = useTranslation();
  const popupRef = useRef(null);

  const {
    data: classroomsData = { classrooms: [] },
    isLoading,
    error
  } = useSWR("users/me/classrooms");

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

  const classrooms = classroomsData?.classrooms || [];

  return (
    <>

      <div
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300
          ${toggled ? "opacity-100 visible flex md:hidden" : "opacity-0 invisible"}`}
        onClick={() => setPopUpToggle(false)}
      />


      <div
        ref={popupRef}
        onClick={handlePopupClick}
        className={`fixed z-[9999] flex flex-col justify-start items-center p-4 sm:p-5
          rounded-t-3xl sm:rounded-4xl md:top-65 md:right-146
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
          {t("add to classroom").toUpperCase()}
        </span>

        <div className="w-full flex-1 overflow-y-auto flex flex-col gap-2
          scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
          rounded-xl pr-1 scroll-hidden">

          {isLoading && (
            <div className="w-full p-4 text-center text-xs sm:text-sm opacity-60 dark:text-gray-400">
              {t("Loading classrooms...")}
            </div>
          )}

          {error && (
            <div className="w-full p-4 text-center text-xs sm:text-sm text-red-500">
              {t("Error loading classrooms")}
            </div>
          )}

          {!isLoading && !error && classrooms.length === 0 && (
            <div className="w-full p-4 text-center text-xs sm:text-sm opacity-60 dark:text-gray-400">
              {t("You are not in any classrooms yet")}
            </div>
          )}

          {!isLoading && !error && classrooms.map((classroom) => (
            <ClassroomItem
              key={classroom.id}
              classroom={classroom}
              isSelected={selectedClassrooms.includes(classroom.id)}
              onToggle={() => toggleSave(classroom.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}