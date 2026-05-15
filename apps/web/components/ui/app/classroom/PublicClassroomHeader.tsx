"use client"
import {Classroom} from "@/types/types";
import {mockFullClassrooms} from "@/data/mocks/classroomsMock";
import {IoSchoolOutline} from "react-icons/io5";
import {FaUserFriends} from "react-icons/fa";
import {TbWorld} from "react-icons/tb";
import {LiaUniversitySolid} from "react-icons/lia";

const classroom: Classroom = mockFullClassrooms[0];

export default function PublicClassroomHeader() {
    return (
        <div className="w-full flex flex-col gap-2">
            {/* Header row */}
            <div className="w-full flex items-center justify-between dark:text-white text-studodarkblue">
                <div className="min-w-fit truncate font-bold text-3xl flex flex-row gap-5 items-center">
                    <span>{classroom.name}</span>
                    <div>{getClassroomType(classroom.type)}</div>
                </div>
            </div>

            {/* School name */}
            <span className="w-full dark:text-white opacity-50 text-base flex gap-2 items-center">
            <LiaUniversitySolid />
            <span>{classroom.school}</span>
        </span>

            {/* Tab bar */}
            <div className="relative w-full mt-4">
                <div className="absolute z-10 bottom-0 w-full h-0.5 bg-studogrey" />
            </div>
        </div>
    );
}


function getClassroomType(type: string) {
    switch (type) {
        case "class_group": return <IoSchoolOutline />
        case "study_group": return <FaUserFriends />
        case "community_group": return <TbWorld />
    }
}
