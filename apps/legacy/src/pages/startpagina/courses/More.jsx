import { Link } from "react-router-dom";
import Meer from "../../../assets/icons/more.svg";

export default function More() {
  return (
    <Link
      to="/courses"
      className="min-w-28 min-h-28 max-w-28 max-h-28
        sm:min-w-32 sm:min-h-32 sm:max-w-32 sm:max-h-32
        md:min-w-36 md:min-h-36 md:max-w-36 md:max-h-36
        lg:min-w-32 lg:min-h-32 lg:max-w-32 lg:max-h-32
        bg-studowhite gap-1.5 sm:gap-2 md:gap-3 border-1 border-transparent
        border-studoborder flex flex-col justify-center items-center
        rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-4xl
        shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe]
        p-4 sm:p-6 md:p-8 backdrop-blur-xs
        dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        border-[0.5px] border-solid dark:border-t-gray-500 dark:border-l-gray-500
        border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
        hover:scale-105 transition-transform flex-shrink-0"
    >
      <div
        className="min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 md:min-w-18 md:min-h-18 lg:min-w-16 lg:min-h-16
        dark:shadow-[8px_8px_16px_#2d343f,-8px_-8px_16px_#2d343f]
        rounded-full flex flex-col items-center justify-center bg-studowhite p-1.5 sm:p-2 md:p-3"
      >
        <img
          src={Meer}
          alt="more"
          className="h-10 sm:h-12 md:h-14 lg:h-12 dark:brightness-0 dark:invert opacity-50"
        />
      </div>
    </Link>
  );
}
