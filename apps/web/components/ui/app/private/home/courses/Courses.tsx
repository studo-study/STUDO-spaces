"use client";
import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import Container from "@/components/ui/design_system/container/Container";
import { useTranslations } from "next-intl";
import CourseItem from "@/components/ui/app/private/library/courses/courseItem";
import { useCourses } from "@/hooks/app/courses/useCourses";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import { BookOpen } from "lucide-react";

const Courses = () => {
  const { data: courses = [] } = useCourses();
  const t = useTranslations("home");

  if (courses.length === 0) return null;

  return (
    <AnimateOnMount delay={100}>
      <section className="flex flex-col gap-5 overflow-visible">
        <SectionHeader
          sectionIcon={<BookOpen size={18} />}
          title={t("courses_overview_title")}
          linkText={t("all_courses")}
          href={"/library/courses"}
        />
        <Container height={"30"}>
          <div className="min-w-full w-full flex flex-row gap-5">
            {courses.map((item) => (
              <CourseItem course={item} key={item.id} />
            ))}
          </div>
        </Container>
      </section>
    </AnimateOnMount>
  );
};

Courses.displayName = "Courses";
export default Courses;
