import { useQuery } from "@tanstack/react-query";
import type { FullClassroom } from "@/types/types";

export function useClassrooms() {
  const { data, isLoading, error } = useQuery<FullClassroom[]>({
    queryKey: ["classrooms"],
    queryFn: () => fetch("/api/classrooms/me").then((r) => r.json()),
  });

  return {
    classrooms: data ?? [],
    isLoading,
    error,
  };
}
