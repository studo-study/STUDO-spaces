"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import TableHeader from "@/components/ui/app/private/course/flow/table/TableHeader";
import TableRow from "@/components/ui/app/private/course/flow/table/TableRow";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { Grid2x2Plus } from "lucide-react";
import useCourseFlowStore from "@/components/ui/app/private/course/flow/table/courseFlowStore";
import { usePathname } from "@/i18n/routing";
import { useCourseTable } from "@/hooks/app/courses/useCourse";

interface Drag {
  id: number;
  x: number;
  y: number;
  offset: number;
  axis: "x" | "y" | null;
}

const TableDisplay = () => {
  // horizontale pan/scroll van de tabel
  const [offset, setOffset] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const courseId = usePathname().split("/")[2];
  const table = useCourseTable(courseId);
  //store
  const rows = useCourseFlowStore((state) => state.rows);
  // Stabiele lijst van rij-ids: selectie/navigatie werkt op id i.p.v. index,
  // zodat een cel-selectie niet verspringt bij reorder/verwijderen.
  const rowIds = useMemo(() => rows.map((row) => row.id), [rows]);
  const add = useCourseFlowStore((state) => state.addRow);
  const addRow = (index?: number) => {
    if (!table) {
      return;
    }
    const newRow = {
      id: crypto.randomUUID(),
      tableId: table.id,
      rowIndex: index ?? table.rows.length,
      createdBy: new Date().toLocaleDateString(),
      status: null,
      priority: null,
      type: null,
      description: null,
      resources: [],
      dueDate: null,
      title: undefined,
      studosetId: null,
      visualsetId: null,
      courseLink: null,
      summaryLink: null,
    };

    add(newRow, index ?? rows.length);
  };

  const [selectedCell, setSelectedCell] = useState<string>("");

  // afstand van de viewport-linkerrand tot de pagina-rand ([data-flow-boundary]).
  // gepinde kolommen pannen mee tot ze die rand raken en blijven daar plakken.
  const [gap, setGap] = useState(0);
  useEffect(() => {
    const measure = () => {
      const vp = viewport.current;
      const boundary = vp?.closest<HTMLElement>("[data-flow-boundary]");
      if (!vp || !boundary) return;
      const padLeft = parseFloat(getComputedStyle(boundary).paddingLeft) || 0;
      setGap(
        vp.getBoundingClientRect().left -
          (boundary.getBoundingClientRect().left + padLeft),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const clamp = useCallback((x: number) => {
    const max =
      (content.current?.scrollWidth ?? 0) -
      (viewport.current?.clientWidth ?? 0);
    return Math.min(0, Math.max(-Math.max(max, 0), x));
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      setOffset((prev) => clamp(prev - e.deltaX));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clamp]);

  useEffect(() => {
    const onResize = () => setOffset((prev) => clamp(prev));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      offset,
      axis: null,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;

    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;

    // eerst bepalen of dit een horizontale pan of een verticale scroll wordt
    if (d.axis === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (d.axis === "x") e.currentTarget.setPointerCapture(d.id);
    }

    if (d.axis === "y") return;
    setOffset(clamp(d.offset + dx));
  };

  const stop = () => (drag.current = null);

  return (
    <div className={"flex flex-col gap-3 w-full"}>
      <div
        ref={viewport}
        className="relative w-full  overflow-visible cursor-grab select-none active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
      >
        <div
          ref={content}
          className="w-max h-fit"
          style={{ transform: `translateX(${offset}px)` }}
        >
          <div role="grid" className={"min-w-0 h-fit flex flex-col w-fit"}>
            <TableHeader offset={offset} gap={gap} addRow={addRow} />
            {rows.map((row, index) => (
              <TableRow
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                key={row.id}
                offset={offset}
                gap={gap}
                row={row}
                addRow={addRow}
                rowIndex={index}
                rowIds={rowIds}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={"max-h-8 h-8"}>
        <BaseButton
          onClick={() => addRow()}
          variant={"hover"}
          className={"w-fit px-2 max-h-8"}
          label={"add row"}
          size={"sm"}
          iconLeft={<Grid2x2Plus size={15} />}
        />
      </div>
    </div>
  );
};

TableDisplay.displayName = "TableDisplay";
export default TableDisplay;
