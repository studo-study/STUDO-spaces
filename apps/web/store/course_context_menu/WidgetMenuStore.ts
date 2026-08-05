import { create } from "zustand";
import type { Layout } from "react-grid-layout";
import {
  GRID_COLS,
  WIDGET_REGISTRY,
  type WidgetType,
} from "@/components/ui/app/private/course/overview/widgetRegistry";

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface WidgetMenuStore {
  courseId: string | null;
  activeWidgets: WidgetInstance[];
  editMode: boolean;

  hydrate: (courseId: string, widgets: WidgetInstance[]) => void;
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  /** Merge new positions/sizes from react-grid-layout's onLayoutChange. */
  applyLayout: (layout: Layout) => void;
  setEditMode: (input: boolean) => void;
}

// ─── Backend persistence (debounced) ────────────────────────
let persistTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePersist(courseId: string | null, widgets: WidgetInstance[]) {
  if (!courseId) return;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    persistTimer = null;
    fetch(`/api/flows/course/${courseId}/widgets`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ widgets }),
    });
  }, 600);
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function overlaps(a: Rect, b: Rect) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

// First free slot in row-major order that fits w×h — so new widgets land
// beside existing ones when there's room, and only wrap below when full.
function findFreeSlot(widgets: WidgetInstance[], w: number, h: number) {
  for (let y = 0; ; y++) {
    for (let x = 0; x <= GRID_COLS - w; x++) {
      const candidate: Rect = { x, y, w, h };
      if (!widgets.some((wd) => overlaps(candidate, wd))) return { x, y };
    }
  }
}

export const useWidgetMenu = create<WidgetMenuStore>((set) => ({
  courseId: null,
  activeWidgets: [],
  editMode: false,

  hydrate: (courseId, widgets) => set({ courseId, activeWidgets: widgets }),

  addWidget: (type) => {
    const def = WIDGET_REGISTRY[type];
    set((s) => {
      const { x, y } = findFreeSlot(
        s.activeWidgets,
        def.defaultW,
        def.defaultH,
      );
      const widget: WidgetInstance = {
        id: crypto.randomUUID(),
        type,
        x,
        y,
        w: def.defaultW,
        h: def.defaultH,
      };
      const next = [...s.activeWidgets, widget];
      schedulePersist(s.courseId, next);
      return { activeWidgets: next };
    });
  },

  removeWidget: (id) =>
    set((s) => {
      const next = s.activeWidgets.filter((w) => w.id !== id);
      schedulePersist(s.courseId, next);
      return { activeWidgets: next };
    }),

  applyLayout: (layout) =>
    set((s) => {
      const byId = new Map(layout.map((l) => [l.i, l]));
      let changed = false;
      const next = s.activeWidgets.map((w) => {
        const l = byId.get(w.id);
        if (!l) return w;
        if (l.x === w.x && l.y === w.y && l.w === w.w && l.h === w.h) return w;
        changed = true;
        return { ...w, x: l.x, y: l.y, w: l.w, h: l.h };
      });
      if (!changed) return s;
      schedulePersist(s.courseId, next);
      return { activeWidgets: next };
    }),

  setEditMode: (input) => set({ editMode: input }),
}));
