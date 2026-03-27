"use client"
import {BsGridFill} from "react-icons/bs";
import {HiOutlineViewList} from "react-icons/hi";
import {useEffect, useRef, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import Link from "next/link";
import {IoIosAdd} from "react-icons/io";
import SetSearch from "@/components/app/your-files/sets/search";
import GridItems from "@/components/app/your-files/sets/griditems";
import ListItems from "@/components/app/your-files/sets/listitems";

export interface StudySetItem {
    id: string;
    title: string;
    course: string;
    studoset: boolean;
    global_term_language?: string;
    global_definition_language?: string;
    created_at: string;
    last_updated: string;
    public_set: boolean;
    displayName: string;
    img_url: string;
    user_id: string;
    folder_id: string;
    type: "studyset" | "visualset";
}

interface SetsResponse {
    studysets: Omit<StudySetItem, "type">[];
    visualsets: Omit<StudySetItem, "type">[];
}

interface GridProps {
    data: SetsResponse;
}

export default function Grid({data}: GridProps) {
    const allSets: StudySetItem[] = [
        ...data.studysets.map(s => ({...s, type: "studyset" as const})),
        ...data.visualsets.map(s => ({...s, type: "visualset" as const})),
    ];

    const [grid, setGrid] = useState<boolean>(false);
    const [filteredSets, setFilteredSets] = useState<StudySetItem[]>(allSets);
    const containerRef = useRef(null);
    const selectionRef = useRef<HTMLSelectElement>(null);
    const [AddIsOpen, setAddIsOpen] = useState(false);

    const togglePopUp = () => setAddIsOpen((prev) => !prev);
    const toggleCreate = () => setAddIsOpen((prev) => !prev);

    const filterSets = () => {
        if (selectionRef.current) {
            const value = selectionRef.current.value;
            if (value === "all") setFilteredSets(allSets);
            if (value === "recent") setFilteredSets(
                [...allSets].sort((a, b) =>
                    new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
                )
            );
            if (value === "created") setFilteredSets(
                [...allSets].sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
            );
        }
    }

    const t = useTranslations("y_f.your_sets");
    const locale = useLocale();

    return (
        <div className="w-full h-full flex flex-col gap-5 scroll-hidden overflow-x-visible">
            <div className="w-full h-20 z-20 dark:bg-gray-800 py-8 flex overflow-visible flex-row items-center justify-between gap-3">
                <div className="w-fit flex flex-row gap-5 items-center">
                    <select
                        name="sort sets"
                        ref={selectionRef}
                        defaultValue="all"
                        onChange={filterSets}
                        className="
                            px-4 sm:px-6 py-2 sm:py-2.5 rounded-full
                            border dark:border-studogrey/30 border-gray-200
                            bg-white/50 dark:bg-gray-700
                            text-studodarkblue dark:text-white
                            font-medium text-xs sm:text-sm
                            shadow-sm hover:shadow-md
                            transition-all duration-200
                            cursor-pointer w-45 text-center
                            focus:outline-none focus:ring-2 focus:ring-studogrey/50
                            appearance-none">
                        <option value="all">{t("all")}</option>
                        <option value="recent">{t("recent")}</option>
                        <option value="created">{t("created")}</option>
                    </select>
                </div>
                <div className="w-fit flex flex-row gap-5 items-center">
                    <SetSearch sets={allSets} setFilteredSets={setFilteredSets} />
                    <button
                        onClick={() => setGrid(false)}
                        className={`${!grid ? "border-studoblue dark:border-white text-studoblue dark:text-white bg-studoblue/30 dark:bg-studogrey" : "border-studoblue dark:border-white text-studoblue dark:text-white"} cursor-pointer border w-8 h-8 rounded-lg text-lg flex items-center justify-center`}
                    >
                        <HiOutlineViewList />
                    </button>
                    <button
                        onClick={() => setGrid(true)}
                        className={`${grid ? "border-studoblue bg-studoblue/30 dark:bg-studogrey dark:border-white text-studoblue dark:text-white" : "border-studoblue dark:border-white text-studoblue dark:text-white"} cursor-pointer w-8 h-8 rounded-lg border text-lg flex items-center justify-center`}
                    >
                        <BsGridFill />
                    </button>
                    <button
                        onClick={togglePopUp}
                        ref={containerRef}
                        className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300">
                        <div className="absolute bg-blue-500/50 h-8 w-8 rounded-full blur-sm"/>
                        <div className="relative z-10 shadow-2xl bg-blue-500 h-8 min-w-8 text-3xl flex items-center justify-center text-white rounded-full border border-studoborder">
                            <IoIosAdd/>
                        </div>
                        <AddPopUp
                            AddIsOpen={AddIsOpen}
                            setAddIsOpen={setAddIsOpen}
                            containerRef={containerRef}
                            toggleCreate={toggleCreate}/>
                    </button>
                </div>
            </div>
            <div className="w-full h-fit gap-2 flex flex-col">
                {filteredSets.length === 0 ? (
                    <div className="w-full h-100 flex dark:text-white text-studodarkblue font-bold items-center justify-center">
                        {allSets.length === 0 ? t("no_sets") : t("no_results")}
                    </div>
                ) : grid ? <GridItems items={filteredSets}/> : <ListItems items={filteredSets}/>
                }
            </div>
        </div>
    );
}

interface AddPopupProps {
    AddIsOpen: boolean;
    setAddIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    toggleCreate: () => void;
}

const menuItems = [
    { to: "/create-studoset", icon: "/icons/studyset.svg", label: "create_ss", color: "from-emerald-400 to-teal-500" },
    { to: "/create-visualset", icon: "/icons/visualset.svg", label: "create_vs", color: "from-blue-400 to-indigo-500" },
];

function AddPopUp({AddIsOpen, setAddIsOpen, containerRef, toggleCreate}: AddPopupProps) {
    const t = useTranslations("header");
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setAddIsOpen(false);
            }
        };

        if (AddIsOpen) {
            setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 0);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [AddIsOpen, setAddIsOpen, containerRef]);

    return (
        <div
            ref={popupRef}
            className={`absolute top-full right-0 mt-4
                z-[9999] w-55 p-2 truncate
                rounded-2xl
                bg-white/80 dark:bg-[#1e293b]/90
                backdrop-blur-xl
                border border-white/50 dark:border-white/10
                shadow-xl shadow-black/10 dark:shadow-black/30
                transition-all duration-300 ease-out origin-top
                ${AddIsOpen
                ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"}
            `}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45
                bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
                border-l border-t border-white/50 dark:border-white/10"
            />

            <div className="relative flex flex-col gap-1">
                {menuItems.map((item, index) => (
                    <Link
                        key={item.to}
                        href={item.to}
                        onClick={() => setAddIsOpen(false)}
                        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl
                            text-studodarkblue dark:text-white
                            hover:bg-gradient-to-r hover:${item.color} hover:text-white
                            transition-all duration-200 ease-out
                            ${AddIsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                        `}
                        style={{
                            transitionDelay: AddIsOpen ? `${index * 50}ms` : "0ms",
                        }}
                    >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg
                            bg-gradient-to-br ${item.color}
                            shadow-md shadow-black/10
                            group-hover:scale-110 group-hover:shadow-lg
                            transition-all duration-200`}
                        >
                            <img
                                src={item.icon}
                                alt=""
                                className="h-4 w-4 brightness-0 invert"
                            />
                        </div>

                        <span className="font-medium text-sm dark:text-white text-studodarkblue">
                            {t(item.label)}
                        </span>

                        <svg
                            className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ))}
            </div>
        </div>
    );
}