"use client";
import { SetStateAction, useEffect, useRef, useState } from "react";
import classNames from "@/utils/classnames";
import { SegmentedControls } from "@/components/ui/design_system/segmentedcontrols/SegmentedControls";
import { usePathname } from "@/i18n/routing";
import { useStudoset } from "@/hooks/app/sets/useStudoset";
import { useTranslations } from "next-intl";
import { FlowCourseResponse, FullStudysetResponse } from "@studo/types";
import Image from "next/image";
import FlowIcon from "@/components/ui/app/private/course/overview/FlowIcon";
import { getCoverImage } from "@/utils/getCoverImage";
import { Payload } from "@/components/ui/app/private/course_context_menu/chat/ChatInput";

interface EntityPickerItemProps {
  item: FullStudysetResponse | FlowCourseResponse;
  type: "studoset" | "course";
  payLoad: Payload[];
  setPayload: React.Dispatch<SetStateAction<Payload[]>>;
}
const EntityPickerItem: React.FC<EntityPickerItemProps> = (props) => {
  const { type, item, payLoad, setPayload } = props;

  const body: Payload = {
    id: type === "studoset" ? item.id : null,
    courseId: type === "course" ? item.id : null,
    title: item.title,
    type: type === "studoset" ? "set" : "course",
  };
  const matches = (p: Payload) =>
    p.type === body.type && p.id === body.id && p.courseId === body.courseId;
  const isAdded = payLoad.some(matches);
  const toggleAdd = () => {
    if (isAdded) {
      setPayload((prev) => prev.filter((p) => !matches(p)));
    } else {
      setPayload((prev) => [...prev, body]);
    }
  };

  return (
    <div
      onClick={toggleAdd}
      className={classNames(
        "w-full flex flex-row gap-2 px-2 py-2 rounded-full cursor-pointer hover:border-studoborder transition-colors duration-300 border bg-studogrey/30",
        isAdded ? "border-studoblue" : "border-studoborder/30",
      )}
    >
      {type === "course" && "flowcourseIcon" in item && item.flowcourseIcon ? (
        <FlowIcon
          icon={item.flowcourseIcon}
          size={22}
          className="w-5 h-5 rounded-lg"
        />
      ) : (
        <Image
          width={32}
          height={32}
          className="w-5"
          src={getCoverImage(item.title)}
          alt={item.title}
        />
      )}
      <span className={"dark:text-white"}>{item.title}</span>
    </div>
  );
};
interface EntityPickerDropdownProps {
  payLoad: Payload[];
  setPayload: React.Dispatch<SetStateAction<Payload[]>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLButtonElement | null>;
}

type Tab = "all" | "courses" | "sets";

const EntityPickerDropdown: React.FC<EntityPickerDropdownProps> = (props) => {
  const { isModalOpen, setIsModalOpen, containerRef, payLoad, setPayload } =
    props;
  const [tab, setTab] = useState<Tab>("all" as Tab);
  const t = useTranslations("svenchat");
  const modalRef = useRef<HTMLDivElement>(null);
  const path = usePathname().split("/");
  const recommended = useStudoset(path[path.length - 1]).data;
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef, isModalOpen, setIsModalOpen]);
  const currentSets = () => {
    if (!recommended) return null;
    return (
      <div
        className={"w-full flex flex-col border-b border-studoborder/30 pb-5"}
      >
        <span
          className={
            "w-full mb-2 items-centers text-start dark:text-studogrey text-sm "
          }
        >
          {t("recommended_title")}:
        </span>
        <EntityPickerItem
          item={recommended}
          payLoad={payLoad}
          setPayload={setPayload}
          type={"studoset"}
        />
      </div>
    );
  };
  return (
    <div
      ref={modalRef}
      onClick={(ev) => ev.stopPropagation()}
      className={classNames(
        "absolute min-w-80 h-110 backdrop-blur-2xl flex flex-col gap-2 p-3 rounded-4xl border border-studoborder/30 bg-studogrey/20",
        "absolute left-0 z-50 bottom-15",
      )}
    >
      <SegmentedControls
        stretch
        tabs={[
          { label: "All", key: "all" },
          { label: "Courses", key: "courses" },
          { label: "Sets", key: "sets" },
        ]}
        value={tab}
        onChange={(val) => setTab(val as Tab)}
      />
      <div className={"px-1 mb-2"}>{currentSets()}</div>
    </div>
  );
};

EntityPickerDropdown.displayName = "EntityPickerDropdown";
export default EntityPickerDropdown;
