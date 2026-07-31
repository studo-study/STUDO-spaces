"use client";
import { mockSummary } from "@/components/ui/app/private/course_context_menu/pdf_reader/mock/mock";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import classNames from "@/utils/classnames";
import { useMemo, useState } from "react";

interface FlatEntry {
  id: string;
  title: string;
  layer: number;
}

interface IndexItemProps {
  title: string;
  documentRef: React.RefObject<HTMLDivElement | null>;
  isHovering: boolean;
  neighbourHovering: boolean;
  setIsHover: (hovering: boolean) => void;
  layer: number;
}

const BASE_WIDTH: Record<number, number> = { 0: 32, 1: 20 };

const IndexItem: React.FC<IndexItemProps> = (props) => {
  const {
    title,
    documentRef,
    isHovering,
    neighbourHovering,
    setIsHover,
    layer,
  } = props;

  const base = BASE_WIDTH[layer] ?? BASE_WIDTH[1];
  const width = isHovering ? base + 20 : neighbourHovering ? base + 8 : base;

  const handleClick = () => {
    documentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <BaseTooltip content={title} position={"right"}>
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={handleClick}
        className={
          "flex items-center h-3 min-w-20 justify-start cursor-pointer py-px"
        }
      >
        <div
          style={{ width }}
          className={classNames(
            "h-0.5 rounded-full transition-all duration-150 ease-out",
            isHovering ? "bg-studoblue" : "bg-studoborder",
          )}
        />
      </div>
    </BaseTooltip>
  );
};

const flattenSummary = (summary: typeof mockSummary): FlatEntry[] => {
  const entries: FlatEntry[] = [];
  for (const chapter of summary.chapters) {
    entries.push({ id: chapter.id, title: chapter.title, layer: 0 });
    for (const sub of chapter.subchapters ?? []) {
      entries.push({ id: sub.id, title: sub.title, layer: 1 });
    }
  }
  return entries;
};

interface PdfIndexProps {
  sectionRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
}

const PdfIndex: React.FC<PdfIndexProps> = ({ sectionRefs }) => {
  const entries = useMemo(() => flattenSummary(mockSummary), []);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoveredIndex = entries.findIndex((e) => e.id === hoveredId);

  return (
    <div
      className={"h-full flex items-center justify-center px-5 flex-col gap-2"}
    >
      <div className={"flex flex-col min-w-20 justify-start"}>
        {entries.map((entry, index) => {
          return (
            <IndexItem
              key={entry.id}
              title={entry.title}
              layer={entry.layer}
              documentRef={{ current: sectionRefs.current?.[entry.id] ?? null }}
              isHovering={hoveredId === entry.id}
              neighbourHovering={
                hoveredIndex !== -1 && Math.abs(hoveredIndex - index) === 1
              }
              setIsHover={(hovering) =>
                setHoveredId(hovering ? entry.id : null)
              }
            />
          );
        })}
      </div>
    </div>
  );
};

PdfIndex.displayName = "PdfIndex";
export default PdfIndex;
