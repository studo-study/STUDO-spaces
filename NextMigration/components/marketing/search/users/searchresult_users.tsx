import {useTranslations} from "next-intl";
import { FaAngleRight } from "react-icons/fa6";
import Image from "next/image";
import {Link} from "@/i18n/routing";

interface ResultUsersProps {
    result: any
}
export default function SearchResultUsers({result}: ResultUsersProps) {
    const users = result && result.data[1].data.slice(0,4);
    const empty = users && users.length === 0;
    const t = useTranslations("landing.search_result.user")
    return(<div className={`w-full h-full flex flex-col gap-5 ${empty ? "hidden" : "flex"}`}>
        <div className={"w-full flex py-1 flex-row justify-between items-center"}>
            <span className={"font-bold"}>{t("users")}</span>
            <span className={`flex ${result && users.length != 0 ? "flex" : "hidden"} flex-row items-center justify-end gap-2`}>
                {t("more")}
                <FaAngleRight />
            </span>
        </div>
        <div className={"w-full min-h-30 h-fit grid grid-cols-4 gap-5"}>
            {
                result && users.map((item: any, i: number) => (<UserResult key={i} item={item}/>))
            }
        </div>
    </div>)
}

interface SetResultProps {
    item: any;
}

function UserResult({item}: SetResultProps) {
    console.log("img_url:", JSON.stringify(item.img_url));
    return(<Link href={"/profile/" + item.id} className={`w-full min-h-40 rounded-2xl border border-studogrey/30 bg-studogrey/30 drop-shadow-3xl p-5 flex flex-col gap-5`}>
        <div className={"w-full h-fit flex items-center justify-baseline gap-3"}>
            <div className="relative w-10 h-10 rounded-full bg-studogrey overflow-hidden flex items-center justify-center">
                <Image
                    src={item.img_url || "/icons/profile.svg"}
                    alt="pfp"
                    fill
                    className="object-cover"
                />
            </div>
            <span className={"font-bold truncate"}>{item.displayName}</span>
        </div>


    </Link>);
}