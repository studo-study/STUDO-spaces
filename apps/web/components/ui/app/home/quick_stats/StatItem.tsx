import {ReactNode} from "react";
import Image from "next/image";

interface StatItemProps {
    title: string;
    icon?: ReactNode;
    image?: string;
    bg?: string;
}

const StatItem = (props: StatItemProps) => {
    const {title, icon, image, bg} = props;
    return (<div
        className={`w-full h-10 text-sm flex text-white font-bold items-center justify-center bg-studogrey/30 ${bg && "bg-linear-0 " + bg} gap-2 rounded-full border border-transparent dark:border-studoborder/30`}>{icon}
        {image && <Image src={image} alt={"sets"} width={10} height={10}
               className={"w-4 invert brightness-0"}/>}
        {title}
    </div>)
}

StatItem.displayName = "StatItem"
export default StatItem;