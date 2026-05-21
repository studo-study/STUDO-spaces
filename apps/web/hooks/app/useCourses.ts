import { useSets } from "./useSets";

export function useCourses() {
  const { sets, visualsets, isLoading, error } = useSets();
  const courses = [
    ...new Set(
      [...(sets ?? []), ...(visualsets ?? [])]
        .map((s: { course: string }) => s.course)
        .filter(Boolean),
    ),
  ];
  return { courses, isLoading, error };
}
