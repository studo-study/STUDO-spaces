import {IoSearch} from "react-icons/io5";
import {Ref} from "react";

interface SearchProps {
    searchRef: Ref<HTMLInputElement>;
    toggleSearch: () => void;
    Search: boolean,
    setSearch: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function SearchBar({searchRef, toggleSearch, setSearch, Search}: SearchProps) {
    const searches = localStorage.getItem('searches');
    return(
        <div className={`relative h-10 gap-5 text-white w-1/3 rounded-4xl glass-rgb transition-all duration-300 ${Search ? "border-white" : "border-studoborder/30"} border focus:border-white shadow-2xl flex justify-around`}>
            <input
                ref={searchRef}
                onClick={toggleSearch}
                placeholder={"search..."}
                onFocus={() => setSearch(true)}
                onBlur={() => setSearch(false)}
                type="text"
                className={" w-full h-full outline-none focus:ring-0"}/>
            <button className={"w-fit cursor-pointer"}>
                <IoSearch />
            </button>
            {searches && searches.length != 0 && <SearchSuggestions Search={Search} />}

        </div>
    )
}

interface SearchSuggestions{
    Search: boolean,
}
function SearchSuggestions({Search}:SearchSuggestions) {
    return (<div className={"absolute min-h-20 rounded-2xl bg-studogrey top-10 w-full"}></div>)
}