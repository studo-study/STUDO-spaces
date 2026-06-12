import { useMutation } from "@tanstack/react-query";

// Folder functionality removed - folders have been replaced by flowcourses
export function useSaveStudoset(_setId: string) {
  const save = useMutation({
    mutationFn: async () => {},
  });

  const remove = useMutation({
    mutationFn: async () => {},
  });

  return { save, remove };
}
