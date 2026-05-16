import SearchBar from "./search_header/Search_Bar.jsx";
import Burger from "./burger/Burger.jsx";
import { useState, useCallback, useEffect } from "react";
import AddPopUp from "./right_header/AddPopUp.jsx";
import ProfilePopUp from "./right_header/ProfilePopUp.jsx";
import Searcher from "./searcher/Searcher.jsx";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import Left_Header from "./left_header/Left_Header.jsx";
import Right_Header from "./right_header/Right_Header.jsx";
import CreateFolder from "../../pages/create-folder/CreateFolder.jsx";

export default function Header({ headerData }) {
  const id = import.meta.env.VITE_USER_ID;
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [triggerPopup, setTriggerPopup] = useState(false);
  const [triggerAddPop, setTriggerAddPop] = useState(false);
  const [searchvalue, setSearchvalue] = useState("");

  const navigate = useNavigate();

  const toggleBurger = () => setIsBurgerOpen((prev) => !prev);
  const togglePopup = () => setTriggerPopup((prev) => !prev);
  const toggleAddPop = () => setTriggerAddPop((prev) => !prev);
  const closePopup = () => setTriggerPopup(false);
  const closeAddPop = () => setTriggerAddPop(false);

  const [searchQuery, setSearchQuery] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const {
    data: searchData = {},
    isLoading: isSearchLoading,
    error: searchError,
  } = useSWR(`search/${id}/${searchQuery}`);

  useEffect(() => {
    if (searchData && !isSearchLoading && searchQuery) {
      navigate(`/search?q=${searchQuery}`, {
        state: {
          query: searchQuery,
          results: searchData,
        },
      });
      setIsSearching(false);
      setSearchQuery(null);
    }
  }, [searchData, isSearchLoading, searchQuery, navigate]);

  useEffect(() => {
    if (searchError) {
      setIsSearching(false);
      setSearchQuery(null);
    }
  }, [searchError]);

  const toggleSearch = (query) => {
    if (!query || query.trim() === "") return;
    setIsSearching(true);
    setSearchQuery(query);
  };

  return (
    <div className="w-screen fixed top-0 left-0 flex m-0 flex-col z-[999]">
      <Searcher searching={isSearching} />
      <div className="flex flex-row justify-between items-center h-fit w-full p-2 sm:p-4 z-[999] m-0 gap-2">
        <Left_Header onBurgerClick={toggleBurger} />
        <SearchBar
          toggleSearch={toggleSearch}
          searchvalue={searchvalue}
          setSearchvalue={setSearchvalue}
        />
        <ProfilePopUp
          isOpen={triggerPopup}
          onClose={closePopup}
          headerData={headerData}
        />
        <Right_Header
          onPopupClick={togglePopup}
          onAddClick={toggleAddPop}
          user={headerData}
        />
        <AddPopUp isOpen={triggerAddPop} onClose={closeAddPop} />
        <Burger isOpen={isBurgerOpen} setIsOpen={setIsBurgerOpen} />
      </div>
    </div>
  );
}
