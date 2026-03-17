import {useTranslations} from "next-intl";
import { FaAngleRight } from "react-icons/fa6";
import Image from "next/image";
import {Link} from "@/i18n/routing";

interface ResultStudoProps {
    result: any
}
export default function SearchResultStudo({result}: ResultStudoProps) {
    const users = result && result.data[3].data.slice(0,4);
    const empty = users && users.length === 0;
    const t = useTranslations("landing.search_result.studo")
    return(<div className={`w-full h-full flex flex-col gap-5 ${empty ? "hidden" : "flex"}`}>
        <div className={"w-full flex py-1 flex-row justify-between items-center"}>
            <span className={"font-bold"}>{t("users")}</span>
            <span className={`flex ${result && users.length != 0 ? "flex" : "hidden"} flex-row items-center justify-end gap-2`}>
                {t("more")}
                <FaAngleRight />
            </span>
        </div>
        <div className={"w-full min-h-30 h-fit grid grid-cols-3 gap-5"}>
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
    return (
        <Link
            href={`/track/${item.id}`}
            className="relative w-full h-40 rounded-2xl hover:scale-102 transition-transform duration-500 overflow-hidden border border-studogrey/30 drop-shadow-3xl"
        >
            {/* Banner */}
            <Image
                src={item.banner_url}
                alt={`${item.displayName} banner`}
                fill
                className="object-cover opacity-75"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-gray-900/90 to-transparent" />

            {/* Profile info */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-row items-center gap-3 px-4 pb-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                        src="/icons/icon2.png"
                        alt="pfp"
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="font-bold truncate text-white flex flex-row">
                    Studo {item.displayName}
                </span>
                <Image
                    src="/icons/verified.svg"
                    alt="verified"
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                />
            </div>
        </Link>
    );
}