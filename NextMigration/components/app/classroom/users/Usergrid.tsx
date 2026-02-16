"use client"
import {mockClassroomUsers} from "@/data/mocks/classroomsMock";
import {IoClose, IoSearch} from "react-icons/io5";
import {useRef, useState} from "react";
import {ClassroomUser} from "@/types/types";
import {useTranslations} from "next-intl";
import { FaCheck } from "react-icons/fa6";
import {User} from "next-auth";
import Image from "next/image";
import Link from "next/link";

const users = mockClassroomUsers;

export default function Usergrid(){
    const t = useTranslations("classroom");
    const [filteredSets, setFilteredSets] = useState<ClassroomUser[]>(users);
    const [search, setSearch] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const searching = () => {
        if (searchRef.current) {
            const query = searchRef.current.value.toLowerCase();
            if (query === "") {
                setFilteredSets(filteredSets);
            } else {

            }
        }
    }

    return(<div className={"w-full h-full flex flex-col"}>
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
                        placeholder={t("search_user")}
                        type="text"
                        className={" w-full h-full outline-none focus:ring-0"}/>
                    <button className={"w-fit cursor-pointer"}>
                        <IoSearch />
                    </button>

                </div>

            </div>
        </div>
        <div className={"w-full h-fit flex flex-col gap-5 mb-10"}>
            <span className={"font-bold text-lg dark:text-white text-studodarkblue"}>{t("requests")}:</span>
            {joinRequest(t)}
        </div>

        <div className="w-full flex flex-col gap-5">
    <span className="font-bold text-lg dark:text-white text-studodarkblue">
        {t("users")}:
    </span>
            <div className="w-full max-h-120 overflow-y-auto flex flex-col gap-5 scroll-hidden pb-20">
                {users.map((user, i) => (
                    <UserItem key={i} t={t} user={user} />
                ))}
            </div>
        </div>
    </div>)
}

interface UserItemProps {
    t: any;
    user: ClassroomUser;
}
function joinRequest(t: any) {
    return (<div className={`max-h-15 h-15 px-3 max-w-full min-w-full cursor-pointer justify-between
                 flex gap-3 shadow-2xl items-center w-full rounded-full bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 overflow-hidden`}
    >
        <div className={"w-fit flex flex-row gap-5 items-center"}>
            <div className={"w-10 h-10 bg-studoblue rounded-full"}/>
            <span className={"dark:text-white text-studodarkblue"}> {"username"} {" "} {t("w_l_t_j")}</span>
        </div>
        <div className={"w-fit flex flex-row items-center gap-5 dark:text-white text-studodarkblue"}>
            <button className={"cursor-pointer active:scale-95 transition-all duration-300 w-10 h-10 rounded-full bg-studogrey items-center justify-center flex"}><FaCheck size={18}/></button>
            <button className={"cursor-pointer active:scale-95 transition-all duration-300 w-10 h-10 rounded-full bg-studogrey items-center justify-center flex"}><IoClose size={25}/></button>
        </div>
    </div>)
}
function UserItem({t, user}: UserItemProps) {
    return (<Link href={"/profile/" + user.user_id}  className={`max-h-22 min-h-22 flex-col sm:flex-row px-6 pl-4 py-4 sm:py-0 max-w-full min-w-full cursor-pointer
                 flex gap-3 shadow-2xl items-center w-full rounded-full bg-studogrey/10 border border-studogrey/20 
                 hover:border-studogrey/40 transition-all duration-300 overflow-hidden`}>
        <div className={"min-w-15 min-h-15 rounded-full bg-studogrey"}>
            <Image
                src={user.img_url}
                alt="pfp"
                width={0}
                height={0}
                className="object-cover h-fit"
            />
        </div>
       <div className={"w-full flex flex-col"}>
           <div className={"w-fit flex items-center text-studodarkblue dark:text-white gap-3"}>
               <span className={"w-fit flex items-center"}>{user.displayName}</span>
               •
               {user.streak >= 5 &&
				   <div className={"w-fit flex flex-row items-center gap-0.5"}>
					   <span className={"text-studodarkblue dark:text-white"}>{user.streak} </span>
					   <img src={"/icons/streak2.svg"} alt="streak" className="h-5" /></div>
               }
           </div>
           <span className={"text-studodarkblue/30 dark:text-white/30 text-sm"}>
              {t("joined")} {new Date(user.joined_at).toLocaleDateString()}
           </span>
       </div>
        {user.role === "teacher" &&  <span className={"w-fit text-studodarkblue/30 border-2 border-studoborder bg-studogrey/20 px-3 py-1 rounded-full dark:text-white/30"}>{user.role}</span>}
    </Link>)
}