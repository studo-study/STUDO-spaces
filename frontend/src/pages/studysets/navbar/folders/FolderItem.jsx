import Folder from "../../../../assets/icons/folder.svg";
import { Link } from "react-router-dom";
import ThreeDots from "../components/ThreeDots.jsx";

export default function FolderItem({ length, folder, select, onSuccess }) {
  return (
    <div className="py-3 sm:py-4 md:py-5 w-full max-h-fit bg-gray-100/50 gap-2 sm:gap-3
      border-1 border-transparent cursor-pointer
      border-studoborder flex flex-row justify-between items-center
      rounded-4xl
      shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe]
      p-4 px-4 sm:p-6 sm:px-6 md:p-10 md:px-7 backdrop-blur-xs
      dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
      border-[0.5px] border-solid transition-all duration-300
      dark:border-t-gray-500 dark:border-l-gray-500
      border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
      hover:scale-[1.01]">
      <Link
        to={`/folders/${folder.id}`}
        className="w-full cursor-pointer flex flex-row items-center justify-start gap-2 sm:gap-3 min-w-0">
        <img
          src={Folder}
          className="h-4 sm:h-5 dark:invert dark:brightness-0 opacity-50 flex-shrink-0"
          alt=""
        />
        <span className="text-base sm:text-lg md:text-xl truncate">{folder.name}</span>
      </Link>
      <div
        className={`w-fit flex items-center justify-center pr-3 md:pr-1 flex-shrink-0 ${select ? "flex" : "hidden"}`}>
        {length > 1 ? <ThreeDots id={folder.id} onSuccess={onSuccess} /> : null}
      </div>
    </div>
  );
}