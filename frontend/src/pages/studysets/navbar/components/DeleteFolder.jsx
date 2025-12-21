import studyset from "../../../../../public/assets/icons/studyset.svg";
import visual from "../../../../../public/assets/icons/visualset.svg";
import folder from "../../../../../public/assets/icons/delete.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { del } from "../../../../api/index.js";
import useSWRMutation from "swr/mutation";
import reactRefresh from "eslint-plugin-react-refresh";

export default function DeleteFolder({ isOpen, onClose, id, onSuccess }) {
  const { t } = useTranslation();
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const { trigger, isMutating } = useSWRMutation(`folders/${id}`, del);

  const handleDeleteFolder = async () => {
    try {
      await trigger();
      await onSuccess();
      onClose();
    } catch (error) {
    }
  };
  return (
    <div
      ref={popupRef}
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-3
        flex flex-col items-center gap-2 p-1 z-[99999]
        font-akira text-2xl font-semibold text-[#2a3a42]
        rounded-3xl border border-white/30
        shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]
        bg-[rgba(224,224,224,0.2)] backdrop-blur-md
        dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        transition-all duration-300 ease-in-out origin-top
        ${isOpen
        ? "opacity-100 scale-100 visible pointer-events-auto"
        : "opacity-0 scale-95 invisible pointer-events-none"}
      `}
    >
      <div className="w-full">
        <div className="flex items-center justify-start w-32 h-8 font-atrament text-[#2a3a42]
               text-base
              cursor-pointer select-none transition-transform duration-300 ease-out
              hover:scale-105 dark:text-white" onClick={handleDeleteFolder}>
          <img src={folder} alt="" className="h-4 ml-3 mr-2 dark:invert dark:brightness-0" />
          {t("DELETE FOLDER")}
        </div>
      </div>
    </div>
  );
}
