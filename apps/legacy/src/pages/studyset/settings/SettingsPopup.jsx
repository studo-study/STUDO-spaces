import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { save, del, put } from "../../../api/index.js";
import { useNavigate } from "react-router-dom";

export default function SettingsPopup({
  toggled,
  setPopUpToggle,
  isOwner,
  isPublic,
  sessionId,
  setId,
}) {
  const { t } = useTranslation();
  const popupRef = useRef(null);
  const [publicSet, setPublicSet] = useState(isPublic);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const navigate = useNavigate();

  const { trigger: triggerUpdateSet, isMutating: isUpdating } = useSWRMutation(
    `studysets`,
    save,
  );

  useEffect(() => {
    setPublicSet(isPublic);
  }, [isPublic]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopUpToggle(false);
        setShowResetConfirm(false);
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

  useEffect(() => {
    if (!toggled) {
      setShowResetConfirm(false);
    }
  }, [toggled]);

  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  const togglePublic = async () => {
    if (!isOwner || isUpdating) return;

    const newValue = !publicSet;

    try {
      await triggerUpdateSet({ id: setId, public_set: newValue });
      setPublicSet(newValue);
      mutate(`studysets/${setId}`);
    } catch (error) {}
  };

  const handleResetProgress = async () => {
    if (!sessionId || isResetting) return;

    setIsResetting(true);
    try {
      await put(`studysessions/${sessionId}/reset`, {});
      mutate(`studysets/${setId}`);
      setShowResetConfirm(false);
      setPopUpToggle(false);
    } catch (error) {
    } finally {
      setIsResetting(false);
    }
  };

  //TODO
  const handleDeleteStudyset = async () => {
    try {
      await del(`studysets/${setId}`, {});
      setPopUpToggle(false);
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <div
        className={`fixed md:block inset-0 bg-black/50 z-[9998] transition-opacity flex md:hidden duration-300
          ${toggled ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setPopUpToggle(false)}
      />

      <div
        ref={popupRef}
        onClick={handlePopupClick}
        className={`fixed z-[9999] flex flex-col justify-start items-center p-4 sm:p-5
          rounded-t-3xl sm:rounded-4xl md:top-65 md:right-120
          w-full sm:w-80 max-h-[85vh] sm:max-h-[500px]
          shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
          bg-[rgba(224,224,224,0.2)] backdrop-blur-md
          dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
          transition-all duration-300 ease-out gap-3
          overflow-y-auto scroll-hidden pb-5
          
          bottom-0 left-0 right-0
          sm:bottom-auto sm:left-auto sm:right-10 sm:top-28
          
          ${
            toggled
              ? "translate-y-0 sm:translate-y-0 opacity-100 visible pointer-events-auto"
              : "translate-y-full sm:translate-y-0 opacity-0 invisible pointer-events-none"
          }`}
      >
        <span className="text-xl sm:text-2xl font-atrament font-semibold dark:text-white text-center">
          {t("Settings").toUpperCase()}
        </span>

        <div className="w-full h-fit flex flex-col gap-4 sm:gap-5">
          {isOwner && (
            <div className="w-full flex flex-col gap-2">
              <span className="text-xs sm:text-sm font-medium dark:text-white">
                {t("Set Visibility:")}
              </span>

              <div
                className="w-full flex flex-row justify-between items-center p-3 sm:p-4
                bg-studowhite rounded-2xl border-2 border-studowhite shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm truncate dark:text-white">
                    {t("Public set")}
                  </span>
                </div>
                <button
                  onClick={togglePublic}
                  disabled={isUpdating}
                  className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300 flex-shrink-0
                    ${publicSet ? "bg-green-500" : "bg-gray-400"}
                    ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  aria-label={publicSet ? t("Make private") : t("Make public")}
                >
                  <div
                    className={`absolute top-0.5 sm:top-1 w-5 h-5 bg-white rounded-full shadow-md 
                      transition-transform duration-300
                      ${publicSet ? "translate-x-6 sm:translate-x-8" : "translate-x-0.5 sm:translate-x-1"}`}
                  />
                </button>
              </div>
            </div>
          )}

          <div className="w-full flex flex-col gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium dark:text-white">
              {t("Study Progress:")}
            </span>

            <button
              onClick={handleResetProgress}
              disabled={!sessionId || isResetting}
              className={`w-full p-3 sm:p-4 text-xs sm:text-sm font-medium text-white bg-amber-500/70
                hover:bg-amber-500 rounded-2xl truncate shadow-md border-solid
                border-2 border-studowhite
                transition-all duration-500
                ${!sessionId || isResetting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {t("Reset Progress")}
            </button>
          </div>

          {isOwner && (
            <div className="w-full flex flex-col gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-medium dark:text-white">
                {t("Delete studoset:")}
              </span>

              <button
                onClick={handleDeleteStudyset}
                className="w-full p-3 sm:p-4 text-xs sm:text-sm font-medium text-white bg-red-400/50
                  hover:bg-red-500 rounded-2xl truncate shadow-md border-solid
                  border-2 border-studowhite
                  transition-all duration-500 cursor-pointer"
              >
                {t("Delete Studyset")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
