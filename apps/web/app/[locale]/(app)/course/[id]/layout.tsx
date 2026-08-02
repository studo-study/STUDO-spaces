import { ReactNode } from "react";
import CoursePageHeader from "@/components/ui/app/private/course/layout/CoursePageHeader";
import PageContainer from "@/components/ui/design_system/page/PageContainer";
import CourseStoreInitializer from "@/components/providers/app/CourseStoreInitializer";
import { auth } from "@/auth";

export default async function CoursepageLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
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
      <CourseStoreInitializer course={data} />
      <PageContainer>
        <CoursePageHeader />
        <div className={"flex flex-1 min-h-0 w-full"}>{children}</div>
      </PageContainer>
    </>
  );
}
