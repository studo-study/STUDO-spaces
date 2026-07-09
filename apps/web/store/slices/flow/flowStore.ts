import { create } from "zustand";
import type {
  FlowBoardOverview,
  FlowBoardResponse,
  FlowCourseResponse,
  FullFlowCourseResponse,
  FlowRowResponse,
  CreateFlowRow,
  UpdateFlowRow,
  Priority,
  Status,
} from "@studo/types";

interface DirtyEntry {
  endpoint: string;
  method: string;
  payload: Record<string, unknown>;
}

interface FlowState {
  // Data
  boards: FlowBoardOverview[];
  activeBoard: FlowBoardResponse | null;
  activeCourse: FullFlowCourseResponse | null;

  // UI
  createCourseOpen: boolean;
  courseView: "table" | "kanban" | "calendar";

  // Hydration
  setBoards: (boards: FlowBoardOverview[]) => void;
  setActiveBoard: (board: FlowBoardResponse) => void;
  setActiveCourse: (course: FullFlowCourseResponse) => void;
  clearActiveBoard: () => void;
  clearActiveCourse: () => void;

  // Board mutations
  addBoard: (board: FlowBoardOverview) => void;
  removeBoard: (id: string) => void;

  // Course mutations
  addCourse: (course: FlowCourseResponse) => void;
  removeCourse: (courseId: string) => void;

  // Row mutations
  addRow: () => Promise<void>;
  updateRow: (rowId: string, updates: Partial<FlowRowResponse>) => void;
  deleteRow: (rowId: string) => void;

  // UI actions
  toggleCreateCourse: () => void;
  setCreateCourseOpen: (open: boolean) => void;
  setCourseView: (view: "table" | "kanban" | "calendar") => void;
}

// ─── Internal state (not exposed to components) ─────────────
let dirty: Map<string, DirtyEntry> = new Map();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const textTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

function scheduleDirtyFlush() {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => flushDirty(), 600);
}

function flushDirty() {
  if (dirty.size === 0) return;
  const entries = Array.from(dirty.values());
  dirty = new Map();
  flushTimer = null;

  entries.forEach(({ endpoint, method, payload }) => {
    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  });
}

function mergeDirty(
  key: string,
  endpoint: string,
  method: string,
  payload: Record<string, unknown>,
) {
  const prev = dirty.get(key);
  dirty.set(key, {
    endpoint,
    method,
    payload: prev ? { ...prev.payload, ...payload } : payload,
  });
}

function syncBoardTotals(
  set: (state: Partial<FlowState>) => void,
  get: () => FlowState,
) {
  const { activeCourse, activeBoard } = get();
  if (!activeCourse || !activeBoard) return;

  const rows = activeCourse.rows;
  const totalDone = rows.filter(
    (r: FlowRowResponse) => r.status === "done",
  ).length;
  const totalInProgress = rows.filter(
    (r: FlowRowResponse) => r.status === "doing",
  ).length;
  const totalLength = rows.length;

  // Update the matching course in activeBoard.courses
  const updatedCourses = activeBoard.courses.map((c: FlowCourseResponse) =>
    c.id === activeCourse.id
      ? {
          ...c,
          total_done: totalDone,
          total_in_progress: totalInProgress,
          total_length: totalLength,
        }
      : c,
  );

  // Recalc board totals
  const boardDone = updatedCourses.reduce(
    (s: number, c: FlowCourseResponse) => s + c.totalDone,
    0,
  );
  const boardInProgress = updatedCourses.reduce(
    (s: number, c: FlowCourseResponse) => s + c.totalInProgress,
    0,
  );
  const boardLength = updatedCourses.reduce(
    (s: number, c: FlowCourseResponse) => s + c.totalLength,
    0,
  );

  set({
    activeBoard: {
      ...activeBoard,
      courses: updatedCourses,
      totalDone: boardDone,
      totalInProgress: boardInProgress,
      totalLength: boardLength,
    },
  });
}

// ─── Store ──────────────────────────────────────────────────
export const useFlowStore = create<FlowState>((set, get) => ({
  // Data
  boards: [],
  activeBoard: null,
  activeCourse: null,

  // UI
  createCourseOpen: false,
  courseView: "table",

  // ─── Hydration ──────────────────────────────────────────
  setBoards: (boards) => set({ boards }),

  setActiveBoard: (board) => set({ activeBoard: board }),

  setActiveCourse: (course) => set({ activeCourse: course }),

  clearActiveBoard: () => set({ activeBoard: null }),

  clearActiveCourse: () => set({ activeCourse: null }),

  // ─── Board mutations ────────────────────────────────────
  addBoard: (board) => set((s) => ({ boards: [...s.boards, board] })),

  removeBoard: (id) => {
    set((s) => ({ boards: s.boards.filter((b) => b.id !== id) }));
    fetch(`/api/flows/${id}`, { method: "DELETE" });
  },

  // ─── Course mutations ───────────────────────────────────
  addCourse: (course) => {
    set((s) => {
      if (!s.activeBoard) return s;
      return {
        activeBoard: {
          ...s.activeBoard,
          courses: [...s.activeBoard.courses, course],
        },
      };
    });
  },

  removeCourse: (courseId) => {
    set((s) => {
      if (!s.activeBoard) return s;
      return {
        activeBoard: {
          ...s.activeBoard,
          courses: s.activeBoard.courses.filter((c) => c.id !== courseId),
        },
      };
    });
    fetch(`/api/flows/course/${courseId}`, { method: "DELETE" });
  },

  // ─── Row mutations ──────────────────────────────────────
  addRow: async () => {
    const { activeCourse } = get();
    if (!activeCourse) return;

    const res = await fetch("/api/flows/rows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: activeCourse.id,
        title: "",
        status: "not_started",
        orderIndex: activeCourse.rows.length,
      } satisfies CreateFlowRow),
    });
    if (!res.ok) return;
    const newRow: FlowRowResponse = await res.json();
    set((s) => {
      if (!s.activeCourse) return s;
      return {
        activeCourse: {
          ...s.activeCourse,
          rows: [...s.activeCourse.rows, newRow],
        },
      };
    });
    syncBoardTotals(set, get);
  },

  updateRow: (rowId, updates) => {
    const { ...rest } = updates as Record<string, unknown>;
    const payload: UpdateFlowRow = {};
    if (rest.title !== undefined) payload.title = rest.title as string;
    if (rest.order_index !== undefined)
      payload.orderIndex = rest.order_index as number;
    if (rest.description !== undefined)
      payload.description = rest.description as string;
    if (rest.priority !== undefined)
      payload.priority = rest.priority as Priority;
    if (rest.status !== undefined) payload.status = rest.status as Status;
    if (rest.due_date !== undefined) payload.dueDate = rest.due_date as string;
    if (rest.studoset_id !== undefined)
      payload.studosetId = rest.studoset_id as string;
    if (rest.visualset_id !== undefined)
      payload.visualsetId = rest.visualset_id as string;

    const dirtyKey = `row:${rowId}`;
    const endpoint = `/api/flows/rows/${rowId}`;
    const isTextOnly = "title" in updates && Object.keys(updates).length === 1;

    if (isTextOnly) {
      // Tier 1: debounce text input
      const existing = textTimers.get(rowId);
      if (existing) clearTimeout(existing);

      textTimers.set(
        rowId,
        setTimeout(() => {
          textTimers.delete(rowId);
          mergeDirty(
            dirtyKey,
            endpoint,
            "PATCH",
            payload as Record<string, unknown>,
          );
          scheduleDirtyFlush();
        }, 600),
      );
    } else {
      // Tier 2: immediate dirty + schedule flush
      if (textTimers.has(rowId)) {
        clearTimeout(textTimers.get(rowId));
        textTimers.delete(rowId);
      }
      mergeDirty(
        dirtyKey,
        endpoint,
        "PATCH",
        payload as Record<string, unknown>,
      );
      scheduleDirtyFlush();
    }

    // Optimistic UI update
    set((s) => {
      if (!s.activeCourse) return s;
      return {
        activeCourse: {
          ...s.activeCourse,
          rows: s.activeCourse.rows.map((r) =>
            r.id === rowId ? { ...r, ...updates } : r,
          ),
        },
      };
    });
    if ("status" in updates) syncBoardTotals(set, get);
  },

  deleteRow: (rowId) => {
    // Cancel pending updates
    if (textTimers.has(rowId)) {
      clearTimeout(textTimers.get(rowId));
      textTimers.delete(rowId);
    }
    dirty.delete(`row:${rowId}`);

    // Optimistic UI
    set((s) => {
      if (!s.activeCourse) return s;
      return {
        activeCourse: {
          ...s.activeCourse,
          rows: s.activeCourse.rows.filter((r) => r.id !== rowId),
        },
      };
    });

    fetch(`/api/flows/rows/${rowId}`, { method: "DELETE" });
    syncBoardTotals(set, get);
  },

  // ─── UI actions ─────────────────────────────────────────
  toggleCreateCourse: () =>
    set((s) => ({ createCourseOpen: !s.createCourseOpen })),

  setCreateCourseOpen: (open) => set({ createCourseOpen: open }),

  setCourseView: (view) => set({ courseView: view }),
}));

// ─── Selectors ──────────────────────────────────────────────
export const selectCourseTotals = (state: FlowState) => {
  const rows = state.activeCourse?.rows ?? [];
  return {
    totalLength: rows.length,
    done: rows.filter((r) => r.status === "done").length,
    inProgress: rows.filter((r) => r.status === "doing").length,
    containsRes: rows.some((r) => r.resources.length > 0),
  };
};

export const selectRows = (state: FlowState) => state.activeCourse?.rows ?? [];
