import { Metadata } from "next";
import { auth } from "@/auth";
import { AllsetsResponse } from "@studo/types";
import CourseGrid from "@/components/ui/app/private/your-files/courses/CourseGrid";

export const metadata: Metadata = {
  title: "courses | Studo",
};

export default async function Page() {
  const session = await auth();
  const token = session?.accessToken;
  const data = (await fetch(`${process.env.AUTH_API_URL}/users/me/studosets`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  }).then((res) => res.json())) as AllsetsResponse;

  const courses = new Set<string>();
  data.studysets?.forEach((item: { course: string }) =>
    courses.add(item.course),
  );
  data.visualsets?.forEach((item: { course: string }) =>
    courses.add(item.course),
  );

  return (
    <div>
      <CourseGrid />
    </div>
  );
}
