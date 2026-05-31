import { useSync } from "../useSync";

export function useCourses() {
  const { courses, isLoading, error } = useSync();
  return { courses, isLoading, error };
}
