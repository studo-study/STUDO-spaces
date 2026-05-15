"use client"
import {IoSearch} from "react-icons/io5";
import {Ref, useState} from "react";
import {useTranslations} from "next-intl";

interface SearchProps {
    searchRef: Ref<HTMLInputElement>;
    toggleSearch: () => void;
    Search: boolean,
    setSearch: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function SearchBar({searchRef, toggleSearch, setSearch, Search}: SearchProps) {
    const [searches] = useState<string | null>(() => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('searches');
    });
    const t = useTranslations("header");
   // const searches = ["engelse set","luc vanderhelst","2a2 EDP"];
    return(
        <div className={`relative px-5 h-10 gap-5 dark:text-white w-1/3 rounded-4xl glass-rgb transition-all duration-300 ${Search ? "dark:border-white border-gray-500" : "dark:border-studoborder/30 border-gray-300"} border focus:border-white shadow-2xl flex justify-around`}>
            <input
                ref={searchRef}
                onClick={toggleSearch}
                placeholder={t("search")}
                onFocus={() => setSearch(true)}
                onBlur={() => setSearch(false)}
                type="text"
                className={" w-full h-full outline-none focus:ring-0"}/>
            <button className={"w-fit cursor-pointer"}>
                <IoSearch />
            </button>
            {searches && searches.length != 0 && <SearchSuggestions searches={JSON.parse(searches)} />}

        </div>
    )
}

interface SearchSuggestions{
    searches: string[]
}
function SearchSuggestions({searches}:SearchSuggestions) {
    const [searchArray, setSearchArray] = useState<string[]>(searches);

    const remove = (index: number) => {
        const newSearches = searchArray.filter((_, i) => i !== index);
        setSearchArray(newSearches);
        localStorage.setItem('searches', JSON.stringify(newSearches));
    }

    return (<div className={`${searches.length != 0 ? "flex": "hidden"} absolute flex-col gap-3 h-fit rounded-2xl glass-rgb top-10 w-full p-3 py-3`}>
        {searchArray.map((search, index) => (
            <div className={"w-full px-3 rounded-xl py-2 bg-gray-700 flex justify-between items-center"} key={index}>{search}
            <div onClick={() => remove(index)}>x</div></div>
        ))}
    </div>)
}