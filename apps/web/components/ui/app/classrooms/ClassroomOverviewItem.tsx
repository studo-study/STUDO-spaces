import {FullClassroom} from "@/types/types";
import {Link} from "@/i18n/routing";
import {FaExternalLinkAlt, FaUserFriends} from "react-icons/fa";
import {LiaUniversitySolid} from "react-icons/lia";
import {IoSchoolOutline} from "react-icons/io5";
import {TbWorld} from "react-icons/tb";
import {FiTrash2} from "react-icons/fi";
import ItemOptions from "@/components/ui/design_system/item_options/ItemOptions";


interface ClassroomOverviewItemProps {
    t: any;
    classroom: FullClassroom;
}
export default function ClassroomOverviewItem({t, classroom}: ClassroomOverviewItemProps) {
    return(
    <Link href={"/classroom/" + classroom.id + "/sets"} className={"group w-full h-20 rounded-3xl flex flex-row items-center justify-between px-5 gap-5 bg-studogrey/30 border border-studoborder/30 hover:border-studoborder"}>
        <div className={"w-full flex flex-row items-center gap-5 dark:text-white text-studodarkblue"}>
            <div className={"w-12 h-12 rounded-full bg-white dark:bg-studogrey flex items-center justify-center dark:text-white text-studodarkblue "}>
                {getClassroomType(classroom.type)}
            </div>
            <div className={"flex flex-col"}>
                <span className={"w-fit font-bold h-full flex items-center truncate overflow-hidden"}>{classroom.name}</span>
                <div className={"w-fit flex flex-row text-xs items-center gap-1 opacity-50"}>
                    <div className={"w-fit gap-1 flex flex-row items-center"}>
                        <LiaUniversitySolid />
                        <span>{classroom.school}</span>
                    </div>

                    •
                    <span>{classroom.users.length + " " + (classroom.users.length != 1 ? t("members") : t("member"))}</span>
                </div>
            </div>
        </div>


        <div>
            <ItemOptions options={[
                {label: t("external_window"), icon:<FaExternalLinkAlt size={10}/> , onClick: () => console.log("test")},
                {label: t("leave"), icon: <FiTrash2 size={14}/>, onClick: () => {}, danger: true},
            ]}/>
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