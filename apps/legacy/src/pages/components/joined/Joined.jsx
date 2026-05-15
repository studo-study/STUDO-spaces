import { t } from "i18next";
import { useState } from "react";
import JoinedPopup from "./JoinedPopup.jsx";

export default function Joined({ number }) {
  const [hovering, setHovering] = useState(false);
  const hoverToggle = () => {
    setHovering((hoveringJoined) => !hoveringJoined);
  };
  return (
    <div className="relative ml-2 flex items-center">
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3">
        <JoinedPopup hovering={hovering} number={number} />
      </div>
      <span
        className="flex flex-col items-center text-studodarkblue dark:text-white cursor-pointer"
        onMouseOver={hoverToggle}
        onMouseLeave={hoverToggle}
      >
        #
      </span>
    </div>
  );
}
