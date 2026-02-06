"use client"

import {useRef, useState} from "react";
import {type Classroom, FullClassroom, LastStudied} from "@/types/types";
import {useLocale, useTranslations} from "next-intl";
import SetSearch from "@/components/app/your-files/sets/search";
import {HiOutlineViewList} from "react-icons/hi";
import {BsGridFill} from "react-icons/bs";
import {IoIosAdd} from "react-icons/io";
import SetItem from "@/components/app/SetItem";
import ClassSearch from "@/components/app/classrooms/search";
import {mockClassrooms, mockFullClassrooms} from "@/data/mocks/classroomsMock";
import ClassroomOverviewItem from "@/components/app/classrooms/ClassroomOverviewItem";
import {useUser} from "@/components/providers/UserProvider";
const classrooms: FullClassroom[] = mockFullClassrooms

export default function ClassroomGrid() {
    const User = useUser().user;
    const selectionRef = useRef<HTMLSelectElement>(null);
    const t = useTranslations("classrooms");
    const [filteredClasses, setFilteredClasses] = useState<FullClassroom[]>(classrooms);

    const filterClasses = () => {
        if(selectionRef.current && User) {
            const value = selectionRef.current.value;
            if(value ==="all") setFilteredClasses(classrooms);
            if(value === "alphabetical") setFilteredClasses(
                classrooms.toSorted((a, b) =>
                    a.name.localeCompare(b.name)
                )
            );
            if (value === "last") {
                setFilteredClasses(
                    classrooms.toSorted((a, b) => {
                        const userA = a.users.find(u => u.user_id === User.id);
                        const userB = b.users.find(u => u.user_id === User.id);

                        const timeA = userA?.joined_at
                            ? new Date(userA.joined_at).getTime()
                            : 0;

                        const timeB = userB?.joined_at
                            ? new Date(userB.joined_at).getTime()
                            : 0;

                        return timeB - timeA;
                    })
                );
            }

        }
    }

    return (
        <div className="w-full h-full flex flex-col gap-5 scroll-hidden overflow-visible">
            <div className={"w-full h-20 z-20 bg-gray-800 py-8 flex flex-row items-center justify-between gap-3 overflow-visible"}>
                <div className={"w-fit flex flex-row gap-5 items-center"}>
                    <select
                        name="sort sets"
                        onChange={filterClasses}
                        ref={selectionRef}
                        defaultValue="all"
                        className="
                                px-4 sm:px-6 py-2 sm:py-2.5 rounded-full
                                border border-studogrey/30
                                bg-white dark:bg-gray-700
                                text-studodarkblue dark:text-white
                                font-medium text-xs sm:text-sm
                                shadow-sm hover:shadow-md
                                transition-all duration-200
                                cursor-pointer w-45 text-center
                                focus:outline-none focus:ring-2 focus:ring-studogrey/50
                                appearance-none">
                        <option value="all">{t("all")}</option>
                        <option value="last">{t("last")}</option>
                        <option value="alphabetical">{t("alphabetical")}</option>
                    </select>
                </div>
                <div className={"w-fit flex flex-row gap-5 items-center"}>
                    <ClassSearch classes={classrooms} setFilteredClasses={setFilteredClasses} />

                </div>
            </div>
            <div className={"w-full h-fit flex flex-col gap-5 overflow-visible pb-15"}>
                {filteredClasses.length > 0 && (filteredClasses.map((item, i) => (<ClassroomOverviewItem key={i} t={t} classroom={item} />)))}
            </div>
        </div>);

}