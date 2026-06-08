"use client";
import {
  FaChevronDown,
  FaChevronRight,
  FaExternalLinkAlt,
  FaFolderOpen,
} from "react-icons/fa";
import Link from "next/link";
import { Folder } from "@/types/types";
import IconButton from "@/components/ui/design_system/button/IconButton";
import { useState } from "react";
import { FaFolderClosed } from "react-icons/fa6";
import ItemOptions from "@/components/ui/design_system/item_options/ItemOptions";
import { FiTrash2 } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { IoShareOutline } from "react-icons/io5";
import { useFolder } from "@/hooks/app/folders/useFolder";
import { useDeleteFolder } from "@/hooks/app/folders/useDeleteFolder";

interface FolderProps {
  folder: Folder;
}

export default function FolderItem({ folder }: FolderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate: deleteFolder } = useDeleteFolder();
  const t = useTranslations("y_f.your_sets");
  const { data: folderDetails } = useFolder(folder.id, isOpen);
  const sets = [
    ...(folderDetails?.sets?.visualsets ?? []),
    ...(folderDetails?.sets?.studysets ?? []),
  ];
  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };
  const handleDelete = () => {
    deleteFolder(folder.id);
  };
  console.log(folderDetails);

  return (
    <>
      <div
        className={`w-full h-fit py-3 flex flex-col items-center justify-center gap-5 px-3 rounded-xl  border border-studoborder/30`}
      >
        <div className={"w-full flex items-center justify-between"}>
          <div
            className={
              "dark:text-white/30 text-2xl flex flex-row items-center gap-5"
            }
          >
            <IconButton
              onClick={toggleOpen}
              icon={
                isOpen ? (
                  <FaChevronDown size={15} />
                ) : (
                  <FaChevronRight size={15} />
                )
              }
              bg={"bg-studogrey/50"}
            />
            <div className={"w-fit flex flex-row items-center gap-2"}>
              <div className={"min-w-6"}>
                {isOpen ? (
                  <FaFolderOpen size={20} />
                ) : (
                  <FaFolderClosed size={17} />
                )}
              </div>
              <Link
                href={
                  "/apps/web/components/ui/app/app/your-files/folders/" +
                  folder.id
                }
                className={
                  "w-fit font-bold hover:bg-studogrey/30 transition-all duration-300 px-3 rounded-full dark:text-white text-studodarkblue text-lg"
                }
              >
                {folder.name}
              </Link>
            </div>
          </div>

          <div className={"flex flex-row gap-2 items-center"}>
            <ItemOptions
              options={[
                {
                  label: t("share_folder"),
                  icon: <IoShareOutline />,
                  onClick: () => {},
                },
                {
                  label: t("external_window"),
                  icon: <FaExternalLinkAlt size={10} />,
                  onClick: () => console.log("test"),
                },
                {
                  label: t("delete_folder"),
                  icon: <FiTrash2 size={14} />,
                  onClick: () => handleDelete(),
                  danger: true,
                },
              ]}
            />
          </div>
        </div>
        {isOpen && (
          <div className={"w-full h-fit flex flex-col gap-2"}>
            <div className={"w-full h-fit flex flex-row gap-3"}>
              <div
                className={
                  "w-1  min-h-full border-0.5 border-studoborder/30 rounded"
                }
              />
              <div className={"flex flex-col gap-2 flex-1"}>
                {sets.toSpliced(0, 2).map((set, i) => {
                  return (
                    <div
                      key={i}
                      className={
                        "w-full h-8 rounded-3xl border border-studogrey/30"
                      }
                    ></div>
                  );
                })}
              </div>
            </div>
            <div
              className={"w-full  h-0 border-0.5 border-studoborder/30 rounded"}
            />
            <div className={"w-full flex flex-row justify-end"}>
              <Link
                href={
                  "/apps/web/components/ui/app/app/your-files/folders/" +
                  folder.id
                }
                className={
                  "hover:underline dark:text-white text-studodarkblue text-sm"
                }
              >
                {" "}
                {t("see_more")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
