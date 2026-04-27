"use client";
import {FaChevronDown, FaChevronRight, FaFolderOpen} from "react-icons/fa";
import Link from "next/link";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {Folder} from "@/types/types";
import IconButton from "@/components/ui/design_system/button/IconButton";
import {useState} from "react";
import {FaFolderClosed} from "react-icons/fa6";

interface FolderProps {
    folder: Folder;
}

export default function FolderItem({folder}: FolderProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const toggleOpen = () => {
        setIsOpen(prev => !prev)
    }
    const handleDelete = () => {
        console.log("deleted");
    };

    return (<>
            <div className={"w-full h-15 flex items-center justify-between gap-5 px-3 rounded-xl  border border-studoborder/30 pr-10"}
            >
                <div className={"dark:text-white/30 text-2xl flex flex-row items-center gap-5"}>
                <IconButton onClick={toggleOpen} icon={isOpen ? <FaChevronDown size={15}/> : <FaChevronRight size={15}/>}/>
                    <div className={"w-fit flex flex-row items-center gap-2"}>
                        <div className={"min-w-6"}>
                            {isOpen ? <FaFolderOpen size={20}/> : <FaFolderClosed size={17}/>}
                        </div>
                        <Link  href={"/your-files/folders/" + folder.id} className={"w-fit font-bold hover:bg-studogrey/30 transition-all duration-300 px-3 rounded-full dark:text-white text-studodarkblue text-lg"}>
                            {folder.name}
                        </Link>
                    </div>
                </div>


                <div>
                    <div
                        className={"w-fit flex items-center cursor-grab text-white/30 text-2xl"}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <img
                            src="/icons/grab.svg"
                            alt="grab"
                            className="h-4 sm:h-5 dark:invert dark:brightness-0"
                        />
                    </div>
                </div>

            </div>
        </>
    );
}