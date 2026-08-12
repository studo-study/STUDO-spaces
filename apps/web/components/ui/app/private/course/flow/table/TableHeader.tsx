import {
  COURSE_GRID_TEMPLATE,
  TableColumns,
} from "@/components/ui/app/private/course/flow/table/TableColumns";
import { useTranslations } from "next-intl";
import classNames from "@/utils/classnames";
import { GripVertical, Plus } from "lucide-react";
import { CSSProperties } from "react";
import Check from "@/components/ui/design_system/input/Check";
import useCourseFlowStore from "@/components/ui/app/private/course/flow/table/courseFlowStore";

interface TableHeaderProps {
  offset: number;
  gap: number;
  addRow: (index: number) => void;
}

// controls-kolom zit 80px links van de content-origin (-mx-20), de eerste
// gepinde datakolom valt op de origin.
const CONTROLS_CELL_X = -80;
const PINNED_COL_X = 0;

const TableHeader = ({ offset, gap, addRow }: TableHeaderProps) => {
  const checkedIds = useCourseFlowStore((state) => state.selectedIds);
  const rows = useCourseFlowStore((state) => state.rows);
  const unCertain = checkedIds.length != 0 && checkedIds.length != rows.length;
  const checked = rows.length != 0 && checkedIds.length === rows.length;
  const setChecked = useCourseFlowStore((state) => state.toggleAll);
  const t = useTranslations("flow.course.table.header");
  // gepinde cel pant mee tot de pagina-rand en blijft daar plakken.
  const pinStyle = (pinned: boolean, cellX: number): CSSProperties =>
    pinned
      ? {
          transform: `translateX(${Math.max(0, -gap - cellX - offset)}px)`,
          zIndex: 10,
        }
      : {};
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
        style={pinStyle(true, CONTROLS_CELL_X)}
        className={classNames("h-full w-full", pinClass(true))}
      >
        <div
          className={
            "group cursor-pointer transition-opacity text-white duration-300 gap-2 h-full w-full flex items-center justify-between px-2 border-b border-studoborder/30 border-r"
          }
        >
          <Plus onClick={() => addRow(0)} />
          <GripVertical />
          <Check
            unCertain={unCertain}
            checked={checked}
            onChange={() => setChecked(rows.map((row) => row.id))}
          />
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
              ...pinStyle(col.isPinned, PINNED_COL_X),
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
