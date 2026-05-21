"use client";
import FolderItem from "@/components/ui/app/your-files/folders/folderItem";
import { useFolders } from "@/hooks/app/folders/useFolders";

export default function FolderGrid() {
  const folders = useFolders().data?.folders;
  return (
    <div className={"w-full h-fit flex flex-col gap-5 py-5"}>
      {folders?.map((item) => (
        <FolderItem key={item.id} folder={item} />
      ))}
    </div>
  );
}
