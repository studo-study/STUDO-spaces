"use client"
import {IoSearch} from "react-icons/io5";
import {useRef, useState} from "react";
import {useTranslations} from "next-intl";

interface UserSearchProps<T extends { displayName: string;}> {
    users: T[];
    setFilteredUsers: React.Dispatch<React.SetStateAction<T[]>>;
}

export default function UserSearch<T extends { displayName: string;}>({
                                                                                     users,
                                                                                     setFilteredUsers
                                                                                 }: UserSearchProps<T>) {
    const t = useTranslations("classroom");
    const [search, setSearch] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const searching = () => {
        if (searchRef.current) {
            const query = searchRef.current.value.toLowerCase();
            if (query === "") {
                setFilteredUsers(users);
            } else {
                setFilteredUsers(
                    users.filter((user) =>
                        user.displayName.toLowerCase().includes(query))
                );
            }
        }
    }

    return (
        <div className={`h-10 gap-5 px-5 dark:text-white w-70 rounded-4xl glass-rgb transition-all duration-300 
        ${search ? "dark:border-white border-gray-500" : "dark:border-studoborder/30 border-gray-300"} 
        border focus:border-white shadow-2xl flex justify-around`}>
            <input
                onClick={() => setSearch(true)}
                onFocus={() => setSearch(true)}
                onBlur={() => setSearch(false)}
                onChange={searching}
                ref={searchRef}
                placeholder={t("search_user")}
                type="text"
                className="w-full h-full outline-none focus:ring-0"/>
            <button className="w-fit cursor-pointer">
                <IoSearch/>
            </button>
        </div>
    )
}