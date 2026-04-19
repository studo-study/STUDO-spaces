import {ReactNode} from "react";

interface StatItemProps {
    title: string;
    icon?: ReactNode;
    image?: ReactNode;
}
const StatItem = (props: StatItemProps) => {
    const { title, icon, image } = props;
    return(<div className={"w-full h-10 text-sm flex dark:text-white font-bold items-center justify-center bg-studogrey/30 gap-2 rounded-full border border-studoborder"}>{icon} {image} {title}</div>)
}

StatItem.displayName = "StatItem"
export default StatItem;