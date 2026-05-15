"use client";
import FolderItem from "@/components/ui/app/your-files/folders/folderItem";
import { Folder } from "@/types/types";

interface FolderProps {
  folders: Folder[];
}

export default function FolderGrid({ folders }: FolderProps) {
  return (
    <div className={"w-full h-fit flex flex-col gap-5 py-5"}>
      {folders.map((item) => (
        <FolderItem key={item.id} folder={item} />
      ))}
    </div>
  );
}
