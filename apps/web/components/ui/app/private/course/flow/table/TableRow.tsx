import {
  COURSE_GRID_TEMPLATE,
  TableColumns,
} from "@/components/ui/app/private/course/flow/table/TableColumns";
import { GripVertical, Plus } from "lucide-react";
import classNames from "@/utils/classnames";
import type { CSSProperties } from "react";

interface TableRowProps {
  offset: number;
}

const TableRow = ({ offset }: TableRowProps) => {
  // gepinde cel: counter-transform tegen de pan zodat hij vast blijft staan,
  // + eigen bg/z zodat de meepannende kolommen eronder verdwijnen.
  const pinStyle = (pinned: boolean): CSSProperties =>
    pinned ? { transform: `translateX(${-offset}px)`, zIndex: 10 } : {};
  const pinClass = (pinned: boolean) =>
    pinned ? "relative bg-white dark:bg-slate-800" : "";

  return (
    <div
      className={
        "h-10 max-h-10 min-h-10 min-w-0 -mx-20 flex-1 w-full grid group/row"
      }
      style={{
        gridTemplateColumns: COURSE_GRID_TEMPLATE,
      }}
    >
      <div
        style={pinStyle(true)}
        className={classNames("h-full w-full", pinClass(true))}
      >
        <div
          className={
            "opacity-0 group-hover/row:opacity-100 cursor-pointer transition-opacity duration-300 gap-2 h-full w-full flex items-center justify-between px-2"
          }
        >
          <Plus />
          <GripVertical />
          <input type={"checkbox"} />
        </div>
      </div>
      {TableColumns.map((col, index) => {
        return (
          <div
            key={col.colId + index}
            style={{
              width: col.width,
              minWidth: col.minWidth,
              maxWidth: col.maxWidth,
              ...pinStyle(col.isPinned),
            }}
            className={classNames(
              "flex flex-row group/cell h-10 w-full border-b border-studoborder/30",
              pinClass(col.isPinned),
            )}
          >
            <div className={"min-w-0 min-h-0 flex-1 px-3"}></div>
            <div
              className={
                "h-full border-r border-studoborder/30 group-last-of-type/cell:border-none"
              }
            />
          </div>
        );
      })}
    </div>
  );
};

TableRow.displayName = "TableRow";
export default TableRow;
