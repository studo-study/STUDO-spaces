import { auth } from "@/auth";
import FlowStoreInitializer from "@/components/providers/app/FlowStoreInitializer";
import CoursePageContent from "@/components/ui/app/private/course/page/CoursePage/CoursePageContent";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const token = session?.accessToken;
  const res = await fetch(`${process.env.AUTH_API_URL}/flows/course/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "GET",
  });

  const data = await res.json();

  return (
    <>
      <FlowStoreInitializer course={data} />
      <CoursePageContent />
    </>
  );
}
