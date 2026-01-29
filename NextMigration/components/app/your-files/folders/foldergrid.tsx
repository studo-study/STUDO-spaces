"use client"
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import FolderItem from "@/components/app/your-files/folders/folderItem";
import {useState} from "react";
import Draggable from "@/components/app/your-files/folders/draggable";
import Droppable from "@/components/app/your-files/folders/Droppable";


export default function FolderGrid() {
    const folders = ['A', 'B', 'C'];
    const [parent, setParent] = useState(null);
    const draggableMarkup = (
        <Draggable id="draggable">Drag me</Draggable>
    );

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className={"w-full h-fit flex flex-col gap-5 py-5"}>
                {folders.map((id) => (
                    <FolderItem key={id} id={id}/>


                ))}
            </div>

        </DndContext>
    );

    function handleDragEnd(event: any) {
        const {over} = event;
        setParent(over ? over.id : null);
    }
}



