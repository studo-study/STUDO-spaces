import { useRef } from "react";
import ToggleImg from "../../../../../public/assets/icons/down.svg";
import { t } from "i18next";
import MethodsPopUp from "./MethodsPopUp.jsx";

export default function TriggerMethods({ MethodsOpen, setMethodsOpen }) {
  const containerRef = useRef(null);

  const togglePopUp = () => {
    setMethodsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className={"relative w-fit h-fit flex flex-row gap-3 cursor-pointer"}
      onClick={togglePopUp}
    >
      <img
        src={ToggleImg}
        className={`${MethodsOpen ? "rotate-180" : ""} transition-all duration-300 dark:brightness-0 dark:invert h-7`}
        alt=""
      />
      <span>{t("Learn Modes")}</span>
      <MethodsPopUp
        MethodsOpen={MethodsOpen}
        setMethodsOpen={setMethodsOpen}
        triggerRef={containerRef}
      />
    </div>
  );
}