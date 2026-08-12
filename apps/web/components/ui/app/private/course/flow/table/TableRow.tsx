"use client";
import {
  COURSE_GRID_TEMPLATE,
  TableColumns,
} from "@/components/ui/app/private/course/flow/table/TableColumns";
import { GripVertical, Plus } from "lucide-react";
import classNames from "@/utils/classnames";
import {
  CSSProperties,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { CourseRow } from "@studo/types";
import useCourseFlowStore from "@/components/ui/app/private/course/flow/table/courseFlowStore";
import Check from "@/components/ui/design_system/input/Check";

interface TableCellProps {
  children?: ReactNode;
  rowIndex: number;
  rowId: string;
  rowIds: string[];
  colId: string;
  colIds: string[];
  selectedCell: string;
  setSelectedCell: React.Dispatch<SetStateAction<string>>;
  clearSelected: () => void;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  rowIndex,
  rowId,
  rowIds,
  colId,
  colIds,
  selectedCell,
  setSelectedCell,
  clearSelected,
}: TableCellProps) => {
  const cellRef = useRef<HTMLDivElement>(null);

  // Cel-identiteit hangt aan row.id (niet index) zodat de selectie de rij volgt
  // bij reorder/verwijderen; navigatie gebruikt de positie in rowIds.
  const celId = `${colId}-${rowId}`;
  const selected = selectedCell === celId;
  const colIndex = colIds.indexOf(colId);

  useEffect(() => {
    if (selected) {
      cellRef.current?.focus();
    }
  }, [selected]);

  const moveUp = () => {
    if (rowIndex > 0) {
      setSelectedCell(`${colId}-${rowIds[rowIndex - 1]}`);
    }
  };

  const moveDown = () => {
    if (rowIndex < rowIds.length - 1) {
      setSelectedCell(`${colId}-${rowIds[rowIndex + 1]}`);
    }
  };

  const moveLeft = () => {
    if (colIndex > 0) {
      const leftId = colIds[colIndex - 1];
      setSelectedCell(`${leftId}-${rowId}`);
    }
  };

  const moveRight = () => {
    if (colIndex < colIds.length - 1) {
      const rightId = colIds[colIndex + 1];
      setSelectedCell(`${rightId}-${rowId}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
      case "Enter":
        e.preventDefault();
        moveDown();
        break;
      case "ArrowUp":
        e.preventDefault();
        moveUp();
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveLeft();
        break;
      case "ArrowRight":
        e.preventDefault();
        moveRight();
        break;
      case "Tab":
        // Tab / Shift-Tab = horizontaal door de cellen.
        e.preventDefault();
        if (e.shiftKey) moveLeft();
        else moveRight();
        break;
      case "Escape":
        e.preventDefault();
        setSelectedCell("");
        break;
    }
  };

  return (
    <div
      ref={cellRef}
      role="gridcell"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => {
        // Een cel selecteren = de rij-selectie loslaten.
        clearSelected();
        setSelectedCell(celId);
      }}
      onKeyDown={handleKeyDown}
      className={classNames(
        "min-w-0 border-2 border-transparent rounded-xl rounded-br-none transition-colors duration-100 cursor-pointer z-[100] min-h-0 flex-1 outline-none",
        selected && "border-indigo-500 bg-studogrey/10",
      )}
    >
      {children}
      {selected && (
        <span
          aria-hidden
          className={
            "bg-indigo-500 rounded-full h-2 absolute -bottom-0.5 -right-0.5 w-2"
          }
        />
      )}
    </div>
  );
};
interface TableRowProps {
  offset: number;
  gap: number;
  row: CourseRow;
  addRow: (input?: number) => void;
  rowIndex: number;
  rowIds: string[];
  selectedCell: string;
  setSelectedCell: React.Dispatch<SetStateAction<string>>;
}

const CONTROLS_CELL_X = -80;
const PINNED_COL_X = 0;

const COL_IDS = TableColumns.map((col) => col.colId);

const TableRow = ({
  offset,
  gap,
  row,
  addRow,
  rowIndex,
  rowIds,
  selectedCell,
  setSelectedCell,
}: TableRowProps) => {
  // Predicate in de selector: rij abonneert enkel op zijn eigen selectie-status,
  // niet op de hele selectedIds-array (anders re-rendert elke rij bij elke toggle).
  const checked = useCourseFlowStore((state) =>
    state.selectedIds.includes(row.id),
  );
  const checkRow = useCourseFlowStore((state) => state.toggeSelectRow);
  const removeSelected = useCourseFlowStore((state) => state.removeSelected);
  const clearSelected = useCourseFlowStore((state) => state.clearSelected);
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
      role="row"
      aria-selected={checked}
      className={classNames(
        "h-10 max-h-10 z-100 relative min-h-10 min-w-0 -mx-20 flex-1 w-full grid group/row border-b border-studoborder/30",
        checked && "border-transparent",
      )}
      onKeyDown={(e) => {
        // Backspace verwijdert de geselecteerde rijen, maar niet terwijl je in
        // een tekstveld typt (voor wanneer cellen bewerkbaar worden).
        if (e.key !== "Backspace") return;
        const el = e.target as HTMLElement;
        const editing =
          el.isContentEditable ||
          el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA";
        if (!editing && checked) removeSelected();
      }}
      style={{
        gridTemplateColumns: COURSE_GRID_TEMPLATE,
      }}
    >
      <div
        className={classNames(
          "absolute w-full h-full",
          checked && "border-2 border-indigo-500 bg-studogrey/10",
        )}
      />
      <div
        style={pinStyle(true, CONTROLS_CELL_X)}
        className={classNames(
          "h-full relative border-b border-transparent w-full",
          pinClass(true),
        )}
      >
        <div
          className={classNames(
            "absolute w-full h-full",
            checked &&
              "border-l-2 border-b-2 border-t-2 border-indigo-500  rounded-tl-xl rounded-bl-xl  bg-studogrey/10",
          )}
        />
        <div
          onClick={() => {
            setSelectedCell("");
            checkRow(row.id);
          }}
          className={classNames(
            "group cursor-pointer gap-2 h-full w-full flex items-center justify-between px-2 ",
            checked && "bg-studogrey/30",
          )}
        >
          <button
            type="button"
            aria-label="Rij toevoegen"
            onClick={(e) => {
              e.stopPropagation();
              addRow(rowIndex + 1);
            }}
            className={classNames(
              "group-hover:opacity-100 opacity-0 transition-opacity duration-300",
              checked && "opacity-100",
            )}
          >
            <Plus />
          </button>
          <GripVertical
            className={classNames(
              "cursor-grab group-hover:opacity-100 opacity-0 transition-opacity duration-300",
              checked && "opacity-100",
            )}
          />
          <span onClick={(e) => e.stopPropagation()}>
            <Check
              checked={checked}
              onChange={() => {
                // Rij (de)selecteren = de cel-selectie loslaten.
                setSelectedCell("");
                checkRow(row.id);
              }}
              className={classNames(
                "group-hover:opacity-100 opacity-0",
                checked && "opacity-100",
              )}
            />
          </span>
        </div>
      </div>
      {TableColumns.map((col) => {
        return (
          <div
            key={col.colId}
            style={{
              width: col.width,
              minWidth: col.minWidth,
              maxWidth: col.maxWidth,
              ...pinStyle(col.isPinned, PINNED_COL_X),
            }}
            className={classNames(
              "flex flex-row group/cell h-10 w-full",
              pinClass(col.isPinned),
              checked && "bg-studogrey/30",
            )}
          >
            <div className={"relative min-w-0 flex w-full min-h-0 flex-1"}>
              <TableCell
                colIds={COL_IDS}
                colId={col.colId}
                rowIndex={rowIndex}
                rowId={row.id}
                rowIds={rowIds}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                clearSelected={clearSelected}
              ></TableCell>
            </div>
            <div
              className={
                "h-full border-r border-studoborder/30 group-last-of-type/cell:border-none flex"
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
