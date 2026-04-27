"use client"
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import FolderItem from "@/components/ui/app/your-files/folders/folderItem";
import {useState} from "react";
import Draggable from "@/components/ui/app/your-files/folders/draggable";
import Droppable from "@/components/ui/app/your-files/folders/Droppable";
import {mockFolders} from "@/data/mocks/startPageMock";
import {Folder} from "@/types/types";

interface FolderProps {
    folders: Folder[];
}

export default function FolderGrid({folders}: FolderProps) {


    return (
        <div className={"w-full h-fit flex flex-col gap-5 py-5"}>
            {folders.map((item) => (
                <FolderItem key={item.id} folder={item}/>


            ))}
        </div>

    );

}



