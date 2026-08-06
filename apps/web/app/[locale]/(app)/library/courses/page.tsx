import { Metadata } from "next";
import CourseGrid from "@/components/ui/app/private/library/courses/CourseGrid";

export const metadata: Metadata = {
  title: "courses | Studo",
};

export default function Page() {
  return (
    <div>
      <CourseGrid />
    </div>
  );
}
