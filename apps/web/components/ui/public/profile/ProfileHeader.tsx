import Link from "next/link";
import {User} from "next-auth";
import {useTranslations} from "next-intl";

interface ProfileHeaderProps {
    user: User;
}
export default function ProfileHeader({user}:ProfileHeaderProps) {
    const t = useTranslations("account")
    return(<div className={"w-full flex flex-col gap-5 px-10 justify-center py-5 min-h-30 bg-gray-700 rounded-3xl border border-studoborder/30"}>
        <div className={"w-full h-fit  items-center justify-baseline flex flex-row gap-10"}>
            <div className={"max-w-25 max-h-25 overflow-hidden min-w-25 min-h-25 rounded-full flex items-center justify-center bg-gray-500"}>
                <img src={user?.img_url} alt=""/>
            </div>
            <div className={"w-full h-fit flex flex-col gap-5"}>
                <div className={"w-full h-fit text-2xl flex flex-row gap-3 font-bold dark:text-white text-studodarkblue justify-between"}>
                    <div className="flex items-center gap-2">
                        <span>{user?.displayName}</span>
                        <span className={"text-base cursor-pointer"}>#</span>
                        <Link href={"/streak"}>
                            <img src="/icons/streak.svg" alt="streak-icon" className="w-4 h-4 cursor-pointer" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}