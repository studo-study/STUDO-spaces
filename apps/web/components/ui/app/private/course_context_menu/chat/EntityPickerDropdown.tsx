import { SetStateAction, useEffect, useRef, useState } from "react";
import classNames from "@/utils/classnames";
import { SegmentedControls } from "@/components/ui/design_system/segmentedcontrols/SegmentedControls";

interface EntityPickerDropdownProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLButtonElement | null>;
}

type Tab = "all" | "courses" | "sets";
const EntityPickerDropdown: React.FC<EntityPickerDropdownProps> = (props) => {
  const { isModalOpen, setIsModalOpen, containerRef } = props;
  const [tab, setTab] = useState<Tab>("all" as Tab);
  const modalRef = useRef<HTMLDivElement>(null);
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
  return (
    <div
      ref={modalRef}
      onClick={(ev) => ev.stopPropagation()}
      className={classNames(
        "absolute min-w-80 h-110 flex flex-col gap-2 p-3 rounded-4xl border border-studoborder/30 bg-studogrey/20",
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
    </div>
  );
};

EntityPickerDropdown.displayName = "EntityPickerDropdown";
export default EntityPickerDropdown;
