import SearchIcon from "../../../assets/icons/search.svg";
import Close from "../../../assets/icons/close.svg";
import { useRef } from "react";
import { useAuth } from "../../../contexts/auth.js";
import { useNavigate } from "react-router-dom";

export default function Searchpart({ isOpen }) {
  const search = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!search.current?.value.trim()) return;

    navigate(`/search?q=${search.current.value}`);
    isOpen(false);
    clearSearch();
  };

  const clearSearch = () => {
    search.current.value = "";
  };

  return (
    <div
      className="flex flex-row items-center gap-3 px-5 py-2 bg-studogrey
                 rounded-xl text-md transition-all duration-200
                 border-2 border-studogrey text-studodarkblue
                 dark:text-white"
    >
      <img className="h-4 w-4 dark:invert" src={SearchIcon} alt="search icon" />

      <input
        type="text"
        ref={search}
        placeholder="Search..."
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-full bg-transparent focus:outline-none"
      />

      <img
        className="h-4 w-4 cursor-pointer dark:invert"
        src={Close}
        alt="clear icon"
        onClick={clearSearch}
      />
    </div>
  );
}
