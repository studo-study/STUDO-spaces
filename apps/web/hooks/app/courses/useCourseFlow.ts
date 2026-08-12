import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CourseRow, CourseTable, FullCourseResponse } from "@studo/types";
import { api } from "@/lib/api/api";
import { courseKeys } from "@/hooks/app/courses/courseKeys";
import { useCourseTable } from "@/hooks/app/courses/useCourse";
import { useUser } from "@/components/providers/auth/UserProvider";

/**
 * Bron van waarheid voor de flow-tabel = de react-query course-cache.
 * Elke rij-mutatie werkt de cache optimistisch bij en persisteert de volledige
 * gewenste rij-staat naar de backend (full sync op id + volgorde).
 */
export function useCourseFlow(courseId: string) {
  const qc = useQueryClient();
  const key = courseKeys.course(courseId);
  const table = useCourseTable(courseId);
  const rows = table?.rows ?? [];
  const user = useUser().user;

  const mutation = useMutation({
    mutationFn: (next: CourseRow[]) =>
      api<CourseTable>(`/api/courses/${courseId}/table`, {
        method: "PATCH",
        body: JSON.stringify({
          rows: next.map((r, i) => ({
            id: r.id,
            rowIndex: i + 1,
            title: r.title,
            status: r.status,
            priority: r.priority,
            type: r.type,
            description: r.description,
            dueDate: r.dueDate,
            resources: r.resources.map((res) => ({
              id: res.id,
              link: res.link,
            })),
          })),
        }),
      }),

    onMutate: async (next) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<FullCourseResponse>(key);
      qc.setQueryData<FullCourseResponse>(key, (old) =>
        old?.table
          ? {
              ...old,
              table: {
                ...old.table,
                rows: next.map((r, i) => ({ ...r, rowIndex: i + 1 })),
              },
            }
          : old,
      );
      return { prev };
    },

    onError: (_e, _next, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: key });
    },
  });

  // altijd de meest recente rijen uit de cache lezen zodat de callbacks stabiel
  // blijven (geen re-render van elke cel bij elke wijziging).
  const commit = useCallback(
    (updater: (rows: CourseRow[]) => CourseRow[]) => {
      const current =
        qc.getQueryData<FullCourseResponse>(key)?.table?.rows ?? [];
      mutation.mutate(updater(current));
    },
    [qc, key, mutation],
  );

  const updateRow = useCallback(
    (id: string, patch: Partial<CourseRow>) =>
      commit((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    [commit],
  );

  const addRow = useCallback(
    (index?: number) =>
      commit((rows) => {
        const tableId =
          qc.getQueryData<FullCourseResponse>(key)?.table?.id ?? "";
        const newRow: CourseRow = {
          id: crypto.randomUUID(),
          tableId,
          rowIndex: (index ?? rows.length) + 1,
          createdBy: user?.id ?? null,
          createdAt: new Date().toISOString(),
          status: null,
          priority: null,
          type: null,
          description: null,
          resources: [],
          dueDate: null,
          title: undefined,
        };
        const at = index ?? rows.length;
        return [...rows.slice(0, at), newRow, ...rows.slice(at)];
      }),
    [commit, qc, key, user?.id],
  );

  const removeRow = useCallback(
    (id: string) => commit((rows) => rows.filter((r) => r.id !== id)),
    [commit],
  );

  const removeRows = useCallback(
    (ids: string[]) => {
      const set = new Set(ids);
      commit((rows) => rows.filter((r) => !set.has(r.id)));
    },
    [commit],
  );

  const reorderRow = useCallback(
    (from: number, to: number) =>
      commit((rows) => {
        if (from === to || from < 0 || from >= rows.length) return rows;
        const next = [...rows];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      }),
    [commit],
  );

  return {
    table,
    rows,
    updateRow,
    addRow,
    removeRow,
    removeRows,
    reorderRow,
    isSaving: mutation.isPending,
  };
}
