"use client";
import { useEffect } from "react";
import { GridLayout, useContainerWidth, type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import {
  useWidgetMenu,
  type WidgetInstance,
} from "@/store/coursecontextmenu/WidgetMenuStore";
import {
  GRID_COLS,
  WIDGET_REGISTRY,
} from "@/components/ui/app/private/course/overview/widgetRegistry";
import WidgetItem from "@/components/ui/app/private/course/overview/WidgetItem";

const COLS = GRID_COLS;
const START_ROWS = 3;
const MARGIN = 16;

interface WigetGridLayoutProps {
  courseId: string;
}

const WigetGridLayout: React.FC<WigetGridLayoutProps> = ({ courseId }) => {
  const activeWidgets = useWidgetMenu((s) => s.activeWidgets);
  const editMode = useWidgetMenu((s) => s.editMode);
  const hydrate = useWidgetMenu((s) => s.hydrate);
  const applyLayout = useWidgetMenu((s) => s.applyLayout);

  const { width, containerRef, mounted } = useContainerWidth();

  // rowHeight so START_ROWS rows (+ gaps + padding) exactly fill the height.
  const rowHeight = 240;

  // Load persisted layout for the active course.
  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    fetch(`/api/flows/course/${courseId}/widgets`)
      .then((res) => (res.ok ? res.json() : { widgets: [] }))
      .then((data: { widgets?: WidgetInstance[] }) => {
        if (!cancelled) hydrate(courseId, data.widgets ?? []);
      })
      .catch(() => {
        if (!cancelled) hydrate(courseId, []);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId, hydrate]);

  const layout: Layout = activeWidgets.map((w) => {
    const def = WIDGET_REGISTRY[w.type];
    return {
      i: w.id,
      x: w.x,
      y: w.y,
      w: w.w,
      h: w.h,
      minW: def.minW,
      minH: def.minH,
    };
  });

  // Rows to paint behind the grid: cover the content plus a little headroom.
  const bottomRow = activeWidgets.reduce(
    (max, w) => Math.max(max, w.y + w.h),
    0,
  );
  const bgRows = Math.max(bottomRow + 1, START_ROWS);

  return (
    <div ref={containerRef} className={"group relative h-full min-h-0 flex-1"}>
      {mounted && width > 0 && (
        <>
          <GridBackground
            rows={bgRows}
            rowHeight={rowHeight}
            visible={editMode}
          />
          <GridLayout
            width={width}
            layout={layout}
            gridConfig={{
              cols: COLS,
              rowHeight: rowHeight,
              margin: [MARGIN, MARGIN],
            }}
            dragConfig={{
              enabled: editMode,
              handle: ".widget-drag-handle",
              threshold: 5,
            }}
            resizeConfig={{ enabled: editMode, handles: ["se"] }}
            onLayoutChange={applyLayout}
          >
            {activeWidgets.map((w) => (
              <div key={w.id}>
                <WidgetItem id={w.id} type={w.type} />
              </div>
            ))}
          </GridLayout>
        </>
      )}
    </div>
  );
};

function GridBackground({
  rows,
  rowHeight,
  visible,
}: {
  rows: number;
  rowHeight: number;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <div
      className={
        "pointer-events-none absolute inset-0 grid opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      }
      style={{
        padding: MARGIN,
        gap: MARGIN,
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        gridAutoRows: `${rowHeight}px`,
      }}
    >
      {Array.from({ length: COLS * rows }).map((_, i) => (
        <div
          key={i}
          className={"rounded-2xl border border-dashed border-studoblue/30"}
        />
      ))}
    </div>
  );
}

WigetGridLayout.displayName = "WigetGridLayout";
export default WigetGridLayout;
