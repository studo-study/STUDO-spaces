import SearchIcon from "../../../assets/icons/search.svg";
import Close from "../../../assets/icons/close.svg";
import SearchBarContent from "./SearchBarContent.jsx";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SearchBar({
  toggleSearch,
  searchvalue,
  setSearchvalue,
}) {
  const { t, i18n } = useTranslation();
  const outerBtn = useRef(null);
  const triggerBtn = useRef(null);
  const content = useRef(null);
  const [triggered, setTriggered] = useState(false);

  const triggerSearch = () => {
    if (triggered) {
      if (searchvalue.trim()) {
        toggleSearch(searchvalue);
      }
    } else {
      content.current.classList.remove("hidden");
      content.current.classList.add("flex");
      setTriggered(true);
    }
  };

  return (
    <div className="w-full min-w-22 h-22 flex hidden md:flex justify-end items-center pr-10">
      <div
        ref={outerBtn}
        className={`h-12 glass-rgb
             shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
             rounded-4xl flex justify-between items-center
             dark:shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#1a1a2a]
             border-[0.5px] border-solid
             dark:border-t-gray-500 dark:border-l-gray-500
               border-1 border-solid border-gray-200
  dark:border-[#8181812f] dark:border-t-[#ffffff] dark:border-l-[#f2f2f
             transition-all duration-500 ease-in-out
             ${triggered ? "w-80 px-3" : "w-12 justify-center"}
        `}
      >
        <img
          ref={triggerBtn}
          src={SearchIcon}
          className="w-6 h-auto cursor-pointer dark:invert dark:brightness-0"
          alt="search icon"
          onClick={triggerSearch}
        />

        <SearchBarContent
          ref={content}
          className={`${triggered ? "flex opacity-100" : "hidden opacity-0"} transition-opacity duration-500`}
          triggered={triggered}
          setTriggered={setTriggered}
          toggleSearch={toggleSearch}
          searchvalue={searchvalue}
          setSearchvalue={setSearchvalue}
        />
      </div>
    </div>
  );
}
