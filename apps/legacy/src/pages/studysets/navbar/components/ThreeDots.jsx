import Dots from "../../../../assets/icons/3dots.svg";
import { useState } from "react";
import DeleteFolder from "./DeleteFolder.jsx";

export default function ThreeDots({ id, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen((isOpen) => !isOpen);
  const closePopup = () => setIsOpen(false);
  return (
    <div className="fixed z-[9999]">
      <div
        className={
          "h-10 w-10 rounded-full flex items-center  z-[9999] justify-center border border-studogrey/30\n" +
          "    bg-white dark:bg-gray-700\n" +
          "    text-studodarkblue dark:text-white\n" +
          "    font-medium text-sm\n" +
          "    shadow-sm hover:shadow-md\n" +
          "    transition-all duration-200\n" +
          "    cursor-pointer\n" +
          "    focus:outline-none active:scale-105 transition-transform z-[2] select-none focus:ring-2 focus:ring-studogrey/50"
        }
        onClick={toggleOpen}
      >
        <img
          src={Dots}
          alt="3dots"
          className={
            "rotate-90 w-8 dark:invert dark:brightness-0 cursor-pointer opacity-50"
          }
        />
      </div>
      <DeleteFolder
        isOpen={isOpen}
        onClose={closePopup}
        id={id}
        onSuccess={onSuccess}
      />
    </div>
  );
}
