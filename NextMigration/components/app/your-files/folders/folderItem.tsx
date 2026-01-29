"use client";
import {FaFolderOpen} from "react-icons/fa";
import Link from "next/link";
import {useDraggable, useDroppable} from "@dnd-kit/core";

interface FolderProps {
    id: string;
}

export default function FolderItem({id}: FolderProps) {
    const {isOver, setNodeRef: setDropRef} = useDroppable({
        id: id,
    });

    const {attributes, listeners, setNodeRef: setDragRef, transform, isDragging} = useDraggable({
        id: id,
    });

    function combineRefs(el: HTMLElement | null) {
        setDropRef(el);
        setDragRef(el);
    }

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        opacity: isDragging ? 0.5 : 1,
        border: isOver ? '#4f83ff solid 3px' : undefined,
    };

    const handleDelete = () => {
        console.log("deleted");
    };

    return (
        <Link
            href={"/folder"}
            ref={combineRefs}
            style={style}
            className={"w-full h-20 flex items-center justify-between gap-5 px-3 rounded-full bg-studogrey/10 border border-studoborder/30 shadow-xl pr-10"}
        >
            <div className={"min-w-15 min-h-15 rounded-full bg-gray-700 items-center justify-center flex text-white/30 text-2xl"}>
                <FaFolderOpen />
            </div>

            <span className={"w-full font-bold dark:text-white text-studodarkblue text-lg"}>
        Charles' Folder
    </span>

            <div
                className={"w-fit flex items-center cursor-pointer text-white/30 text-2xl"}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDelete();
                }}
            >
                <img
                    src="/icons/delete.svg"
                    alt="delete"
                    className="cursor-pointer h-4 sm:h-5 dark:invert dark:brightness-0"
                />
            </div>

            <div
                className={"w-fit flex items-center cursor-grab text-white/30 text-2xl"}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                {...attributes}
                {...listeners}
            >
                <img
                    src="/icons/grab.svg"
                    alt="grab"
                    className="h-4 sm:h-5 dark:invert dark:brightness-0"
                />
            </div>
        </Link>
    );
}