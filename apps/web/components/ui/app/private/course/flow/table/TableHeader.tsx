import {
  COURSE_GRID_TEMPLATE,
  TableColumns,
} from "@/components/ui/app/private/course/flow/table/TableColumns";
import { useTranslations } from "next-intl";
import classNames from "@/utils/classnames";
import { GripVertical, Plus } from "lucide-react";
import type { CSSProperties } from "react";

interface TableHeaderProps {
  offset: number;
}

const TableHeader = ({ offset }: TableHeaderProps) => {
  const t = useTranslations("flow.course.table.header");
  const pinStyle = (pinned: boolean): CSSProperties =>
    pinned ? { transform: `translateX(${-offset}px)`, zIndex: 10 } : {};
  const pinClass = (pinned: boolean) =>
    pinned ? "relative bg-white dark:bg-slate-800" : "";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: COURSE_GRID_TEMPLATE,
        gridTemplateRows: "max-content",
      }}
      className={"w-full max-h-10 -mx-20 text-studogrey"}
    >
      <div
        style={pinStyle(true)}
        className={classNames("h-full w-full", pinClass(true))}
      >
        <div
          className={
            "hover:opacity-100 cursor-pointer opacity-0 transition-opacity duration-300 gap-2 h-full w-full flex items-center justify-between px-2"
          }
        >
          <Plus />
          <GripVertical />
          <input type={"checkbox"} />
        </div>
      </div>
      {TableColumns.map((col, index) => {
        const Icon = col.icon;
        return (
          <div
            className={classNames(
              "h-10 flex border-b border-studoborder/30 capitalize cursor-pointer font-medium items-center gap-2 hover:bg-studogrey/30 transition-colors duration-300 group/cell",
              pinClass(col.isPinned),
            )}
            key={col.colId + index}
            style={{
              width: col.width,
              minWidth: col.minWidth,
              maxWidth: col.maxWidth,
              ...pinStyle(col.isPinned),
            }}
          >
            <div className={"px-3 gap-2 min-h-0 flex-1 flex items-center"}>
              <Icon size={15} />
              {t(col.label)}
            </div>
            <button
              type={"button"}
              className={
                "h-10 cursor-col-resize w-1 border-r border-studoborder/30 group-last-of-type/cell:border-r-0"
              }
            />
          </div>
        );
      })}
    </div>
  );
};

TableHeader.displayName = "TableHeader";
export default TableHeader;
