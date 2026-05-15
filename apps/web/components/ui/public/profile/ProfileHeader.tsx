import Link from "next/link";
import Image from "next/image";
import {User} from "next-auth";

interface ProfileHeaderProps {
    user: User;
}
export default function ProfileHeader({user}:ProfileHeaderProps) {
    return(<div className={"w-full flex flex-col gap-5 px-10 justify-center py-5 min-h-30 bg-gray-700 rounded-3xl border border-studoborder/30"}>
        <div className={"w-full h-fit  items-center justify-baseline flex flex-row gap-10"}>
            <div className={"max-w-25 max-h-25 overflow-hidden min-w-25 min-h-25 rounded-full flex items-center justify-center bg-gray-500"}>
                <Image src={user?.img_url ?? ""} alt="" width={100} height={100} className="object-cover w-full h-full" />
            </div>
            <div className={"w-full h-fit flex flex-col gap-5"}>
                <div className={"w-full h-fit text-2xl flex flex-row gap-3 font-bold dark:text-white text-studodarkblue justify-between"}>
                    <div className="flex items-center gap-2">
                        <span>{user?.displayName}</span>
                        <span className={"text-base cursor-pointer"}>#</span>
                        <Link href={"/streak"}>
                            <Image src="/icons/streak.svg" alt="streak-icon" width={16} height={16} className="w-4 h-4 cursor-pointer" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}