import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FlowCourseResponse } from "@studo/types";

interface CreateFlowcourseBody {
  title: string;
  icon: string;
  board_id?: string;
  description?: string;
  resource?: string;
  exam_date?: string;
  lesson_days?: string;
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation<FlowCourseResponse, Error, CreateFlowcourseBody>({
    mutationFn: (body) =>
      fetch("/api/flows/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => {
        if (!r.ok) throw new Error("Failed to create flowcourse");
        return r.json();
      }),

    onSuccess: (newCourse) => {
      queryClient.setQueryData<FlowCourseResponse[]>(["flowcourses"], (old) =>
        old ? [newCourse, ...old] : [newCourse],
      );
    },
  });
}
