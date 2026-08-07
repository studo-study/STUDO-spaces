"use client";
import { SegmentedControls } from "@/components/ui/design_system/segmentedcontrols/SegmentedControls";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { List, Table } from "lucide-react";
import TableControls from "@/components/ui/app/private/course/flow/table/TableControls";
import TableHeader from "@/components/ui/app/private/course/flow/table/TableHeader";

interface Drag {
  id: number;
  x: number;
  y: number;
  offset: number;
  axis: "x" | "y" | null;
}

const TableDisplayTabs = [
  {
    key: "table",
    label: "",
    icon: <Table size={15} />,
  },
  {
    key: "list",
    label: "",
    icon: <List size={15} />,
  },
];

const FlowTable = () => {
  const [tab, setTab] = useState("table");

  // horizontale pan/scroll van de tabel
  const [offset, setOffset] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);

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
    <div className={"flex flex-col gap-10"}>
      <div className={"w-full h-fit flex justify-between items-center"}>
        <SegmentedControls
          size={"sm"}
          tabs={TableDisplayTabs}
          value={tab}
          onChange={setTab}
        />
        <TableControls />
      </div>
      <div
        ref={viewport}
        className="relative min-h-200 w-full cursor-grab select-none active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
      >
        <div
          ref={content}
          className="absolute top-0 left-0 z-20"
          style={{ transform: `translateX(${offset}px)` }}
        >
          <div className={"min-w-0 min-h-0 flex-1 flex flex-col"}>
            {tab === "table" && <TableHeader />}
          </div>
        </div>
      </div>
    </div>
  );
};

FlowTable.displayName = "FlowTable";
export default FlowTable;
