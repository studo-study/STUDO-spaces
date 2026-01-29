"use client"
import {IoSearch} from "react-icons/io5";
import {useRef, useState} from "react";
import {LastStudied} from "@/types/types";
import {useTranslations} from "next-intl";

interface SetSearchProps {
    sets: LastStudied[];
    setFilteredSets: React.Dispatch<React.SetStateAction<LastStudied[]>>;
}

export default function SetSearch({sets, setFilteredSets}: SetSearchProps) {
    const t = useTranslations("y_f.your_sets");
    const [search, setSearch] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const searching = () => {
        if (searchRef.current) {
            const query = searchRef.current.value.toLowerCase();
            if (query === "") {
                setFilteredSets(sets); // Reset naar alle sets
            } else {
                setFilteredSets(sets.filter(item =>
                    item.title.toLowerCase().includes(query)
                ));
            }
        }
    }

    return (
        <div className={`h-10 gap-5 dark:text-white w-70 rounded-4xl glass-rgb transition-all duration-300 
        ${search ? "dark:border-white border-gray-500" : "dark:border-studoborder/30 border-gray-300"} 
        border focus:border-white shadow-2xl flex justify-around`}>
            <input
                onClick={() => setSearch(true)}
                onFocus={() => setSearch(true)}
                onBlur={() => setSearch(false)}
                onChange={searching}
                ref={searchRef}
                placeholder={t("search")}
                type="text"
                className={" w-full h-full outline-none focus:ring-0"}/>
            <button className={"w-fit cursor-pointer"}>
                <IoSearch />
            </button>

        </div>
    )
}