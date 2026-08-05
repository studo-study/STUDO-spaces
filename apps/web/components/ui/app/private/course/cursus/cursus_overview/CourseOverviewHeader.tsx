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
import React, { useState } from "react";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { useTranslations } from "next-intl";

type CourseTab = "all" | "summary" | "course" | "notes";
const CourseOverviewHeader = () => {
  const t = useTranslations("flow.course");
  const [tab, setTab] = useState<CourseTab>("all");

  return (
    <div>
      <BottomProgress />
      <div className={"flex justify-between items-center p-5 gap-5"}>
        <div>
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
            searchRef={null}
            toggleSearch={function (): void {
              throw new Error("Function not implemented.");
            }}
            Search={false}
            setSearch={function (value: React.SetStateAction<boolean>): void {
              throw new Error("Function not implemented.");
            }}
            width={"w-65 h-8 text-sm"}
          />
          <BaseTooltip content={t("upload_doc")} position={"left"}>
            <BaseButton variant={"plus"} shape={"circle"} icon={<Plus />} />
          </BaseTooltip>
        </div>
      </div>
    </div>
  );
};

CourseOverviewHeader.displayName = "CourseOverviewHeader";
export default CourseOverviewHeader;
