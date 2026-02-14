"use client"
import {useUser} from "@/components/providers/UserProvider";
import {useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {FullStudyset} from "@/types/types";
import {IoSearch} from "react-icons/io5";
import ListItems from "@/components/app/classroom/sets/listitems";
import {mockFullStudysets, mockStudysets} from "@/data/mocks/startPageMock";


const sets = mockFullStudysets;

export default function SetsGrid() {
    const User = useUser().user;
    const selectionRef = useRef<HTMLSelectElement>(null);
    const t = useTranslations("classroom");
    const [filteredSets, setFilteredSets] = useState<FullStudyset[]>(sets);

    const [grid, setGrid] = useState<boolean>(false);
    const [search, setSearch] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const searching = () => {
        if (searchRef.current) {
            const query = searchRef.current.value.toLowerCase();
            if (query === "") {
                setFilteredSets(filteredSets); // Reset naar alle sets
            } else {

            }
        }
    }

    return (<div className={"w-full h-full flex flex-col gap-5"}>
        <div className={"w-full h-20  flex items-center justify-between gap-3 overflow-visible"}>
            <div className={"w-fit flex flex-row gap-5 items-center"}>
            </div>
            <div className={"w-fit flex flex-row gap-5 items-center"}>
                <div className={`h-10 gap-5 dark:text-white w-70 rounded-4xl glass-rgb transition-all duration-300 
        ${search ? "dark:border-white border-gray-500" : "dark:border-studoborder/30 border-gray-300"} 
        border focus:border-white shadow-2xl flex justify-around`}>
                    <input
                        onClick={() => setSearch(true)}
                        onFocus={() => setSearch(true)}
                        onBlur={() => setSearch(false)}
                        onChange={searching}
                        ref={searchRef}
                        placeholder={t("search_set")}
                        type="text"
                        className={" w-full h-full outline-none focus:ring-0"}/>
                    <button className={"w-fit cursor-pointer"}>
                        <IoSearch />
                    </button>

                </div>

            </div>
        </div>

        <div className={"w-full h-fit gap-2 flex flex-col"}>
            {filteredSets.length === 0 ? (
                <div className="w-full h-100 flex dark:text-white text-studodarkblue font-bold items-center justify-center">
                    {t("no_results")}
                </div>
            ) : sets.length === 0
                ?
                (<div className="w-full h-100 flex dark:text-white text-studodarkblue font-bold items-center justify-center">
                    {t("no_sets")}
                </div>)
                : <ListItems items={ filteredSets}/>
            }

        </div>

    </div>)
}