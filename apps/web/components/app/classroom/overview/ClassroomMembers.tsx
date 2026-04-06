import {useTranslations} from "next-intl";
import type {ClassroomUser, FullClassroom} from "@/types/types";
import Link from "next/link";
import Image from "next/image";

interface MembersProps {
    items: FullClassroom;
}
export default function ClassroomMembers({items}: MembersProps) {
    const t = useTranslations("classroom")
    return(  <div className={"w-1/3 h-full flex flex-col gap-5 min-h-150 rounded-4xl bg-studogrey/10 border border-studoborder/20 shadow-2xl p-7"}>
        <span className={"font-bold text-studodarkblue dark:text-white"}>{t("members")}:</span>
        <div className={"w-full h-full flex flex-col overflow-y-scroll scroll-hidden pb-7 gap-5 [&::-webkit-scrollbar]:hidden\n" +
            "    [-ms-overflow-style:none]\n" +
            "    [scrollbar-width:none]"}>
            {items.users.map((user, i) => {return <ClassroomUser key={i} user={user}/>})}
            <Link href={"/classroom/" + items.id + "/members"}
                  className={"w-full h-10 text-sm hover:underline " +
                      "transition-all duration-300 text-studodarkblue flex " +
                      "dark:text-white items-center justify-center"}>
                {t("more_members")}
            </Link>
        </div>
    </div>)
}

interface UserProps {
    user: ClassroomUser
}
function ClassroomUser({user}: UserProps) {
    return (
        <Link
            href={"/profile/" + user.user_id}
            className={`
                     max-h-15 h-15 min-h-15  flex-row px-3 py-4 pr-5 sm:py-0 max-w-full min-w-full cursor-pointer justify-between dark:text-white text-studodarkblue
                 flex gap-3 shadow-2xl items-center w-full rounded-full bg-studogrey/10 border border-studogrey/20 hover:border-studogrey/40 transition-all duration-300 overflow-hidden`}
        >
            <div className={"w-fit flex flex-row gap-2 items-center justify-base"}>
                <div className="relative min-w-10 max-w-10 min-h-10 max-h-10 rounded-full overflow-hidden bg-emerald-600 dark:bg-gray-800">
                    <Image
                        src={user.img_url}
                        alt="pfp"
                        width={0}
                        height={0}
                        className="object-cover"
                    />
                </div>
                <span className={"w-fit flex items-center"}>{user.displayName}</span>
                •
                {user.streak >= 5 &&
                    <div className={"w-fit flex flex-row items-center gap-0.5"}>
                        <span className={"text-studodarkblue dark:text-white text-xs"}>{user.streak} </span>
                        <img src={"/icons/streak2.svg"} alt="streak" className="h-4" /></div>
					}
            </div>
            {user.role === "teacher" &&  <span className={"w-fit text-studodarkblue/30 dark:text-white/30"}>{user.role}</span>}




        </Link>);
}