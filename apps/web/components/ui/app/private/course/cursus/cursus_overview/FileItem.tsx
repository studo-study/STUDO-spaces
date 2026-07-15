"use client";
import { Link, usePathname } from "@/i18n/routing";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { Plus } from "lucide-react";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import ExtendCoursePopup from "@/components/ui/app/private/course/cursus/cursus_overview/ExtendCoursePopup";
import { SetStateAction, useState } from "react";

interface FileItemProps {
  link: string;
}
const FileItem: React.FC<FileItemProps> = (props) => {
  const { link } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const path = usePathname();
  return (
    <>
      <Link
        href={path + "/" + link}
        className={
          "flex min-w-1/4 items-center mb-5 group justify-center max-h-85 cursor-pointer"
        }
      >
        <div className={"w-fit flex flex-col gap-2"}>
          <div
            className={
              "relative max-w-50 w-50 group h-70 max-h-70 bg-white dark:group-hover:border-studogrey border border-studogrey/30 rounded-2xl"
            }
          >
            <div
              className={
                "absolute group-hover:opacity-100 opacity-0  transition-all duration-300 top-2 right-2"
              }
            >
              <BaseTooltip position={"bottom"} content={"extend course"}>
                <BaseButton
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsOpen((prev) => !prev);
                  }}
                  shape={"circle"}
                  variant={"plus"}
                  className={"text-3xl"}
                  icon={<Plus size={25} />}
                />
              </BaseTooltip>
            </div>
          </div>
          <div className={"flex flex-row w-full justify-between"}>
            <div className={"flex flex-col w-full"}>
              <span className={"font-semibold"}>Title</span>
              <span className={"text-studogrey text-xs"}>date</span>
            </div>
          </div>
        </div>
      </Link>
      {isOpen && <ExtendCoursePopup isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  );
};

FileItem.displayName = "FileItem";
export default FileItem;
