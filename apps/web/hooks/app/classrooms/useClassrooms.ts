import { useQuery } from "@tanstack/react-query";
import type { FullClassroom } from "@/types/types";

export function useClassrooms() {
  const query = useQuery<FullClassroom[]>({
    queryKey: ["classrooms"],
    queryFn: () => fetch("/api/classrooms/me").then((r) => r.json()),
  });

  return {
    ...query,
    classrooms: query.data ?? [],
    isLoading: query.isLoading,
  };
}
