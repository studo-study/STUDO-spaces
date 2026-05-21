import { useQuery } from "@tanstack/react-query";

export function useClassrooms() {
  return useQuery({
    queryKey: ["classrooms"],
  });
}
