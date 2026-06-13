import { ReactNode } from "react";
import CoursePageHeader from "@/components/ui/app/private/course/page/CoursePage/CoursePageHeader";
import PageContainer from "@/components/ui/design_system/page/PageContainer";

export default function CoursepageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageContainer>
      <CoursePageHeader />
      {children}
    </PageContainer>
  );
}
