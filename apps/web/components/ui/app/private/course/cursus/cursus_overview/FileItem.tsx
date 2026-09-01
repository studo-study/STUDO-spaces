"use client";
import { Link, usePathname } from "@/i18n/routing";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { CircleX, LoaderCircle, Plus } from "lucide-react";
import BaseTooltip from "@studo/ui/design_system/tooltip/BaseToolTip";
import ExtendCoursePopup from "@/components/ui/app/private/course/cursus/cursus_overview/ExtendCoursePopup";
import { useState } from "react";
import { CourseDocument } from "@studo/types";
import { useParams } from "next/navigation";
import { useCourseNavStore } from "@/store/course/CourseNavStore";
import { useTranslations } from "next-intl";

interface FileItemProps {
  file: CourseDocument;
}
const FileItem: React.FC<FileItemProps> = (props) => {
  const { file } = props;
  const locale = useParams().locale;
  const t = useTranslations("flow.course");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const setDocument = useCourseNavStore((state) => state.setDocument);
  const path = usePathname();
  return (
    <>
      <Link
        href={path + "/" + file.id}
        onClick={() => setDocument(file.title)}
        className={
          "flex items-center mb-5 group justify-center max-h-85 max-w-55 w-fit cursor-pointer"
        }
      >
        <div
          className={
            "w-fit flex flex-col group-hover:bg-studogrey/20 shadow-2xl transition-colors duration-300 gap-2 p-2 rounded-lg"
          }
        >
          <div
            className={
              "relative max-w-50 w-50 group h-70 max-h-70 bg-white dark:group-hover:border-neutral-400 border border-neutral-200/30 rounded-sm"
            }
          >
            {file.status === "failed" && (
              <div
                className={
                  "absolute top-2 left-2 p-1 px-2 text-xs rounded-full backdrop-blur-2xl flex flex-row gap-2 items-center text-rose-500 glass-rgb"
                }
              >
                <CircleX size={10} className={"text-rose-500"} />
                {t("failed")}
              </div>
            )}
            {file.status != "finished" && file.status != "failed" && (
              <div
                className={
                  "absolute bottom-2 left-2 p-1 px-2 text-xs rounded-full backdrop-blur-2xl flex flex-row gap-2 items-center text-studodarkblue glass-rgb"
                }
              >
                <LoaderCircle size={10} className={"animate-spin"} />
                {t("processing")}
              </div>
            )}
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
          <div
            className={
              "flex flex-row min-w-0 flex-1 justify-between px-1.5 pb-1.5"
            }
          >
            <div className={"flex flex-col w-full overflow-hidden"}>
              <span
                className={
                  "font-semibold truncate overflow-hidden min-w-0 flex-1 max-w-45"
                }
              >
                {file.title}
              </span>
              <span className={"text-studogrey text-xs"}>
                {new Date(
                  file?.createdAt as unknown as string,
                ).toLocaleDateString(locale)}
              </span>
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
