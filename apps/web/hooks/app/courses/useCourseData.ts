"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type { CourseRow, FullCourseResponse } from "@studo/types";
import { courseKeys } from "./courseKeys";

// Course-data wordt primair door de server gehydrateerd (zie CourseStoreInitializer).
// We fetchen enkel wanneer er geen gehydrateerde entry is en refetchen nooit auto.

/** Course id uit de route (`/course/[id]`). */
function useCourseId(): string | undefined {
  const params = useParams<{ id?: string; course_id?: string }>();
  return params?.course_id ?? params?.id;
}

/** De course van de huidige route, gehydrateerd of gefetcht. */
export function useActiveCourse() {
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
  const { data } = useActiveCourse();
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
