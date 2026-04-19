import {LastStudied} from "@studo/types";
import Image from "next/image";
import {Link} from "@/i18n/routing";

interface SetItemProps {
    item: LastStudied;
}
const HomePageSetItem = (props: SetItemProps) => {
    const {item} = props;
    return (<Link href={item.type === "studyset" ? "/studoset/" + item.set_id : "/visualset/" + item.set_id} className={"w-full cursor-pointer h-10 rounded-xl border bg-studogrey/30 border-studoborder/30 flex justify-between items-center px-5 gap-2"}>
        <div className={"flex flex-row gap-2"}>
            <Image alt="settype" src={item.type === "studyset" ? "/icons/studyset.svg" : "/icons/visualset.svg"} width={5} height={5} className={"w-4 dark:invert dark:brightness-0"}/>
            <span className={"font-bold dark:text-white text-studodarkblue"}>{item.title}</span>
        </div>
        <div>

        </div>
    </Link>)
}

HomePageSetItem.displayName = "HomePageSetItem";
export default HomePageSetItem;