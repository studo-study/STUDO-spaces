import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CourseDocument } from "@studo/types";
import { courseKeys } from "./courseKeys";

/** Upload één of meer documenten naar een course (multipart → backend). */
export function useUploadFile(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation<CourseDocument[], Error, File[]>({
    mutationFn: async (files) => {
      const formData = new FormData();
      formData.append("courseId", courseId);
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/courses/course-upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload files");
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.course(courseId) });
    },
  });
}
