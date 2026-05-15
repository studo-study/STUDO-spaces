import { t } from "i18next";
import Delete from "../assets/icons/delete.svg";
import { useEffect, useRef } from "react";
import useSWR from "swr";
import { del } from "../api/index.js";
import { useNavigate } from "react-router-dom";
import useSWRMutation from "swr/mutation";

export default function DeleteAccount({ deleteOpen, onClose }) {
  const popupRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (deleteOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteOpen, onClose]);

  const { trigger: triggerDelete } = useSWRMutation("users/me", del);
  const handleDelete = async () => {
    await triggerDelete();
    navigate("/welcome");
  };
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center glass-rgb">
      <div
        className={
          "w-100 h-60 z-[9999] flex flex-col items-center\n         " +
          "p-4 gap-3 font-akira text-2xl text-[#2a3a42] font-semibold\n         " +
          "rounded-3xl border border-white/30\n         " +
          "shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_rgba(255,255,255,0.5)]\n		" +
          "glass-rgb\n         " +
          "dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]"
        }
      >
        <div
          className={`flex flex-col items-baseline w-full h-full font-atrament text-[#2a3a42]
              rounded-xl shadow-md
             border-solid border-2 border-studogrey justify-center text-center
             cursor-pointer select-none transition-transform duration-300 ease-out bg-gray-300/75 p-5 gap-3 `}
        >
          <span className={"w-full"}>{t("Delete Account").toUpperCase()}</span>
          <span className={"font-sfpro text-sm mb-5"}>{t("sure")}</span>
          <div className={"w-full h-fit flex items-center justify-center"}>
            <div
              className="inline-flex font-semibold
        flex-row gap-2 justify-center items-center p-2 pl-5 pr-7 rounded-4xl cursor-pointer
        active:scale-105 transition-transform z-[2]
        border-[0.5px] border-solid border-[#8181812f]
        shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a] text-lg
        bg-white"
              onClick={handleDelete}
            >
              <img src={Delete} alt="delete-icon" className={"h-5"} />
              {t("Delete Account").toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
