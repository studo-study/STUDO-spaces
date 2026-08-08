"use client";
import BottomProgress from "@/components/ui/app/private/course/cursus/cursus_overview/BottomProgress";
import { Tabs } from "@/components/ui/design_system/tabs/Tabs";
import {
  BookOpen,
  Files,
  Plus,
  Signature,
  TableOfContents,
} from "lucide-react";
import SearchBar from "@/components/ui/app/private/app_header/SearchContainer";
import React, { SetStateAction, useRef, useState } from "react";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { useTranslations } from "next-intl";
import { CourseTab } from "@/components/ui/app/private/course/cursus/cursus_overview/FileGrid";
import { CourseDocument } from "@studo/types";

interface CourseOverviewHeaderProps {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  isUploading: boolean;
  files: File[];
  tab: CourseTab;
  setTab: React.Dispatch<SetStateAction<CourseTab>>;
  setQuery: (input: string) => void;
  documents: CourseDocument[];
}
const CourseOverviewHeader: React.FC<CourseOverviewHeaderProps> = (props) => {
  const { setIsOpen, isUploading, files, tab, setTab, setQuery, documents } =
    props;
  const t = useTranslations("flow.course");
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<boolean>(false);
  const processing = documents.filter(
    (doc) => doc.status === "processing" || doc.status === "uploading",
  );

  return (
    <div>
      {(isUploading || processing.length) != 0 && (
        <BottomProgress files={files} processingDocs={processing} />
      )}
      <div className={"flex justify-between items-start p-5 gap-5"}>
        <div className={"flex flex-col gap-5"}>
          <span className={"font-bold text-2xl"}>{t("documents")}</span>
          <Tabs
            size={"md"}
            onChange={(input) => setTab(input as CourseTab)}
            value={tab}
            tabs={[
              {
                key: "all",
                label: t("all"),
                icon: <Files size={13} className={"text-blue-500 mr-1"} />,
              },
              {
                key: "course",
                label: t("course"),
                icon: <BookOpen size={13} className={"text-purple-500 mr-1"} />,
              },
              {
                key: "notes",
                label: t("notes"),
                icon: (
                  <Signature size={13} className={"text-orange-500 mr-1"} />
                ),
              },
              {
                key: "summary",
                label: t("summary"),
                icon: (
                  <TableOfContents size={13} className={"text-rose-500 mr-1"} />
                ),
              },
            ]}
          />
        </div>
        <div className={"flex flex-row items-center gap-3"}>
          <SearchBar
            searchRef={searchRef}
            Search={search}
            setSearch={setSearch}
            width={"w-65 h-8 text-sm"}
            setValue={setQuery}
          />
          <BaseTooltip content={t("upload_doc")} position={"left"}>
            <BaseButton
              variant={"plus"}
              shape={"circle"}
              icon={<Plus />}
              onClick={() => setIsOpen((prev) => !prev)}
            />
          </BaseTooltip>
        </div>
      </div>
    </div>
  );
};

CourseOverviewHeader.displayName = "CourseOverviewHeader";
export default CourseOverviewHeader;
