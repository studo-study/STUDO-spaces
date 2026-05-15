import { useState } from "react";
import useSWR, { mutate } from "swr";
import { getById } from "../../../../api/index.js";
import FolderItem from "./FolderItem.jsx";
import plusIcon from "../../../../assets/icons/cross.png";
import CreateFolder from "../components/CreateFolder.jsx";
import { useTranslation } from "react-i18next";

export default function FoldersPage() {
  const { t } = useTranslation();
  const [select, setSelect] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const closePopup = () => setIsOpen(false);

  const handleSuccess = async () => {
    await mutate("folders/me", async (currentData) => currentData, {
      revalidate: true,
    });
  };

  const { data: folders, isLoading } = useSWR(
    "folders/me",
    () => getById("folders/me"),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return (
    <div className="w-full h-full flex flex-col gap-3 sm:gap-4">
      <div className="w-full h-fit flex flex-row items-center justify-end gap-2 sm:gap-3 py-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-lg bg-studoblue opacity-45 blur-md z-[1] pointer-events-none" />
          <div
            onClick={toggleOpen}
            className="relative w-10 h-10 bg-studoblue rounded-full flex items-center justify-center cursor-pointer
              active:scale-105 transition-transform z-[2] select-none
              border-[0.5px] border-solid border-[#8181812f] border-t-blue-300 border-l-blue-300"
          >
            <img src={plusIcon} className="w-5 h-auto" alt="Add" />
          </div>
          <CreateFolder
            isOpen={isOpen}
            onClose={closePopup}
            onSuccess={handleSuccess}
          />
        </div>
      </div>

      <div className="w-full h-full flex flex-col md:gap-5 gap-5 ">
        {!isLoading && folders?.folders?.length === 0 && (
          <div className="w-full h-40 flex items-center justify-center text-sm sm:text-base">
            {t("no folders yet")}
          </div>
        )}

        {!isLoading &&
          folders?.folders?.length > 0 &&
          folders.folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              select={select}
              length={folders.folders.length}
              onSuccess={handleSuccess}
            />
          ))}
      </div>
    </div>
  );
}
