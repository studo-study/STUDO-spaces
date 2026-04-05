import {FullClassroom} from "@/types/types";
import {Link} from "@/i18n/routing";
import {FaArrowRight, FaBook, FaUserFriends} from "react-icons/fa";
import {CgCommunity} from "react-icons/cg";
import {LiaUniversitySolid} from "react-icons/lia";
import {HiChatBubbleBottomCenterText} from "react-icons/hi2";
import {IoSchoolOutline} from "react-icons/io5";
import {TbWorld} from "react-icons/tb";
import {stopPropagation} from "@dnd-kit/core/dist/sensors/events";


interface ClassroomOverviewItemProps {
    t: any;
    classroom: FullClassroom;
}
export default function ClassroomOverviewItem({t, classroom}: ClassroomOverviewItemProps) {
    return(
    <Link href={"/classroom/" + classroom.id + "/overview"} className={"group w-full h-20 shadow-2xl rounded-full flex flex-row items-center justify-between px-5 gap-5 bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40"}>
        <div className={"w-full flex flex-row items-center gap-5 dark:text-white text-studodarkblue"}>
            <div className={"w-12 h-12 rounded-full bg-studogrey flex items-center justify-center dark:text-white text-studodarkblue "}>
                {getClassroomType(classroom.type)}
            </div>
            <span className={"w-fit font-bold h-full flex items-center truncate overflow-hidden"}>{classroom.name}</span>
            •
            <div className={"w-fit flex flex-row items-center gap-5 opacity-50"}>
                <div className={"w-fit gap-2 flex flex-row items-center"}>
                    <LiaUniversitySolid />
                    <span>{classroom.school}</span>
                </div>

                •
                <span>{classroom.users.length + " " + (classroom.users.length != 1 ? t("members") : t("member"))}</span>
            </div>
        </div>


        <div>
            <button
                onClick={(e) => {
                    e.preventDefault();   // voorkomt navigatie
                    e.stopPropagation();  // stopt bubbling
                    console.log("leave classroom");
                }}
                className={"w-fit px-5 py-2 rounded-full opacity-0 group-hover:opacity-100 active:scale-95 transition-all duration-300 bg-rose-400/30 cursor-pointer flex flex-row items-center gap-3 font-bold dark:text-white text-studodarkblue border-rose-500 border-2"}>{t("leave")} <FaArrowRight /></button>
        </div>

    </Link>)
}


function getClassroomType(type: string) {
    switch (type) {
        case "class_group": return <IoSchoolOutline />
        case "study_group": return <FaUserFriends />
        case "community_group": return <TbWorld />
    }
}