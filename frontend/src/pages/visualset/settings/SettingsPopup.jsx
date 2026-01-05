import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { save, del, put, patch } from "../../../api/index.js";
import { useNavigate } from "react-router-dom";


export default function SettingsPopup({ toggled, setPopUpToggle, isOwner, isPublic, sessionId, setId }) {
  const { t } = useTranslation();
  const popupRef = useRef(null);
  const [publicSet, setPublicSet] = useState(isPublic);
  const [isResetting, setIsResetting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const { trigger: triggerUpdateSet, isMutating: isUpdating } = useSWRMutation(`visualsets/${setId}`, put);

  useEffect(() => {
    setPublicSet(isPublic);
  }, [isPublic]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopUpToggle(false);
        setShowDeleteConfirm(false);
      }
    };

    if (toggled) {
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [toggled, setPopUpToggle]);

  useEffect(() => {
    if (!toggled) {
      setShowDeleteConfirm(false);
    }
  }, [toggled]);

  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  const togglePublic = async () => {
    if (!isOwner || isUpdating) return;

    const newValue = !publicSet;


    try {
      const payload = { public_set: newValue };
      if (!payload.images?.length) delete payload.images;
      if (!payload.pins?.length) delete payload.pins;
      await triggerUpdateSet(payload);
      setPublicSet(newValue);
      mutate(`visualsets/${setId}`);
    } catch (error) {

    }
  };

  const handleResetProgress = async () => {
    if (!sessionId || isResetting) return;

    setIsResetting(true);
    try {
      await put(`studysessions/${sessionId}/reset`, {});
      mutate(`visualsets/${setId}`);
      setPopUpToggle(false);
    } catch (error) {
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteVisualset = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      await del(`visualsets/${setId}`, {});
      setPopUpToggle(false);
      setTimeout(() => navigate("/home"), 500);
    } catch (error) {
    }
  };


  return (
    <div
      ref={popupRef}
      onClick={handlePopupClick}
      className={`${toggled ? "opacity-100" : "opacity-0 pointer-events-none"}
        absolute w-80 min-h-80 max-h-96 rounded-4xl z-[99999] mt-106 overflow-y-scroll
        flex flex-col justify-baseline items-center p-4 scroll-hidden pb-5.5
        shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
        bg-[rgba(224,224,224,0.2)] backdrop-blur-md
        dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        transition-all duration-300 gap-3
      `}
    >
      <span className="text-2xl font-atrament font-semibold dark:text-white">
        {t("Settings").toUpperCase()}
      </span>

      <div className="w-full h-fit flex flex-col gap-5">

        {isOwner && (
          <div className="w-full flex flex-col gap-2">
                <span className="text-sm font-medium dark:text-white">
          {t("Set Visibility:")}
        </span>

            <div className="w-full flex flex-row justify-between items-center p-4
            bg-studowhite rounded-2xl border-2 border-studowhite shadow-sm">
              <div className="flex flex-col">
              <span className="font-medium text-sm truncate dark:text-white">
                {t("Public set")}
              </span>
              </div>
              <button
                onClick={togglePublic}
                disabled={isUpdating}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 
                ${publicSet ? "bg-green-500" : "bg-gray-400"}
                ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                aria-label={publicSet ? t("Make private") : t("Make public")}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md 
                  transition-transform duration-300
                  ${publicSet ? "translate-x-8" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        )}


        <div className="w-full flex flex-col gap-3">
          <span className="text-sm font-medium dark:text-white">
            {t("Study Progress:")}
          </span>

          <button
            onClick={handleResetProgress}
            disabled={!sessionId || isResetting}
            className={`w-full p-4 text-sm font-medium text-white bg-amber-500/70
              hover:bg-amber-500 rounded-2xl truncate shadow-md border-solid
              border-2 border-studowhite transition-all duration-500
              ${(!sessionId || isResetting) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {isResetting ? t("Resetting...") : t("Reset Progress")}
          </button>
        </div>

        {isOwner && (
          <div className="w-full flex flex-col gap-3">
        <span className="text-sm font-medium dark:text-white">
          {t("Delete ((visualset)):")}
        </span>


            <button
              onClick={handleDeleteVisualset}
              className={`w-full p-4 text-sm font-medium text-white bg-red-400/50
              hover:bg-red-500 rounded-2xl truncate shadow-md border-solid
              border-2 border-studowhite
              transition-all duration-500
              ${(!sessionId || isResetting) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {t("Delete Visualset")}
            </button>
          </div>
        )
        }
      </div>
    </div>
  );
}