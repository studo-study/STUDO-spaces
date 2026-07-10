import { create } from "zustand";
import type { Layout } from "react-grid-layout";
import {
  WIDGET_REGISTRY,
  type WidgetType,
} from "@/components/ui/app/private/course/overview/widgets/widgetRegistry";

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

function nextY(widgets: WidgetInstance[]) {
  return widgets.reduce((max, w) => Math.max(max, w.y + w.h), 0);
}

export const useWidgetMenu = create<WidgetMenuStore>((set) => ({
  courseId: null,
  activeWidgets: [],
  editMode: false,

  hydrate: (courseId, widgets) => set({ courseId, activeWidgets: widgets }),

  addWidget: (type) => {
    const def = WIDGET_REGISTRY[type];
    set((s) => {
      const widget: WidgetInstance = {
        id: crypto.randomUUID(),
        type,
        x: 0,
        y: nextY(s.activeWidgets), // drop it below everything
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
