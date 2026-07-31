import { useQuery } from "@tanstack/react-query";
import type { FullClassroom } from "@/types/types";

export function useClassrooms() {
  const query = useQuery<FullClassroom[]>({
    queryKey: ["classrooms"],
    queryFn: () =>
      fetch("/api/classroom/me").then((r) => {
        if (!r.ok)
          throw Object.assign(new Error("Failed to load classrooms"), {
            status: r.status,
          });
        return r.json();
      }),
  });

  return {
    ...query,
    classrooms: query.data ?? [],
    isLoading: query.isLoading,
  };
}
