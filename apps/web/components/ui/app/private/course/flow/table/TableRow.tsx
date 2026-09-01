"use client";
import {
  COURSE_GRID_TEMPLATE,
  TableColumns,
} from "@/components/ui/app/private/course/flow/table/TableColumns";
import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Circle,
  GalleryVerticalEnd,
  GripVertical,
  NotebookPen,
  Plus,
  TriangleRight,
  List,
  Pencil,
  SquareCheck,
  ScrollText,
} from "lucide-react";
import classNames from "@/utils/classnames";
import {
  CSSProperties,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { CourseRow, RowPriority, RowStatus, RowType } from "@studo/types";
import useCourseFlowStore from "@/components/ui/app/private/course/flow/table/courseFlowStore";
import Check from "@studo/ui/design_system/input/Check";
import { useLocale, useTranslations } from "next-intl";
import Select from "@studo/ui/design_system/select/Select";
import DatePicker from "@studo/ui/design_system/date_picker/DatePicker";
import ResourceCell from "@/components/ui/app/private/course/flow/table/ResourceCell";

type UpdateRow = (id: string, patch: Partial<CourseRow>) => void;

interface CellContentProps {
  colId: string;
  ref: RefObject<HTMLInputElement | null>;
  row: CourseRow;
  updateRow: UpdateRow;
}
const CellContent: React.FC<CellContentProps> = (props) => {
  const { colId, ref, row, updateRow } = props;
  const locale = useLocale();
  const t = useTranslations("flow.course");

  const creationDate =
    row.createdAt &&
    new Date(row.createdAt).toLocaleDateString(locale).split("-").join("/");
  if (colId === "titleColumn") {
    return (
      <div className={"w-full h-full text-sm px-3"}>
        <input
          key={row.title ?? ""}
          ref={ref}
          type="text"
          defaultValue={row.title ?? ""}
          onBlur={(e) => {
            if (e.target.value !== (row.title ?? ""))
              updateRow(row.id, { title: e.target.value });
          }}
          className={"outline-none h-full w-full"}
          placeholder={t("title_in_row")}
        />
      </div>
    );
  }

  if (colId === "statusColumn") {
    return (
      <div
        className={
          "w-full dark:text-white text-studodarkblue h-full flex items-center"
        }
      >
        <Select
          value={row.status ?? undefined}
          onChange={(val) => updateRow(row.id, { status: val as RowStatus })}
          className={
            "text-sm px-2 min-w-full h-full z-9999 justify-between bg-none border-none bg-transparent truncate text-start w-full"
          }
          size={"xs"}
          align={"center"}
          options={[
            {
              label: t("not_started"),
              value: "not_started",
              icon: <Circle size={15} className={"stroke-rose-500"} />,
            },
            {
              label: t("doing"),
              value: "doing",
              icon: <Circle size={15} className={"stroke-amber-500"} />,
            },
            {
              label: t("done"),
              value: "done",
              icon: <Circle size={15} className={"stroke-emerald-500"} />,
            },
          ]}
          placeholder={t("select")}
        />
      </div>
    );
  }

  if (colId === "createdAtColumn") {
    return (
      <div className={"w-full h-full px-3 flex items-center justify-center"}>
        {creationDate && (
          <span
            className={
              "min-w-fit text-center text-xs px-3 py-1.5 rounded-full truncate bg-studogrey/30"
            }
          >
            {creationDate}
          </span>
        )}
      </div>
    );
  }

  if (colId === "descriptionColumn") {
    return (
      <div className={"w-full h-full text-sm px-3"}>
        <input
          key={row.description ?? ""}
          ref={ref}
          type="text"
          defaultValue={row.description ?? ""}
          onBlur={(e) => {
            if (e.target.value !== (row.description ?? ""))
              updateRow(row.id, { description: e.target.value });
          }}
          className={"outline-none h-full w-full"}
          placeholder={t("desc_in_row")}
        />
      </div>
    );
  }

  if (colId === "priorityColumn") {
    return (
      <div className={"w-full h-full px-3 flex items-center justify-center"}>
        <Select
          value={row.priority ?? undefined}
          onChange={(val) =>
            updateRow(row.id, { priority: val as RowPriority })
          }
          className={
            "text-sm px-2 w-full h-full z-9999 bg-none border-none bg-transparent"
          }
          size={"xs"}
          align={"center"}
          options={[
            {
              label: t("high"),
              value: "high",
              icon: (
                <ChartNoAxesColumnIncreasing
                  size={15}
                  className={"stroke-rose-500"}
                />
              ),
            },
            {
              label: t("medium"),
              value: "medium",
              icon: (
                <ChartNoAxesColumnIncreasing
                  size={15}
                  className={"stroke-amber-500"}
                />
              ),
            },
            {
              label: t("low"),
              value: "low",
              icon: (
                <ChartNoAxesColumnIncreasing
                  size={15}
                  className={"stroke-emerald-500"}
                />
              ),
            },
            {
              label: t("no_priority"),
              value: "no_priority",
              icon: <TriangleRight className={"opacity-50"} size={15} />,
            },
          ]}
          placeholder={t("select")}
        />
      </div>
    );
  }

  if (colId === "dueDateColumn") {
    return (
      <div className={"min-w-full h-full flex items-center"}>
        <DatePicker
          size={"sm"}
          align={"start"}
          variant={"default"}
          className={
            "w-full truncate flex-1 min-w-0 border-none text-sm bg-transparent"
          }
          value={row.dueDate ? new Date(row.dueDate) : null}
          onChange={(date) =>
            updateRow(row.id, { dueDate: date.toISOString().slice(0, 10) })
          }
          placeholder={t("select")}
        />
      </div>
    );
  }

  if (colId === "typeColumn") {
    return (
      <div className={"w-full h-full px-3 flex items-center justify-center"}>
        <Select
          value={row.type ?? undefined}
          onChange={(val) => updateRow(row.id, { type: val as RowType })}
          className={
            "text-sm px-2 w-full h-full z-9999 bg-none border-none bg-transparent"
          }
          size={"xs"}
          align={"center"}
          options={[
            {
              label: t("course_label"),
              value: "course",
              icon: <BookOpen size={15} className={"stroke-blue-500"} />,
            },
            {
              label: t("notes"),
              value: "notes",
              icon: <NotebookPen size={15} className={"stroke-blue-500"} />,
            },
            {
              label: t("summary"),
              value: "summary",
              icon: <List size={15} className={"stroke-blue-500"} />,
            },
            {
              label: t("abstract"),
              value: "abstract",
              icon: <ScrollText className={"stroke-blue-500"} size={15} />,
            },
            {
              label: t("sample_exam"),
              value: "sample_exam",
              icon: <Pencil className={"stroke-blue-500"} size={15} />,
            },
            {
              label: t("task"),
              value: "task",
              icon: <SquareCheck className={"stroke-blue-500"} size={15} />,
            },
            {
              label: t("set"),
              value: "set",
              icon: (
                <GalleryVerticalEnd className={"stroke-blue-500"} size={15} />
              ),
            },
          ]}
          placeholder={t("select")}
        />
      </div>
    );
  }

  if (colId === "resourceColumn") {
    return <ResourceCell row={row} updateRow={updateRow} />;
  }
  return <div></div>;
};

interface TableCellProps {
  rowIndex: number;
  rowId: string;
  rowIds: string[];
  colId: string;
  colIds: string[];
  selectedCells: string[];
  setSelectedCells: React.Dispatch<SetStateAction<string[]>>;
  clearSelected: () => void;
  row: CourseRow;
  updateRow: UpdateRow;
  addRow: (input?: number) => void;
}

const TableCell: React.FC<TableCellProps> = ({
  rowIndex,
  rowId,
  rowIds,
  colId,
  colIds,
  selectedCells,
  setSelectedCells,
  clearSelected,
  row,
  updateRow,
  addRow,
}: TableCellProps) => {
  const cellRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const celId = `${colId}-${rowId}`;
  const selected = selectedCells.includes(celId);
  const soleSelected = selectedCells.length === 1 && selectedCells[0] === celId;
  const colIndex = colIds.indexOf(colId);

  useEffect(() => {
    if (soleSelected) {
      cellRef.current?.focus();
      inputRef?.current?.focus();
    }
  }, [soleSelected]);

  const moveUp = () => {
    if (rowIndex > 0) {
      setSelectedCells([`${colId}-${rowIds[rowIndex - 1]}`]);
    }
  };

  const moveDown = () => {
    if (rowIndex < rowIds.length - 1) {
      setSelectedCells([`${colId}-${rowIds[rowIndex + 1]}`]);
    }
  };

  const moveLeft = () => {
    if (colIndex > 0) {
      const leftId = colIds[colIndex - 1];
      setSelectedCells([`${leftId}-${rowId}`]);
    }
  };

  const moveRight = () => {
    if (colIndex < colIds.length - 1) {
      const rightId = colIds[colIndex + 1];
      setSelectedCells([`${rightId}-${rowId}`]);
    }
  };

  // toggle deze cel in/uit de multi-selectie (ctrl/cmd-klik).
  const toggleCell = () => {
    setSelectedCells((prev) =>
      prev.includes(celId)
        ? prev.filter((id) => id !== celId)
        : [...prev, celId],
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
      case "Enter":
        e.preventDefault();
        if (e.shiftKey) {
          moveUp();
          break;
        }
        if (rowIndex == rowIds.length - 1) {
          addRow(rowIds.length);
          setSelectedCells([`${colId}-${rowIds[rowIndex + 1]}`]);
        }
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
        setSelectedCells([]);
        break;
    }
  };

  return (
    <div
      ref={cellRef}
      role="gridcell"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) {
          toggleCell();
        } else {
          clearSelected();
          setSelectedCells([celId]);
        }
      }}
      onKeyDown={handleKeyDown}
      className={classNames(
        "min-w-0 border-2 border-transparent rounded-xl rounded-br-none transition-colors duration-100 cursor-pointer z-100 min-h-0 flex-1 outline-none",
        selected && "border-indigo-500 bg-studogrey/10",
      )}
    >
      <CellContent
        colId={colId}
        row={row}
        ref={inputRef}
        updateRow={updateRow}
      />
      {selected && (
        <span
          aria-hidden
          className={
            "bg-indigo-500 rounded-full cursor-row-resize h-2 absolute -bottom-0.5 -right-0.5 w-2"
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
  updateRow: UpdateRow;
  removeRow: (id: string) => void;
  removeSelected: () => void;
  rowIndex: number;
  rowIds: string[];
  selectedCells: string[];
  setSelectedCells: React.Dispatch<SetStateAction<string[]>>;
  onRowDragStart: (index: number) => void;
  onRowDragOver: (index: number) => void;
  onRowDrop: (index: number) => void;
  onRowDragEnd: () => void;
  isDragOver: boolean;
}

const CONTROLS_CELL_X = -80;
const PINNED_COL_X = 0;

const COL_IDS = TableColumns.map((col) => col.colId);

const TableRow = ({
  offset,
  gap,
  row,
  addRow,
  updateRow,
  removeSelected,
  rowIndex,
  rowIds,
  selectedCells,
  setSelectedCells,
  onRowDragStart,
  onRowDragOver,
  onRowDrop,
  onRowDragEnd,
  isDragOver,
}: TableRowProps) => {
  const checked = useCourseFlowStore((state) =>
    state.selectedIds.includes(row.id),
  );
  // buren-selectie: aangrenzende geselecteerde rijen vormen één blok → de
  // border ertussen valt weg, ronding enkel aan de uiteinden van de groep.
  const prevChecked = useCourseFlowStore(
    (state) => rowIndex > 0 && state.selectedIds.includes(rowIds[rowIndex - 1]),
  );
  const nextChecked = useCourseFlowStore(
    (state) =>
      rowIndex < rowIds.length - 1 &&
      state.selectedIds.includes(rowIds[rowIndex + 1]),
  );
  const checkRow = useCourseFlowStore((state) => state.toggeSelectRow);
  const clearSelected = useCourseFlowStore((state) => state.clearSelected);

  const [dragArmed, setDragArmed] = useState(false);
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
      draggable={dragArmed}
      onDragStart={() => onRowDragStart(rowIndex)}
      onDragOver={(e) => {
        e.preventDefault();
        onRowDragOver(rowIndex);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onRowDrop(rowIndex);
      }}
      onDragEnd={() => {
        setDragArmed(false);
        onRowDragEnd();
      }}
      className={classNames(
        "h-10 max-h-10 z-100 relative min-h-10 min-w-0 -mx-20 flex-1 w-full grid group/row border-b border-neutral-200/30",
        checked && "border-transparent",
        isDragOver && "border-b-2 border-indigo-500",
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
          checked && "border-x-2 border-indigo-500 bg-studogrey/10",
          checked && !prevChecked && "border-t-2 rounded-t-xl",
          checked && !nextChecked && "border-b-2 rounded-b-xl",
        )}
      />
      <div
        style={pinStyle(true, CONTROLS_CELL_X)}
        className={classNames(
          "h-full relative border-b border-neutral-200/30 border-r w-full ",
          checked && !nextChecked && "rounded-bl-2xl",
          pinClass(true),
        )}
      >
        <div
          className={classNames(
            "absolute w-full h-full",
            checked && "border-l-2 border-indigo-500 bg-studogrey/10",
            checked && !prevChecked && "border-t-2 rounded-tl-xl",
            checked && !nextChecked && "border-b-2 rounded-bl-xl",
          )}
        />
        <div
          onClick={() => {
            setSelectedCells([]);
            checkRow(row.id);
          }}
          className={classNames(
            "group cursor-pointer gap-2 h-full w-full flex items-center justify-between px-2 ",
            checked && "bg-studogrey/30 z-200",
            checked && !prevChecked && "rounded-tl-2xl",
            checked && !nextChecked && "rounded-bl-2xl",
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
            <Plus size={17} />
          </button>
          <GripVertical
            // grip indrukken "wapent" de rij zodat native drag start; loslaten reset
            onMouseDown={(e) => {
              e.stopPropagation();
              setDragArmed(true);
            }}
            onMouseUp={() => setDragArmed(false)}
            className={classNames(
              "cursor-grab active:cursor-grabbing group-hover:opacity-100 opacity-0 transition-opacity duration-300",
              checked && "opacity-100",
            )}
          />
          <span onClick={(e) => e.stopPropagation()}>
            <Check
              checked={checked}
              onChange={() => {
                // Rij (de)selecteren = de cel-selectie loslaten.
                setSelectedCells([]);
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
                row={row}
                colIds={COL_IDS}
                colId={col.colId}
                rowIndex={rowIndex}
                rowId={row.id}
                rowIds={rowIds}
                selectedCells={selectedCells}
                setSelectedCells={setSelectedCells}
                clearSelected={clearSelected}
                updateRow={updateRow}
                addRow={addRow}
              />
            </div>
            <div
              className={
                "h-full border-r border-neutral-200/30 group-last-of-type/cell:border-none flex"
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
