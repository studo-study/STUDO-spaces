"use client"
import {Link, usePathname} from "@/i18n/routing";
import {ReactNode} from "react";
import {RxDragHandleDots2} from "react-icons/rx";

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
    const isActive = pathName.endsWith("/" + id)

    return <Link href={"/flow/" + id + "/" + page}
                 className={`hover:bg-studogrey/30 border border-transparent hover:border-studoborder/30 transition-all px-3 cursor-pointer duration-300 rounded-xl flex items-center justify-center p-1 text-studodarkblue dark:text-white`}>
        <RxDragHandleDots2 />
        <div className={"h-full"}>{icon && icon}
            {label && <span className={"h-full flex items-center pb-0.5"}>{label}</span>}</div>
    </Link>
}

FlowRowSelectorItem.displayName = "FlowRowSelectorItem";
export default FlowRowSelectorItem;