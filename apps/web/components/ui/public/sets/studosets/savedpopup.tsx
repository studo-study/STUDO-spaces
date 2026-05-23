"use client";
import SimpleMenu from "@/components/ui/design_system/simple_menu/SimpleMenu";
import { useFolders } from "@/hooks/app/folders/useFolders";
import { useTranslations } from "next-intl";
import { FaCheck } from "react-icons/fa6";
import { useMemo, useState } from "react";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { useToast } from "@/components/providers/app/ToastProvider";

export default function SavedPopup() {
  const folders = useFolders().data?.folders;
  const [saved, setSaved] = useState<string>("");
  const toast = useToast();
  const t = useTranslations("popup.folders");

  const toggleSave = (id: string, name: string) => {
    if (id === saved) removeFromFolder(name);
    else addToFolder(id, name);
  };

  const addToFolder = (id: string, name: string) => {
    if (saved) removeFromFolder("");
    setSaved(id);
    toast.success(t("added_to_folder") + " " + name);
  };

  const removeFromFolder = (name: string) => {
    setSaved("");
  };

  if (!folders) return null;

  return (
    <SimpleMenu
      trigger={
        <div
          className="inline-flex cursor-pointer active:scale-95 transition-[scale] duration-300 flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
                    font-atrament font-normal text-[#2a3a42] justify-center text-xl
                    rounded-full bg-studogrey/30 border border-studoborder/30 shadow-2x
                    dark:text-white"
        >
          {saved ? <IoBookmark /> : <IoBookmarkOutline />}
        </div>
      }
    >
      <div className={"w-full h-full flex flex-col gap-2 pt-1"}>
        <span className={"font-bold"}>{t("pop_title")}:</span>
        <div
          className={"border-0.5 rounded h-1 border-studoborder/30 w-full"}
        />
        {folders.map((folder, key) => (
          <div
            key={key}
            className={
              "w-full h-10 rounded-lg flex p-2 gap-2 items-center justify-baseline bg-studogrey/20 border border-studoborder/30"
            }
          >
            <label className="relative inline-flex items-center justify-center cursor-pointer">
              <input
                checked={saved === folder.id}
                onInput={() => toggleSave(folder.id, folder.name)}
                type="checkbox"
                className="peer appearance-none w-5 h-5 rounded-full border border-studoborder bg-studogrey/30
               checked:bg-blue-500 checked:border-blue-500
               transition-colors duration-200 cursor-pointer"
              />
              <FaCheck
                className="absolute w-3 h-3 text-white opacity-0
               peer-checked:opacity-100 transition-opacity duration-200
               pointer-events-none"
              />
            </label>
            <p className={"truncate"}>{folder.name}</p>
          </div>
        ))}
      </div>
    </SimpleMenu>
  );
}
