"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type {
  BoardOverview,
  CourseRow,
  FullCourseResponse,
} from "@studo/types";
import { courseKeys } from "../courses/courseKeys";

// Course-data wordt primair door de server gehydrateerd (zie CourseStoreInitializer).
// Board/course-queries blijven vers via optimistische mutation-writes, dus we
// fetchen enkel wanneer er geen gehydrateerde entry is en refetchen nooit auto.

/** Board id uit de huidige route (`/board/[id]/...`). */
function useBoardId(): string | undefined {
  const params = useParams<{ id?: string }>();
  return params?.id;
}

/** Course id uit de route (`/board/[id]/[course_id]` of `/course/[id]`). */
function useCourseId(): string | undefined {
  const params = useParams<{ id?: string; course_id?: string }>();
  return params?.course_id ?? params?.id;
}

export function useFlowBoards() {
  return useQuery<BoardOverview[]>({
    queryKey: courseKeys.boards,
    queryFn: async () => {
      const res = await fetch("/api/courses/boards/me");
      const json = await res.json();
      return Array.isArray(json) ? json : (json?.boards ?? []);
    },
  });
}

export function useFlowBoard() {
  const id = useBoardId();
  const queryClient = useQueryClient();
  const hydrated = id
    ? queryClient.getQueryData<BoardOverview>(courseKeys.board(id))
    : undefined;

  return useQuery<BoardOverview>({
    queryKey: courseKeys.board(id ?? ""),
    queryFn: async () => {
      const res = await fetch(`/api/courses/boards/${id}`);
      if (!res.ok) throw new Error(`Failed to load board ${id}`);
      return res.json();
    },
    // Enkel fetchen wanneer er echt een gehydrateerd board is; voorkomt bogus
    // requests wanneer `id` een course-id is (standalone course-route).
    enabled: Boolean(id) && Boolean(hydrated),
    staleTime: Infinity,
  });
}

export function useFlowCourse() {
  const id = useCourseId();
  const queryClient = useQueryClient();
  const hydrated = id
    ? queryClient.getQueryData<FullCourseResponse>(courseKeys.course(id))
    : undefined;

  return useQuery<FullCourseResponse>({
    queryKey: courseKeys.course(id ?? ""),
    queryFn: async () => {
      const res = await fetch(`/api/courses/${id}`);
      if (!res.ok) throw new Error(`Failed to load course ${id}`);
      return res.json();
    },
    enabled: Boolean(id),
    initialData: hydrated,
    staleTime: Infinity,
  });
}

// ─── Afgeleide helpers ──────────────────────────────────────────────
/** Rows van de (ene) course-tabel, op rowIndex gesorteerd. */
export function useCourseRows(): CourseRow[] {
  const { data } = useFlowCourse();
  return [...(data?.table?.rows ?? [])].sort((a, b) => a.rowIndex - b.rowIndex);
}

export function useCourseTotals() {
  const rows = useCourseRows();
  return {
    totalLength: rows.length,
    done: rows.filter((r) => r.status === "done").length,
    inProgress: rows.filter((r) => r.status === "doing").length,
    containsRes: rows.some((r) => r.resources.length > 0),
  };
}
