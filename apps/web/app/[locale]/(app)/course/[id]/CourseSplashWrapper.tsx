"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { FullCourseResponse } from "@studo/types";
import SplashProvider, {
  useSplash,
} from "@/components/providers/app/SplashProvider";
import { useCourse } from "@/hooks/app/courses/useCourse";
import { courseKeys } from "@/hooks/app/courses/courseKeys";

// Sluit de splash zodra de course-data binnen is. Draait binnen SplashProvider
// zodat useSplash werkt.
function CourseSplashSync({ id }: { id: string }) {
  const { setLoaded } = useSplash();
  const { data } = useCourse(id);

  useEffect(() => {
    if (data?.id) setLoaded(true);
  }, [data?.id, setLoaded]);

  return null;
}

export default function CourseSplashWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData<FullCourseResponse>(
    courseKeys.course(id),
  );
  const alreadyLoaded = !!cached?.id;

  return (
    <SplashProvider initialLoaded={alreadyLoaded}>
      <CourseSplashSync id={id} />
      {children}
    </SplashProvider>
  );
}
