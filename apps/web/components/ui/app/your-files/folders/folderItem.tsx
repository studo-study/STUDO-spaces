"use client";
import {FaChevronDown, FaChevronRight, FaExternalLinkAlt, FaFolderOpen} from "react-icons/fa";
import Link from "next/link";
import {Folder} from "@/types/types";
import IconButton from "@/components/ui/design_system/button/IconButton";
import {useState} from "react";
import {FaFolderClosed} from "react-icons/fa6";
import ItemOptions from "@/components/ui/design_system/item_options/ItemOptions";
import {FiTrash2} from "react-icons/fi";
import {useTranslations} from "next-intl";
import {IoShareOutline} from "react-icons/io5";

interface FolderProps {
    folder: Folder;
}

export default function FolderItem({folder}: FolderProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const t = useTranslations("y_f.your_sets")
    const toggleOpen = () => {
        setIsOpen(prev => !prev)
    }
    const handleDelete = () => {
        console.log("deleted");
    };

    return (<>
            <div className={"w-full h-15 flex items-center justify-between gap-5 px-3 rounded-xl  border border-studoborder/30"}
            >
                <div className={"dark:text-white/30 text-2xl flex flex-row items-center gap-5"}>
                <IconButton onClick={toggleOpen} icon={isOpen ? <FaChevronDown size={15}/> : <FaChevronRight size={15}/>} bg={"bg-studogrey/50"}/>
                    <div className={"w-fit flex flex-row items-center gap-2"}>
                        <div className={"min-w-6"}>
                            {isOpen ? <FaFolderOpen size={20}/> : <FaFolderClosed size={17}/>}
                        </div>
                        <Link  href={"/your-files/folders/" + folder.id} className={"w-fit font-bold hover:bg-studogrey/30 transition-all duration-300 px-3 rounded-full dark:text-white text-studodarkblue text-lg"}>
                            {folder.name}
                        </Link>
                    </div>
                </div>


                <div className={"flex flex-row gap-2 items-center"}>
                    <ItemOptions options={[
                        {label: t("share_folder"), icon: <IoShareOutline />, onClick: () => {}},
                        {label: t("external_window"), icon:<FaExternalLinkAlt size={10}/> , onClick: () => console.log("test")},
                        {label: t("delete_folder"), icon: <FiTrash2 size={14}/>, onClick: () => handleDelete(), danger: true},
                    ]}/>
                </div>

            </div>
        </>
    );
}