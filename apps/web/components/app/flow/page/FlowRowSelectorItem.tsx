"use client"
import {Link, usePathname} from "@/i18n/routing";
import {ReactNode} from "react";

interface FlowRowSelectorItemProps {
    id: string;
    page: string;
    label?: string;
    icon?: ReactNode;
}

const FlowRowSelectorItem = (props: FlowRowSelectorItemProps) => {
    //props
    const {label, id, page, icon} = props;

    //isActive
    const pathName = usePathname()
    const isActive = pathName.endsWith("/" + page)

    return <Link href={"/flow/" + id + "/" + page} className={`w-fit min-h-full h-full flex dark:text-white text-studodarkblue items-center hover:bg-studogrey/30 transition-all duration-300 rounded-3xl px-3 ${isActive && "font-bold bg-studogrey/30"}`}>
            {icon && icon}
            {label && <span>{label}</span>}
    </Link>
}

FlowRowSelectorItem.displayName = "FlowRowSelectorItem";
export default FlowRowSelectorItem;