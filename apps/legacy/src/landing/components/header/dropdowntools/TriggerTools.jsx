import { useRef } from "react";
import ToggleImg from "../../../../assets/icons/down.svg";
import { t } from "i18next";
import ToolsPopup from "./ToolsPopup.jsx";

export default function TriggerTools({ ToolsOpen, setToolsOpen }) {
  const containerRef = useRef(null);

  const togglePopUp = () => {
    setToolsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className={"relative w-fit h-fit flex flex-row gap-3 cursor-pointer"}
      onClick={togglePopUp}
    >
      <img
        src={ToggleImg}
        className={`${ToolsOpen ? "rotate-180" : ""} transition-all duration-300 dark:brightness-0 dark:invert h-7`}
        alt=""
      />
      <span>{t("Study Tools")}</span>
      <ToolsPopup
        MethodsOpen={ToolsOpen}
        setMethodsOpen={setToolsOpen}
        triggerRef={containerRef}
      />
    </div>
  );
}
