"use client";
import { useQueryClient } from "@tanstack/react-query";
import { courseKeys } from "@/hooks/app/courses/courseKeys";
import type { FullCourseResponse } from "@studo/types";

interface Props {
  course?: FullCourseResponse;
}

// Seeds de react-query cache met server-gefetchte course-data, zodat de client
// query-hooks gehydrateerd renderen zonder extra roundtrip.
export default function CourseStoreInitializer({ course }: Props) {
  const queryClient = useQueryClient();

  if (course) queryClient.setQueryData(courseKeys.course(course.id), course);

  return null;
}
