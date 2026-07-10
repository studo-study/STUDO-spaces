"use client";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
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
import { flowKeys } from "./flowKeys";
import { useFlowCourse } from "./useFlowData";

// ─── Write-batching (ported from the old zustand store) ─────────────
interface DirtyEntry {
  endpoint: string;
  method: string;
  payload: Record<string, unknown>;
}

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

// ─── Cache helpers ──────────────────────────────────────────────────
function patchCourse(
  qc: QueryClient,
  courseId: string,
  updater: (c: FullFlowCourseResponse) => FullFlowCourseResponse,
) {
  qc.setQueryData<FullFlowCourseResponse>(flowKeys.course(courseId), (old) =>
    old ? updater(old) : old,
  );
}

/** Recompute course totals and roll them up into the parent board cache. */
function syncBoardTotals(qc: QueryClient, courseId: string) {
  const course = qc.getQueryData<FullFlowCourseResponse>(
    flowKeys.course(courseId),
  );
  if (!course?.boardId) return;
  const board = qc.getQueryData<FlowBoardResponse>(
    flowKeys.board(course.boardId),
  );
  if (!board) return;

  const rows = course.rows;
  const totalDone = rows.filter((r) => r.status === "done").length;
  const totalInProgress = rows.filter((r) => r.status === "doing").length;
  const totalLength = rows.length;

  const updatedCourses = board.courses.map((c) =>
    c.id === course.id ? { ...c, totalDone, totalInProgress, totalLength } : c,
  );

  qc.setQueryData<FlowBoardResponse>(flowKeys.board(course.boardId), {
    ...board,
    courses: updatedCourses,
    totalDone: updatedCourses.reduce((s, c) => s + c.totalDone, 0),
    totalInProgress: updatedCourses.reduce((s, c) => s + c.totalInProgress, 0),
    totalLength: updatedCourses.reduce((s, c) => s + c.totalLength, 0),
  });
}

// ─── Row mutations (scoped to the active course) ────────────────────
export function useFlowRows() {
  const qc = useQueryClient();
  const { data: course } = useFlowCourse();
  const courseId = course?.id;

  const addRow = async () => {
    if (!courseId) return;
    const current = qc.getQueryData<FullFlowCourseResponse>(
      flowKeys.course(courseId),
    );
    if (!current) return;

    const res = await fetch("/api/flows/rows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        title: "",
        status: "not_started",
        orderIndex: current.rows.length,
      } satisfies CreateFlowRow),
    });
    if (!res.ok) return;
    const newRow: FlowRowResponse = await res.json();
    patchCourse(qc, courseId, (c) => ({ ...c, rows: [...c.rows, newRow] }));
    syncBoardTotals(qc, courseId);
  };

  const updateRow = (rowId: string, updates: Record<string, unknown>) => {
    if (!courseId) return;
    const rest = updates;
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
    patchCourse(qc, courseId, (c) => ({
      ...c,
      rows: c.rows.map((r) => (r.id === rowId ? { ...r, ...updates } : r)),
    }));
    if ("status" in updates) syncBoardTotals(qc, courseId);
  };

  const deleteRow = (rowId: string) => {
    if (!courseId) return;
    // Cancel pending updates
    if (textTimers.has(rowId)) {
      clearTimeout(textTimers.get(rowId));
      textTimers.delete(rowId);
    }
    dirty.delete(`row:${rowId}`);

    patchCourse(qc, courseId, (c) => ({
      ...c,
      rows: c.rows.filter((r) => r.id !== rowId),
    }));

    fetch(`/api/flows/rows/${rowId}`, { method: "DELETE" });
    syncBoardTotals(qc, courseId);
  };

  return { addRow, updateRow, deleteRow };
}

// ─── Board & course mutations ───────────────────────────────────────
export function useFlowBoardMutations() {
  const qc = useQueryClient();

  const addBoard = (board: FlowBoardOverview) => {
    qc.setQueryData<FlowBoardOverview[]>(flowKeys.boards, (old) =>
      old ? [...old, board] : [board],
    );
  };

  const removeBoard = (id: string) => {
    qc.setQueryData<FlowBoardOverview[]>(flowKeys.boards, (old) =>
      old ? old.filter((b) => b.id !== id) : old,
    );
    fetch(`/api/flows/${id}`, { method: "DELETE" });
  };

  const addCourse = (course: FlowCourseResponse) => {
    if (!course.boardId) return;
    qc.setQueryData<FlowBoardResponse>(flowKeys.board(course.boardId), (old) =>
      old ? { ...old, courses: [...old.courses, course] } : old,
    );
  };

  const removeCourse = (courseId: string, boardId: string) => {
    qc.setQueryData<FlowBoardResponse>(flowKeys.board(boardId), (old) =>
      old
        ? { ...old, courses: old.courses.filter((c) => c.id !== courseId) }
        : old,
    );
    fetch(`/api/flows/course/${courseId}`, { method: "DELETE" });
  };

  return { addBoard, removeBoard, addCourse, removeCourse };
}
