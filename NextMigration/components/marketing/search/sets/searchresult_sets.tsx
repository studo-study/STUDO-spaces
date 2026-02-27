import {useTranslations} from "next-intl";
import { FaAngleRight } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

interface ResultSetsProps {
    result: any
}
export default function SearchResultSets({result}: ResultSetsProps) {
    const sets = result && result.data[0].data.slice(0,4);
    const empty = sets && sets.length === 0;
    const t = useTranslations("landing.search_result.set")
    return(<div className={`w-full h-full flex flex-col gap-5 ${empty ? "hidden" : "flex"}`}>
        <div className={"w-full flex py-1 flex-row justify-between items-center"}>
            <span className={"font-bold"}>{t("sets")}</span>
            <span className={`flex ${result && sets.length != 0 ? "flex" : "hidden"} flex-row items-center justify-end gap-2`}>
                {t("more")}
                <FaAngleRight />
            </span>
        </div>
        <div className={"w-full min-h-30 h-fit grid grid-cols-4 gap-5"}>
                {
                    result && sets.map((item: any, i: number) => (<SetResult key={i} item={item}/>))
                }
            </div>
    </div>)
}

interface SetResultProps {
    item: any;
}

function SetResult({item}: SetResultProps) {
    return(<Link href={item.type === "visualset" ? "visualset/" +  item.id : "studoset/" + item.id}
                 className={`w-full min-h-40 rounded-2xl border border-studogrey/30 bg-studogrey/30 drop-shadow-3xl p-5 flex flex-col gap-2`}>
        <div className={"w-full h-fit flex items-center justify-baseline gap-2"}>
            <Image src={item.type === "visualset" ? "/icons/visualset.svg" : "/icons/studyset.svg"}
                   alt="" width={0} height={0} className={"w-5  dark:invert dark:brightness-0"}/>
            <span className={"font-bold truncate"}>{item.title}</span>
        </div>
        <hr className={"w-full h-0.5 rounded-full bg-studogrey opacity-30"}/>
        <div>
            <Image src={item.img_url} width={0} height={0} alt={"pfp"} className={"w-10 h-10 rounded-full overflow-hidden"}/>
        </div>

    </Link>);
}