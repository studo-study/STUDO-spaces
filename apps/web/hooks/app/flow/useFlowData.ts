"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type {
  FlowBoardOverview,
  FlowBoardResponse,
  FullFlowCourseResponse,
} from "@studo/types";
import { flowKeys } from "./flowKeys";

// The flow data is primarily hydrated by the server (see FlowStoreInitializer).
// Board/course queries stay fresh through optimistic mutation writes, so we
// only fetch when there is no hydrated entry and never auto-refetch.

/** Board id from the current route (`/board/[id]/...`). */
function useBoardId(): string | undefined {
  const params = useParams<{ id?: string }>();
  return params?.id;
}

/** Course id from the current route (`/board/[id]/[course_id]` or `/course/[id]`). */
function useCourseId(): string | undefined {
  const params = useParams<{ id?: string; course_id?: string }>();
  return params?.course_id ?? params?.id;
}

export function useFlowBoards() {
  return useQuery<FlowBoardOverview[]>({
    queryKey: flowKeys.boards,
    queryFn: async () => {
      const res = await fetch("/api/flows/me");
      const json = await res.json();
      return Array.isArray(json) ? json : (json?.boards ?? []);
    },
  });
}

export function useFlowBoard() {
  const id = useBoardId();
  const queryClient = useQueryClient();
  const hydrated = id
    ? queryClient.getQueryData<FlowBoardResponse>(flowKeys.board(id))
    : undefined;

  return useQuery<FlowBoardResponse>({
    queryKey: flowKeys.board(id ?? ""),
    queryFn: async () => {
      const res = await fetch(`/api/flows/board/${id}`);
      if (!res.ok) throw new Error(`Failed to load board ${id}`);
      return res.json();
    },
    // Only fetch when we actually have a hydrated board for this id; avoids
    // firing bogus requests when `id` is a course id (standalone course route).
    enabled: Boolean(id) && Boolean(hydrated),
    staleTime: Infinity,
  });
}

export function useFlowCourse() {
  const id = useCourseId();
  const queryClient = useQueryClient();
  const hydrated = id
    ? queryClient.getQueryData<FullFlowCourseResponse>(flowKeys.course(id))
    : undefined;

  return useQuery<FullFlowCourseResponse>({
    queryKey: flowKeys.course(id ?? ""),
    queryFn: async () => {
      const res = await fetch(`/api/flows/course/${id}`);
      if (!res.ok) throw new Error(`Failed to load course ${id}`);
      return res.json();
    },
    enabled: Boolean(id) && Boolean(hydrated),
    staleTime: Infinity,
  });
}

// ─── Derived helpers (replace the old zustand selectors) ────────────
export function useCourseRows() {
  const { data } = useFlowCourse();
  return data?.rows ?? [];
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
